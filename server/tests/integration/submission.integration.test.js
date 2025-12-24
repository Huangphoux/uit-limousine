import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import path from 'path';
import fs from 'fs';
import prisma from '../../src/lib/prisma.js';
import app from '../../src/app.js';
import { loginUseCase } from '../../src/composition-root.js';
import bcrypt from 'bcrypt';

describe('Submit Assignment API', () => {
  let userId, courseId, assignmentId;
  let authToken;
  let testFilePath;

  beforeAll(async () => {
    await prisma.$connect();
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test Student',
        username: `test${Date.now()}`,
        password: hashedPassword
      }
    });
    userId = user.id;

    const loginResult = await loginUseCase.execute({ email: user.email, password });
    authToken = loginResult.accessToken;

    const course = await prisma.course.create({
      data: {
        title: 'Test Course',
        level: 'Beginner',
        published: true
      }
    });
    courseId = course.id;

    const assignment = await prisma.assignment.create({
      data: {
        courseId,
        title: 'Test Assignment',
        dueDate: new Date('2025-12-31'),
        maxPoints: 100
      }
    });
    assignmentId = assignment.id;

    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'ENROLLED',
        isPaid: true
      }
    });

    const testDir = path.join(process.cwd(), 'tests', 'fixtures');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    testFilePath = path.join(testDir, 'test-submission.zip');
    fs.writeFileSync(testFilePath, Buffer.from('PK test zip content'));
  }, 30000);

  afterAll(async () => {
    try {
      await prisma.submission.deleteMany({ where: { studentId: userId } });
      await prisma.enrollment.deleteMany({ where: { userId } });
      await prisma.assignment.deleteMany({ where: { courseId } });
      await prisma.course.delete({ where: { id: courseId } });
      await prisma.user.delete({ where: { id: userId } });

      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }

      const uploadsDir = path.join(process.cwd(), 'uploads', 'submissions');
      if (fs.existsSync(uploadsDir)) {
        fs.rmSync(uploadsDir, { recursive: true, force: true });
      }
    } catch (error) {
    } finally {
      await prisma.$disconnect();
    }
  }, 30000);

  const submitAssignmentWithFile = (assignmentId, studentId, filePath) =>
    request(app)
      .post(`/courses/assignments/${assignmentId}/submit`)
      .field('studentId', studentId)
      .attach('file', filePath);

  const submitAssignmentWithContent = (assignmentId, data) =>
    request(app)
      .post(`/courses/assignments/${assignmentId}/submit`)
      .set('Authorization', `Bearer ${authToken}`)
      .field('studentId', data.studentId)
      .field('content', data.content || '');
      .send(data);

  it('should submit with file successfully', async () => {
    const newAssignment = await prisma.assignment.create({
      data: {
        courseId,
        title: 'Test Assignment File Upload',
        dueDate: new Date('2025-12-31'),
        maxPoints: 100
      }
    });

    const res = await submitAssignmentWithFile(newAssignment.id, userId, testFilePath);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SUBMITTED');
    expect(res.body.data.fileUrl).toBeDefined();
    expect(res.body.data.fileUrl).toContain('/uploads/submissions/');

    await prisma.submission.deleteMany({ where: { assignmentId: newAssignment.id } });
    await prisma.assignment.delete({ where: { id: newAssignment.id } });
  }, 20000);

  it('should submit with content successfully', async () => {
    const newAssignment = await prisma.assignment.create({
      data: {
        courseId,
        title: 'Test Assignment Content',
        dueDate: new Date('2025-12-31'),
        maxPoints: 100
      }
    });

    const res = await submitAssignmentWithContent(newAssignment.id, {
      studentId: userId,
      content: 'My submission content'
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SUBMITTED');
    expect(res.body.data.content).toBe('My submission content');

    await prisma.submission.deleteMany({ where: { assignmentId: newAssignment.id } });
    await prisma.assignment.delete({ where: { id: newAssignment.id } });
  }, 20000);

  it('should fail if already submitted', async () => {
    const newAssignment = await prisma.assignment.create({
      data: {
        courseId,
        title: 'Test Assignment Duplicate',
        dueDate: new Date('2025-12-31'),
        maxPoints: 100
      }
    });

    const res1 = await submitAssignmentWithContent(newAssignment.id, {
      studentId: userId,
      content: 'First'
    });

    const res2 = await submitAssignmentWithContent(newAssignment.id, {
      studentId: userId,
      content: 'Second'
    });

    expect(res2.status).toBe(403);
    expect(res2.body.message).toBe('You have already submitted this assignment');

    await prisma.submission.deleteMany({ where: { assignmentId: newAssignment.id } });
    await prisma.assignment.delete({ where: { id: newAssignment.id } });
  }, 20000);

  it('should fail if assignment not found', async () => {
    const res = await submitAssignmentWithContent('00000000-0000-0000-0000-000000000000', {
      studentId: userId,
      content: 'Test'
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Assignment not found');
  }, 10000);

  it('should fail if not enrolled', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user2 = await prisma.user.create({
      data: {
        email: `other-${Date.now()}@example.com`,
        username: `other${Date.now()}`,
        password: hashedPassword
      }
    });

    const loginResult = await loginUseCase.execute({ email: user2.email, password });
    const user2Token = loginResult.accessToken;

    const res = await submitAssignmentWithContent(assignmentId, {
      studentId: user2.id,
      content: 'Test'
    }).set('Authorization', `Bearer ${user2Token}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('You are not enrolled in this course');

    await prisma.user.delete({ where: { id: user2.id } });
  }, 20000);

  it('should fail if no content or file', async () => {
    const newAssignment = await prisma.assignment.create({
      data: {
        courseId,
        title: 'Test Assignment No Content',
        dueDate: new Date('2025-12-31'),
        maxPoints: 100
      }
    });

    const res = await request(app)
      .post(`/courses/assignments/${newAssignment.id}/submit`)
      .field('studentId', userId);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please provide either content or file');

    await prisma.assignment.delete({ where: { id: newAssignment.id } });
  }, 10000);

  it('should mark as late if past due date', async () => {
    const pastDueAssignment = await prisma.assignment.create({
      data: {
        courseId,
        title: 'Past Due Assignment',
        dueDate: new Date('2020-01-01'),
        maxPoints: 100
      }
    });

    const res = await submitAssignmentWithContent(pastDueAssignment.id, {
      studentId: userId,
      content: 'Late submission'
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('LATE');
    expect(res.body.message).toContain('Late submission');

    await prisma.submission.deleteMany({ where: { assignmentId: pastDueAssignment.id } });
    await prisma.assignment.delete({ where: { id: pastDueAssignment.id } });
  }, 20000);
});