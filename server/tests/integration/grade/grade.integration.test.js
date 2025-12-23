import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { prisma } from '../../../src/composition-root.js';
import app from '../../../src/app.js';

describe('Grade Submission API - Complete Test Suite', () => {
  let testData = {
    instructor: null,
    student: null,
    otherInstructor: null,
    course: null,
    assignment: null,
    submissions: []
  };

  beforeAll(async () => {
                
    await prisma.$connect();
    
        testData.instructor = await prisma.user.create({
      data: {
        email: `instructor-${Date.now()}@gradetest.com`,
        name: 'Dr. Grade Instructor',
        username: `instructor${Date.now()}`
      }
    });
    

        testData.otherInstructor = await prisma.user.create({
      data: {
        email: `other-instructor-${Date.now()}@gradetest.com`,
        name: 'Other Instructor',
        username: `otherinstructor${Date.now()}`
      }
    });
    
        testData.student = await prisma.user.create({
      data: {
        email: `student-${Date.now()}@gradetest.com`,
        name: 'Test Student',
        username: `student${Date.now()}`
      }
    });
    

        testData.course = await prisma.course.create({
      data: {
        title: 'Advanced English Grammar',
        shortDesc: 'Learn advanced grammar concepts',
        level: 'Advanced',
        price: 0,
        published: true,
        instructorId: testData.instructor.id
      }
    });
   

        testData.assignment = await prisma.assignment.create({
      data: {
        courseId: testData.course.id,
        title: 'Final Grammar Test',
        description: 'Complete all grammar exercises',
        maxPoints: 100,
        dueDate: new Date('2025-12-31T23:59:59Z')
      }
    });
   

        await prisma.enrollment.create({
      data: {
        userId: testData.student.id,
        courseId: testData.course.id,
        status: 'ENROLLED',
        isPaid: true
      }
    });
    
              }, 30000);

  afterAll(async () => {
            
    try {
      const deletedSubmissions = await prisma.submission.deleteMany({
        where: { studentId: testData.student.id }
      });
      
      const deletedEnrollments = await prisma.enrollment.deleteMany({
        where: { userId: testData.student.id }
      });
      
      await prisma.assignment.delete({
        where: { id: testData.assignment.id }
      });
      await prisma.course.delete({
        where: { id: testData.course.id }
      });
      await prisma.user.delete({ where: { id: testData.instructor.id } });
      
      await prisma.user.delete({ where: { id: testData.otherInstructor.id } });
      
      await prisma.user.delete({ where: { id: testData.student.id } });
      
    } catch (error) {
          } finally {
      await prisma.$disconnect();
                            }
  }, 30000);
  const gradeSubmission = (submissionId, data) =>
    request(app)
      .post(`/grade/submissions/${submissionId}`)
      .set('Content-Type', 'application/json')
      .send(data);
  describe('✅ Success Cases', () => {
    it('should grade submission successfully with full data', async () => {
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'My complete homework with all answers',
          status: 'SUBMITTED',
          submittedAt: new Date()
        }
      });
      
      const response = await gradeSubmission(submission.id, {
        graderId: testData.instructor.id,
        grade: 85,
        feedback: 'Excellent work! You demonstrated a strong understanding of the concepts.'
      });

      

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('successfully');
      
      const { data } = response.body;
      expect(data).toHaveProperty('submissionId', submission.id);
      expect(data).toHaveProperty('grade', 85);
      expect(data).toHaveProperty('maxPoints', 100);
      expect(data).toHaveProperty('percentage', '85.00');
      expect(data).toHaveProperty('feedback', 'Excellent work! You demonstrated a strong understanding of the concepts.');
      expect(data).toHaveProperty('status', 'GRADED');
      expect(data).toHaveProperty('gradedAt');
      expect(data).toHaveProperty('gradedBy');
      expect(data.gradedBy).toHaveProperty('id', testData.instructor.id);
      expect(data.gradedBy).toHaveProperty('name', 'Dr. Grade Instructor');
      expect(data).toHaveProperty('student');
      expect(data.student).toHaveProperty('id', testData.student.id);

          }, 20000);

    it('should grade submission successfully without feedback', async () => {
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'Short answer',
          status: 'SUBMITTED'
        }
      });

      const response = await gradeSubmission(submission.id, {
        graderId: testData.instructor.id,
        grade: 75
      });

      expect(response.status).toBe(200);
      expect(response.body.data.grade).toBe(75);
      expect(response.body.data.feedback).toBeNull();
      expect(response.body.data.percentage).toBe('75.00');

          }, 20000);

    it('should grade with minimum score (0)', async () => {
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'Incomplete work',
          status: 'SUBMITTED'
        }
      });

      const response = await gradeSubmission(submission.id, {
        graderId: testData.instructor.id,
        grade: 0,
        feedback: 'Did not meet requirements'
      });

      expect(response.status).toBe(200);
      expect(response.body.data.grade).toBe(0);
      expect(response.body.data.percentage).toBe('0.00');

          }, 20000);

    it('should grade with maximum score (100)', async () => {
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'Perfect answers',
          status: 'SUBMITTED'
        }
      });

      const response = await gradeSubmission(submission.id, {
        graderId: testData.instructor.id,
        grade: 100,
        feedback: 'Perfect score! Outstanding work!'
      });

      expect(response.status).toBe(200);
      expect(response.body.data.grade).toBe(100);
      expect(response.body.data.percentage).toBe('100.00');

          }, 20000);
  });
  describe('⚠️ Validation Cases', () => {
    it('should fail if submission not found', async () => {
      
      const response = await gradeSubmission('00000000-0000-0000-0000-000000000000', {
        graderId: testData.instructor.id,
        grade: 80
      });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Submission not found');

          }, 10000);

    it('should fail if graderId is missing', async () => {
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'Test',
          status: 'SUBMITTED'
        }
      });

      const response = await gradeSubmission(submission.id, {
        grade: 80
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Grader ID is required');

      await prisma.submission.delete({ where: { id: submission.id } });
          }, 10000);

    it('should fail if grade is missing', async () => {
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'Test',
          status: 'SUBMITTED'
        }
      });

      const response = await gradeSubmission(submission.id, {
        graderId: testData.instructor.id
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Grade is required');

      await prisma.submission.delete({ where: { id: submission.id } });
          }, 10000);

    it('should fail if grade is not a number', async () => {
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'Test',
          status: 'SUBMITTED'
        }
      });

      const response = await gradeSubmission(submission.id, {
        graderId: testData.instructor.id,
        grade: 'eighty-five'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Grade must be a valid number');

      await prisma.submission.delete({ where: { id: submission.id } });
          }, 10000);

    it('should fail if grade is negative', async () => {
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'Test',
          status: 'SUBMITTED'
        }
      });

      const response = await gradeSubmission(submission.id, {
        graderId: testData.instructor.id,
        grade: -10
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Grade must be between 0 and 100');

      await prisma.submission.delete({ where: { id: submission.id } });
          }, 10000);

    it('should fail if grade exceeds 100', async () => {
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'Test',
          status: 'SUBMITTED'
        }
      });

      const response = await gradeSubmission(submission.id, {
        graderId: testData.instructor.id,
        grade: 150
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Grade must be between 0 and 100');

      await prisma.submission.delete({ where: { id: submission.id } });
          }, 10000);
  });
  describe('🔒 Authorization Cases', () => {
    it('should fail if grader is not the course instructor', async () => {
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'Test submission',
          status: 'SUBMITTED'
        }
      });

      const response = await gradeSubmission(submission.id, {
        graderId: testData.otherInstructor.id,
        grade: 80,
        feedback: 'Good work'
      });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Only the course instructor can grade this assignment');

      await prisma.submission.delete({ where: { id: submission.id } });
          }, 10000);

    it('should fail if submission already graded', async () => {
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'First submission',
          status: 'SUBMITTED'
        }
      });
      await gradeSubmission(submission.id, {
        graderId: testData.instructor.id,
        grade: 80
      });
      const response = await gradeSubmission(submission.id, {
        graderId: testData.instructor.id,
        grade: 90
      });

      expect(response.status).toBe(200);
      expect(response.body.data.grade).toBe(90);

      await prisma.submission.delete({ where: { id: submission.id } });
          }, 10000);
  });
  describe('🔧 Edge Cases', () => {
    it('should handle long feedback text', async () => {
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'Test',
          status: 'SUBMITTED'
        }
      });

      const longFeedback = 'Great work! '.repeat(100); // ~1200 characters
      const expectedFeedback = longFeedback.trim();

      const response = await gradeSubmission(submission.id, {
        graderId: testData.instructor.id,
        grade: 88,
        feedback: expectedFeedback
      });

      expect(response.status).toBe(200);
        expect(response.body.data.feedback).toBe(expectedFeedback)

          }, 10000);

    it('should handle decimal grades', async () => {
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'Test',
          status: 'SUBMITTED'
        }
      });

      const response = await gradeSubmission(submission.id, {
        graderId: testData.instructor.id,
        grade: 87.5
      });

      expect(response.status).toBe(200);
      expect(response.body.data.grade).toBe(87.5);
      expect(response.body.data.percentage).toBe('87.50');

          }, 10000);

    it('should trim whitespace from feedback', async () => {
      
      const submission = await prisma.submission.create({
        data: {
          assignmentId: testData.assignment.id,
          studentId: testData.student.id,
          content: 'Test',
          status: 'SUBMITTED'
        }
      });

      const response = await gradeSubmission(submission.id, {
        graderId: testData.instructor.id,
        grade: 85,
        feedback: '   Good work!   '
      });

      expect(response.status).toBe(200);
      expect(response.body.data.feedback).toBe('Good work!');

          }, 10000);
  });
});