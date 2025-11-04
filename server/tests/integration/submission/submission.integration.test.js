// tests/integration/submission/submission.integration.test.js
import app from '../../../src/app.js';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../../src/composition-root.js';
import {
  instructor,
  student,
  otherStudent,
  courseTemplate,
  assignmentFutureTemplate,
  assignmentPastTemplate
} from './submission.test-data.js';

jest.setTimeout(20000);

describe('Submit assignment integration tests', () => {
  let createdInstructor;
  let createdStudent;
  let createdOtherStudent;
  let createdCourse;
  let createdAssignmentFuture;
  let createdAssignmentPast;
  let enrollmentRecord;
  let testFilePath;

  beforeAll(async () => {
    // 1) create users explicitly and verify results
    createdInstructor = await prisma.user.create({
      data: {
        email: instructor.email,
        name: instructor.name
      }
    });
    if (!createdInstructor || !createdInstructor.id) throw new Error('Failed to create instructor in beforeAll');

    createdStudent = await prisma.user.create({
      data: {
        email: student.email,
        name: student.name
      }
    });
    if (!createdStudent || !createdStudent.id) throw new Error('Failed to create student in beforeAll');

    createdOtherStudent = await prisma.user.create({
      data: {
        email: otherStudent.email,
        name: otherStudent.name
      }
    });
    if (!createdOtherStudent || !createdOtherStudent.id) throw new Error('Failed to create other student in beforeAll');

    // 2) create a course and explicitly set instructorId (avoid nested connect complexity)
    createdCourse = await prisma.course.create({
      data: {
        ...courseTemplate,
        instructorId: createdInstructor.id
      }
    });

    if (!createdCourse || !createdCourse.id) throw new Error('Failed to create course in beforeAll');

    // 3) create assignments (future and past)
    const now = Date.now();
    createdAssignmentFuture = await prisma.assignment.create({
      data: {
        title: assignmentFutureTemplate.title,
        description: assignmentFutureTemplate.description,
        courseId: createdCourse.id,
        dueDate: new Date(now + assignmentFutureTemplate.dueOffsetMs)
      }
    });

    createdAssignmentPast = await prisma.assignment.create({
      data: {
        title: assignmentPastTemplate.title,
        description: assignmentPastTemplate.description,
        courseId: createdCourse.id,
        dueDate: new Date(now + assignmentPastTemplate.dueOffsetMs)
      }
    });

    // 4) create enrollment explicitly (use userId + courseId)
    enrollmentRecord = await prisma.enrollment.create({
      data: {
        userId: createdStudent.id,
        courseId: createdCourse.id,
        status: 'ENROLLED',
        isPaid: false
      }
    });

    // 5) create a temporary test file in uploads folder
    const uploadsDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    testFilePath = path.join(uploadsDir, `test-file-${Date.now()}.txt`);
    fs.writeFileSync(testFilePath, 'hello test file', 'utf8');
  });

  afterAll(async () => {
    // delete created submissions (by assignment ids)
    try {
      if (createdAssignmentFuture?.id || createdAssignmentPast?.id) {
        await prisma.submission.deleteMany({
          where: {
            assignmentId: { in: [createdAssignmentFuture?.id, createdAssignmentPast?.id].filter(Boolean) }
          }
        });
      }
    } catch (e) {
      console.error('Cleanup submissions error', e);
    }

    // delete enrollments for this course
    try {
      await prisma.enrollment.deleteMany({
        where: {
          courseId: createdCourse?.id
        }
      });
    } catch (e) {
      console.error('Cleanup enrollments error', e);
    }

    // delete assignments
    try {
      await prisma.assignment.deleteMany({
        where: { courseId: createdCourse?.id }
      });
    } catch (e) {
      console.error('Cleanup assignments error', e);
    }

    // delete course
    try {
      await prisma.course.deleteMany({
        where: { id: createdCourse?.id }
      });
    } catch (e) {
      console.error('Cleanup course error', e);
    }

    // delete users by email
    try {
      await prisma.user.deleteMany({
        where: {
          email: { in: [instructor.email, student.email, otherStudent.email] }
        }
      });
    } catch (e) {
      console.error('Cleanup users error', e);
    }

    // delete test file if exists
    try {
      if (testFilePath && fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
    } catch (e) {
      // ignore
    }
  });

  describe('Normal cases', () => {
    it('Student can submit assignment with text + file -> returns 201 and DB stored', async () => {
      const studentRecord = await prisma.user.findUnique({ where: { email: student.email } });
      const res = await request(app)
        .post(`/courses/${createdCourse.id}/assignments/${createdAssignmentFuture.id}/submissions`)
        .set('x-user-id', studentRecord.id)
        .field('content', 'My assignment content')
        .attach('file', testFilePath);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('submissionId');
      expect(res.body.data).toHaveProperty('version', 1);
      expect(res.body.data).toHaveProperty('status');
      expect(['SUBMITTED', 'LATE', 'NEEDS_RESUBMIT', 'GRADED']).toContain(res.body.data.status);
      expect(res.body.data).toHaveProperty('submittedAt');

      // check DB entry
      const dbSub = await prisma.submission.findUnique({
        where: { id: res.body.data.submissionId }
      });
      expect(dbSub).not.toBeNull();
      expect(dbSub.content).toBe('My assignment content');
      expect(dbSub.fileUrl).toBeTruthy();
      // status check: if dueDate in future, expect SUBMITTED
      expect(dbSub.status).toBe(res.body.data.status);
    });

    it('Student resubmits -> version increases to 2', async () => {
      const studentRecord = await prisma.user.findUnique({ where: { email: student.email } });
      const res2 = await request(app)
        .post(`/courses/${createdCourse.id}/assignments/${createdAssignmentFuture.id}/submissions`)
        .set('x-user-id', studentRecord.id)
        .field('content', 'My resubmitted content');

      expect(res2.status).toBe(201);
      expect(res2.body).toHaveProperty('success', true);
      expect(res2.body.data).toHaveProperty('version', 2);
    });

    it('Late submission returns status LATE', async () => {
      const studentRecord = await prisma.user.findUnique({ where: { email: student.email } });
      const res = await request(app)
        .post(`/courses/${createdCourse.id}/assignments/${createdAssignmentPast.id}/submissions`)
        .set('x-user-id', studentRecord.id)
        .field('content', 'Late submission');

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('status', 'LATE');

      const dbSub = await prisma.submission.findUnique({
        where: { id: res.body.data.submissionId }
      });
      expect(dbSub).not.toBeNull();
      expect(dbSub.status).toBe('LATE');
    });
  });

  describe('Abnormal cases', () => {
    it('Not enrolled student cannot submit -> returns 400', async () => {
      const other = await prisma.user.findUnique({ where: { email: otherStudent.email } });
      const res = await request(app)
        .post(`/courses/${createdCourse.id}/assignments/${createdAssignmentFuture.id}/submissions`)
        .set('x-user-id', other.id)
        .field('content', 'I should not be able to submit');

      // controller was designed to throw Error('Student is not enrolled...') -> 400
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toMatch(/enrolled/i);
    });

    it('Submitting to non-existing assignment -> returns 400 or 404', async () => {
      const studentRecord = await prisma.user.findUnique({ where: { email: student.email } });
      const fakeAssignmentId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .post(`/courses/${createdCourse.id}/assignments/${fakeAssignmentId}/submissions`)
        .set('x-user-id', studentRecord.id)
        .field('content', 'Submit to nonexisting');

      expect([400, 404]).toContain(res.status);
    });
  });
});
