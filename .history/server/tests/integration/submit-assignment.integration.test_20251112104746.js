import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../src/app.js';

const prisma = new PrismaClient();

describe('Submit Assignment API', () => {
  let userId, courseId, assignmentId;

  // ✅ FIX 1: Tăng timeout cho beforeAll (30 giây)
  beforeAll(async () => {
    // ✅ FIX 2: Test kết nối database trước
    try {
      await prisma.$connect();
      console.log('✅ Database connected');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }

    // Tạo user
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test Student',
        username: `test${Date.now()}`
      }
    });
    userId = user.id;
    console.log('✅ User created:', userId);

    // Tạo course
    const course = await prisma.course.create({
      data: {
        title: 'Test Course',
        level: 'Beginner',
        published: true
      }
    });
    courseId = course.id;
    console.log('✅ Course created:', courseId);

    // Tạo assignment
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

    // Enroll user
    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'ENROLLED',
        isPaid: true
      }
    });
    console.log('✅ Enrollment created');
  }, 30000); // ← Timeout 30 giây

  // ✅ FIX 3: Tăng timeout cho afterAll
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
      console.log('✅ Database disconnected');
    }
  }, 30000); // ← Timeout 30 giây

  const submitAssignment = (assignmentId, data) =>
    request(app)
      .post(`/courses/assignments/${assignmentId}/submit`)
      .send(data);

  // ✅ FIX 4: Tăng timeout cho mỗi test (10 giây)
  it('should submit successfully', async () => {
    const res = await submitAssignment(assignmentId, {
      studentId: userId,
      content: 'My submission',
      fileUrl: 'https://example.com/file.pdf'
    });

    console.log('Response status:', res.status);
    console.log('Response body:', res.body);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SUBMITTED');
  }, 10000);

  it('should fail if already submitted', async () => {
    // Tạo assignment mới để tránh conflict
    const newAssignment = await prisma.assignment.create({
      data: {
        courseId,
        title: 'Test Assignment for Duplicate',
        dueDate: new Date('2025-12-31'),
        maxPoints: 100
      }
    });

    // Submit lần 1
    await submitAssignment(newAssignment.id, { 
      studentId: userId, 
      content: 'First submission' 
    });
    
    // Submit lần 2 - phải fail
    const res = await submitAssignment(newAssignment.id, { 
      studentId: userId, 
      content: 'Second submission' 
    });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('You have already submitted this assignment');

    // Cleanup
    await prisma.submission.deleteMany({ 
      where: { assignmentId: newAssignment.id } 
    });
    await prisma.assignment.delete({ 
      where: { id: newAssignment.id } 
    });
  }, 10000);

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
  }, 10000);

  it('should fail if no content or fileUrl', async () => {
    const res = await submitAssignment(assignmentId, { 
      studentId: userId 
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please provide either content or file');
  }, 10000);
});