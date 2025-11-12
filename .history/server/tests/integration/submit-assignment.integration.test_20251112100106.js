import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../src/app.js'; // hoặc đường dẫn đúng đến app

const prisma = new PrismaClient();

describe('Submit Assignment API', () => {
  let testUser;
  let testCourse;
  let testAssignment;
  let testEnrollment;

  // Tạo dữ liệu test trước khi chạy
  beforeAll(async () => {
    // 1. Tạo user (student)
    testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test Student',
        username: `teststudent${Date.now()}`
      }
    });

    // 2. Tạo course
    testCourse = await prisma.course.create({
      data: {
        title: 'Test English Course',
        shortDesc: 'Test description',
        level: 'Beginner',
        published: true
      }
    });

    // 3. Tạo assignment
    testAssignment = await prisma.assignment.create({
      data: {
        courseId: testCourse.id,
        title: 'Test Assignment',
        description: 'Test description',
        dueDate: new Date('2025-12-31'), // Deadline tương lai
        maxPoints: 100
      }
    });

    // 4. Enroll user vào course
    testEnrollment = await prisma.enrollment.create({
      data: {
        userId: testUser.id,
        courseId: testCourse.id,
        status: 'ENROLLED',
        isPaid: true
      }
    });
  });

  // Xóa dữ liệu test sau khi chạy xong
  afterAll(async () => {
    await prisma.submission.deleteMany({
      where: { studentId: testUser.id }
    });
    await prisma.enrollment.deleteMany({
      where: { userId: testUser.id }
    });
    await prisma.assignment.deleteMany({
      where: { courseId: testCourse.id }
    });
    await prisma.course.delete({
      where: { id: testCourse.id }
    });
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    await prisma.$disconnect();
  });

  describe('POST /api/courses/assignments/:assignmentId/submit', () => {
    
    it('should submit assignment successfully', async () => {
      const response = await request(app)
        .post(`/api/courses/assignments/${testAssignment.id}/submit`)
        .send({
          studentId: testUser.id,
          content: 'This is my assignment submission',
          fileUrl: 'https://example.com/file.pdf'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Assignment submitted successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.status).toBe('SUBMITTED');
      expect(response.body.data.content).toBe('This is my assignment submission');
    });

    it('should return 403 if already submitted', async () => {
      // Submit lần 1
      await request(app)
        .post(`/api/courses/assignments/${testAssignment.id}/submit`)
        .send({
          studentId: testUser.id,
          content: 'First submission',
          fileUrl: 'https://example.com/file.pdf'
        });

      // Submit lần 2 (should fail)
      const response = await request(app)
        .post(`/api/courses/assignments/${testAssignment.id}/submit`)
        .send({
          studentId: testUser.id,
          content: 'Second submission',
          fileUrl: 'https://example.com/file2.pdf'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You have already submitted this assignment');
    });

    it('should return 404 if assignment not found', async () => {
      const response = await request(app)
        .post('/api/courses/assignments/invalid-id/submit')
        .send({
          studentId: testUser.id,
          content: 'Test content',
          fileUrl: 'https://example.com/file.pdf'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Assignment not found');
    });

    it('should return 403 if not enrolled', async () => {
      // Tạo user mới chưa enroll
      const unenrolledUser = await prisma.user.create({
        data: {
          email: `unenrolled-${Date.now()}@example.com`,
          name: 'Unenrolled Student',
          username: `unenrolled${Date.now()}`
        }
      });

      const response = await request(app)
        .post(`/api/courses/assignments/${testAssignment.id}/submit`)
        .send({
          studentId: unenrolledUser.id,
          content: 'Test content',
          fileUrl: 'https://example.com/file.pdf'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You are not enrolled in this course');

      // Cleanup
      await prisma.user.delete({ where: { id: unenrolledUser.id } });
    });

    it('should return 400 if no content or fileUrl provided', async () => {
      const response = await request(app)
        .post(`/api/courses/assignments/${testAssignment.id}/submit`)
        .send({
          studentId: testUser.id
          // Không có content hoặc fileUrl
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Please provide either content or file');
    });

    it('should mark as LATE if submitted after deadline', async () => {
      // Tạo assignment đã quá hạn
      const expiredAssignment = await prisma.assignment.create({
        data: {
          courseId: testCourse.id,
          title: 'Expired Assignment',
          description: 'Test',
          dueDate: new Date('2020-01-01'), // Quá hạn
          maxPoints: 100
        }
      });

      const response = await request(app)
        .post(`/api/courses/assignments/${expiredAssignment.id}/submit`)
        .send({
          studentId: testUser.id,
          content: 'Late submission',
          fileUrl: 'https://example.com/late.pdf'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.status).toBe('LATE');
      expect(response.body.message).toContain('Late submission');

      // Cleanup
      await prisma.submission.deleteMany({
        where: { assignmentId: expiredAssignment.id }
      });
      await prisma.assignment.delete({
        where: { id: expiredAssignment.id }
      });
    });

    it('should accept submission with only content (no fileUrl)', async () => {
      // Tạo assignment mới để test
      const assignment2 = await prisma.assignment.create({
        data: {
          courseId: testCourse.id,
          title: 'Assignment 2',
          description: 'Test',
          dueDate: new Date('2025-12-31'),
          maxPoints: 100
        }
      });

      const response = await request(app)
        .post(`/api/courses/assignments/${assignment2.id}/submit`)
        .send({
          studentId: testUser.id,
          content: 'Only text submission without file'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.content).toBe('Only text submission without file');
      expect(response.body.data.fileUrl).toBeNull();

      // Cleanup
      await prisma.submission.deleteMany({
        where: { assignmentId: assignment2.id }
      });
      await prisma.assignment.delete({
        where: { id: assignment2.id }
      });
    });

    it('should accept submission with only fileUrl (no content)', async () => {
      // Tạo assignment mới
      const assignment3 = await prisma.assignment.create({
        data: {
          courseId: testCourse.id,
          title: 'Assignment 3',
          description: 'Test',
          dueDate: new Date('2025-12-31'),
          maxPoints: 100
        }
      });

      const response = await request(app)
        .post(`/api/courses/assignments/${assignment3.id}/submit`)
        .send({
          studentId: testUser.id,
          fileUrl: 'https://example.com/only-file.pdf'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.fileUrl).toBe('https://example.com/only-file.pdf');
      expect(response.body.data.content).toBeNull();

      // Cleanup
      await prisma.submission.deleteMany({
        where: { assignmentId: assignment3.id }
      });
      await prisma.assignment.delete({
        where: { id: assignment3.id }
      });
    });
  });
});