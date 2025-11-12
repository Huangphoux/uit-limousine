import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import prisma from '../../src/lib/prisma.js'; // ← IMPORT TỪ LIB
import app from '../../src/app.js';

describe('Submit Assignment API', () => {
  let userId, courseId, assignmentId;

  beforeAll(async () => {
    await prisma.$connect();
   

    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test Student',
        username: `test${Date.now()}`
      }
    });
    userId = user.id;
    console.log('✅ User created:', userId);

    const course = await prisma.course.create({
      data: {
        title: 'Test Course',
        level: 'Beginner',
        published: true
      }
    });
    courseId = course.id;
    console.log('✅ Course created:', courseId);

    const assignment = await prisma.assignment.create({
      data: {
        courseId,
        title: 'Test Assignment',
        dueDate: new Date('2025-12-31'),
        maxPoints: 100
      }
    });
    assignmentId = assignment.id;
    console.log('✅ Assignment created:', assignmentId);

    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'ENROLLED',
        isPaid: true
      }
    });
    console.log('✅ Enrollment created');
  }, 30000);

  afterAll(async () => {
    try {
      await prisma.submission.deleteMany({ where: { studentId: userId } });
      await prisma.enrollment.deleteMany({ where: { userId } });
      await prisma.assignment.deleteMany({ where: { courseId } });
      await prisma.course.delete({ where: { id: courseId } });
      await prisma.user.delete({ where: { id: userId } });
      console.log('✅ Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup error:', error.message);
    } finally {
      await prisma.$disconnect();
    }
  }, 30000);

  const submitAssignment = (assignmentId, data) =>
    request(app)
      .post(`/courses/assignments/${assignmentId}/submit`)
      .send(data);

  it('should submit successfully', async () => {
    console.log('\n🧪 TEST: should submit successfully');

    const res = await submitAssignment(assignmentId, {
      studentId: userId,
      content: 'My submission',
      fileUrl: 'https://example.com/file.pdf'
    });

    console.log('Response status:', res.status);
    console.log('Response body:', JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SUBMITTED');
  }, 20000);

  it('should fail if already submitted', async () => {
    console.log('\n🧪 TEST: should fail if already submitted');
    
    const newAssignment = await prisma.assignment.create({
      data: {
        courseId,
        title: 'Test Assignment Duplicate',
        dueDate: new Date('2025-12-31'),
        maxPoints: 100
      }
    });

    const res1 = await submitAssignment(newAssignment.id, { 
      studentId: userId, 
      content: 'First' 
    });
    console.log('First submit:', res1.status);
    
    const res2 = await submitAssignment(newAssignment.id, { 
      studentId: userId, 
      content: 'Second' 
    });
    console.log('Second submit:', res2.status);

    expect(res2.status).toBe(403);
    expect(res2.body.message).toBe('You have already submitted this assignment');

    await prisma.submission.deleteMany({ where: { assignmentId: newAssignment.id } });
    await prisma.assignment.delete({ where: { id: newAssignment.id } });
  }, 20000);

  it('should fail if assignment not found', async () => {
    const res = await submitAssignment('00000000-0000-0000-0000-000000000000', { 
      studentId: userId, 
      content: 'Test' 
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Assignment not found');
  }, 10000);

  it('should fail if not enrolled', async () => {
    const user2 = await prisma.user.create({
      data: { 
        email: `other-${Date.now()}@example.com`, 
        username: `other${Date.now()}` 
      }
    });

    const res = await submitAssignment(assignmentId, { 
      studentId: user2.id, 
      content: 'Test' 
    });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('You are not enrolled in this course');

    await prisma.user.delete({ where: { id: user2.id } });
  }, 20000);

  it('should fail if no content or fileUrl', async () => {
    const res = await submitAssignment(assignmentId, { 
      studentId: userId 
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please provide either content or file');
  }, 10000);
});