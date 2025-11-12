import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../src/app.js';

const prisma = new PrismaClient();

describe('Submit Assignment API', () => {
  let userId, courseId, assignmentId;

  beforeAll(async () => {
    // Tạo user
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test Student',
        username: `test${Date.now()}`
      }
    });
    userId = user.id;

    // Tạo course
    const course = await prisma.course.create({
      data: {
        title: 'Test Course',
        level: 'Beginner',
        published: true
      }
    });
    courseId = course.id;

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

    // Enroll user
    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'ENROLLED',
        isPaid: true
      }
    });
  });

  afterAll(async () => {
    await prisma.submission.deleteMany({ where: { studentId: userId } });
    await prisma.enrollment.deleteMany({ where: { userId } });
    await prisma.assignment.deleteMany({ where: { courseId } });
    await prisma.course.delete({ where: { id: courseId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  const submitAssignment = (assignmentId, data) =>
    request(app)
      .post(`/api/courses/assignments/${assignmentId}/submit`)
      .send(data);

  it('should submit successfully', async () => {
    const res = await submitAssignment(assignmentId, {
      studentId: userId,
      content: 'My submission',
      fileUrl: 'https://example.com/file.pdf'
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SUBMITTED');
  });

  it('should fail if already submitted', async () => {
    await submitAssignment(assignmentId, { studentId: userId, content: 'First' });
    const res = await submitAssignment(assignmentId, { studentId: userId, content: 'Second' });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('You have already submitted this assignment');
  });

  it('should fail if assignment not found', async () => {
    const res = await submitAssignment('invalid-id', { studentId: userId, content: 'Test' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Assignment not found');
  });

  it('should fail if not enrolled', async () => {
    const user2 = await prisma.user.create({
      data: { email: `other-${Date.now()}@example.com`, username: `other${Date.now()}` }
    });

    const res = await submitAssignment(assignmentId, { studentId: user2.id, content: 'Test' });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('You are not enrolled in this course');

    await prisma.user.delete({ where: { id: user2.id } });
  });

  it('should fail if no content or fileUrl', async () => {
    const res = await submitAssignment(assignmentId, { studentId: userId });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please provide either content or file');
  });
});