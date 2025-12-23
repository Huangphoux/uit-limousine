import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { prisma } from '../../../src/composition-root.js';
import app from '../../../src/app.js';

describe('Instructor Application API - Complete Test Suite', () => {
  let testData = {
    applicant: null,
    reviewer: null,
    applications: []
  };
  beforeAll(async () => {
    await prisma.$connect();
    testData.applicant = await prisma.user.create({
      data: {
        email: `applicant-${Date.now()}@test.com`,
        name: 'John Applicant',
        username: `applicant${Date.now()}`,
        bio: 'Experienced English teacher with 10 years of experience'
      }
    });

    testData.reviewer = await prisma.user.create({
      data: {
        email: `reviewer-${Date.now()}@test.com`,
        name: 'Admin Reviewer',
        username: `reviewer${Date.now()}`
      }
    });

  }, 30000);
  afterAll(async () => {
    try {
      const deletedApps = await prisma.instructorApplication.deleteMany({
        where: { applicantId: testData.applicant.id }
      });
      await prisma.userRole.deleteMany({
        where: { userId: testData.applicant.id }
      });
      await prisma.user.delete({ where: { id: testData.applicant.id } });
      await prisma.user.delete({ where: { id: testData.reviewer.id } });
    } catch (error) {
      console.error('❌ Cleanup error:', error.message);
    } finally {
      await prisma.$disconnect();
    }
  }, 30000);
  const applyInstructor = (data) =>
    request(app)
      .post('/instructor/apply')
      .set('Content-Type', 'application/json')
      .send(data);

  const approveApplication = (applicationId, data) =>
    request(app)
      .post(`/instructor/applications/${applicationId}/approve`)
      .set('Content-Type', 'application/json')
      .send(data);

  const rejectApplication = (applicationId, data) =>
    request(app)
      .post(`/instructor/applications/${applicationId}/reject`)
      .set('Content-Type', 'application/json')
      .send(data);

  const getAllApplications = (query = '') =>
    request(app)
      .get(`/instructor/applications${query}`)
      .set('Content-Type', 'application/json');

  const getApplicationById = (applicationId) =>
    request(app)
      .get(`/instructor/applications/${applicationId}`)
      .set('Content-Type', 'application/json');
  describe(' Apply Instructor - Success Cases', () => {
    it('should apply successfully with full data', async () => {
      const response = await applyInstructor({
        applicantId: testData.applicant.id,
        requestedCourseTitle: 'Advanced English Grammar for IELTS',
        requestedCourseSummary: 'This comprehensive course will teach students advanced grammar concepts needed for IELTS exam. We will cover complex sentence structures, conditionals, and passive voice.',
        portfolioUrl: 'https://portfolio.example.com/john-teacher'
      });

      console.log('📊 Response:', {
        status: response.status,
        success: response.body.success,
        applicationId: response.body.data?.id
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('successfully');

      const { data } = response.body;
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('applicant');
      expect(data.applicant.id).toBe(testData.applicant.id);
      expect(data.applicant.name).toBe('John Applicant');
      expect(data).toHaveProperty('requestedCourse');
      expect(data.requestedCourse.title).toBe('Advanced English Grammar for IELTS');
      expect(data.portfolioUrl).toBe('https://portfolio.example.com/john-teacher');
      expect(data.status).toBe('PENDING');
      expect(data).toHaveProperty('appliedAt');
      expect(data.reviewedAt).toBeNull();
      expect(data.reviewer).toBeNull();
      testData.applications.push(data.id);
    }, 20000);

    it('should apply successfully without portfolio URL', async () => {
      await prisma.instructorApplication.deleteMany({
        where: { applicantId: testData.applicant.id }
      });

      const response = await applyInstructor({
        applicantId: testData.applicant.id,
        requestedCourseTitle: 'Business English Communication Skills',
        requestedCourseSummary: 'Learn professional English for business meetings, presentations, and email writing. This course covers formal and informal business communication styles.'
      });

      expect(response.status).toBe(201);
      expect(response.body.data.portfolioUrl).toBeNull();
      expect(response.body.data.status).toBe('PENDING');

      testData.applications.push(response.body.data.id);
    }, 20000);
  });

  describe(' Apply Instructor - Validation Cases', () => {
    beforeEach(async () => {
      await prisma.instructorApplication.deleteMany({
        where: { applicantId: testData.applicant.id }
      });
    });

    it('should fail if applicantId is missing', async () => {
      const response = await applyInstructor({
        requestedCourseTitle: 'Test Course',
        requestedCourseSummary: 'This is a test course summary that is long enough to pass validation.'
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Applicant ID is required');
    }, 10000);

    it('should fail if course title is missing', async () => {
      const response = await applyInstructor({
        applicantId: testData.applicant.id,
        requestedCourseSummary: 'This is a test course summary that is long enough to pass validation.'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Course title is required');
    }, 10000);

    it('should fail if course summary is missing', async () => {
      const response = await applyInstructor({
        applicantId: testData.applicant.id,
        requestedCourseTitle: 'Test Course Title'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Course summary is required');
    }, 10000);

    it('should fail if course title is too short', async () => {
      const response = await applyInstructor({
        applicantId: testData.applicant.id,
        requestedCourseTitle: 'Short',
        requestedCourseSummary: 'This is a test course summary that is long enough to pass validation.'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Course title must be at least 10 characters');
    }, 10000);

    it('should fail if course summary is too short', async () => {
      const response = await applyInstructor({
        applicantId: testData.applicant.id,
        requestedCourseTitle: 'Valid Course Title',
        requestedCourseSummary: 'Too short'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Course summary must be at least 50 characters');
    }, 10000);

    it('should fail if user already has pending application', async () => {
      await applyInstructor({
        applicantId: testData.applicant.id,
        requestedCourseTitle: 'First Application Course',
        requestedCourseSummary: 'This is the first application course summary that is long enough.'
      });
      const response = await applyInstructor({
        applicantId: testData.applicant.id,
        requestedCourseTitle: 'Second Application Course',
        requestedCourseSummary: 'This is the second application course summary that is long enough.'
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('You already have a pending application');
    }, 20000);
  });
  describe(' Approve Application - Success Cases', () => {
    let applicationId;

    beforeAll(async () => {
      await prisma.instructorApplication.deleteMany({
        where: { applicantId: testData.applicant.id }
      });

      const app = await prisma.instructorApplication.create({
        data: {
          applicantId: testData.applicant.id,
          requestedCourseTitle: 'Course to Approve',
          requestedCourseSummary: 'This is a course that will be approved for testing purposes.',
          status: 'PENDING'
        }
      });
      applicationId = app.id;
    });

    it('should approve application successfully', async () => {
      const response = await approveApplication(applicationId, {
        reviewerId: testData.reviewer.id,
        note: 'Excellent portfolio and experience. Approved.'
      });



      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('approved successfully');

      const { data } = response.body;
      expect(data.status).toBe('APPROVED');
      expect(data).toHaveProperty('reviewedAt');
      expect(data.reviewedAt).not.toBeNull();
      expect(data.reviewer).not.toBeNull();
      expect(data.reviewer.id).toBe(testData.reviewer.id);
      expect(data.note).toBe('Excellent portfolio and experience. Approved.');
      const userRole = await prisma.userRole.findFirst({
        where: {
          userId: testData.applicant.id
        },
        include: {
          role: true
        }
      });

      expect(userRole).not.toBeNull();
      expect(userRole.role.name).toBe('INSTRUCTOR');
    }, 20000);

    it('should approve application without note', async () => {
      await prisma.instructorApplication.deleteMany({
        where: { applicantId: testData.applicant.id }
      });

      const app = await prisma.instructorApplication.create({
        data: {
          applicantId: testData.applicant.id,
          requestedCourseTitle: 'Another Course',
          requestedCourseSummary: 'This is another course for approval without note.',
          status: 'PENDING'
        }
      });

      const response = await approveApplication(app.id, {
        reviewerId: testData.reviewer.id
      });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('APPROVED');
      expect(response.body.data.note).toBeNull();
    }, 20000);
  });

  describe(' Approve Application - Validation Cases', () => {
    it('should fail if application not found', async () => {
      const response = await approveApplication('00000000-0000-0000-0000-000000000000', {
        reviewerId: testData.reviewer.id
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Application not found');
    }, 10000);

    it('should fail if reviewerId is missing', async () => {
      const app = await prisma.instructorApplication.create({
        data: {
          applicantId: testData.applicant.id,
          requestedCourseTitle: 'Test Course',
          requestedCourseSummary: 'This is a test course for approval validation.',
          status: 'PENDING'
        }
      });

      const response = await approveApplication(app.id, {});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Reviewer ID is required');

      await prisma.instructorApplication.delete({ where: { id: app.id } });
    }, 10000);

    it('should fail if application already reviewed', async () => {
      const app = await prisma.instructorApplication.create({
        data: {
          applicantId: testData.applicant.id,
          requestedCourseTitle: 'Already Reviewed Course',
          requestedCourseSummary: 'This application has already been approved.',
          status: 'APPROVED',
          reviewerId: testData.reviewer.id,
          reviewedAt: new Date()
        }
      });

      const response = await approveApplication(app.id, {
        reviewerId: testData.reviewer.id
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Application has already been reviewed');
    }, 10000);
  });
  describe(' Reject Application - Success Cases', () => {
    it('should reject application successfully', async () => {
      const app = await prisma.instructorApplication.create({
        data: {
          applicantId: testData.applicant.id,
          requestedCourseTitle: 'Course to Reject',
          requestedCourseSummary: 'This is a course that will be rejected for testing purposes.',
          status: 'PENDING'
        }
      });

      const response = await rejectApplication(app.id, {
        reviewerId: testData.reviewer.id,
        note: 'Need more teaching experience. Please reapply after 2 years.'
      });

      console.log('📊 Response:', {
        status: response.status,
        applicationStatus: response.body.data?.status
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('rejected successfully');

      const { data } = response.body;
      expect(data.status).toBe('REJECTED');
      expect(data).toHaveProperty('reviewedAt');
      expect(data.reviewedAt).not.toBeNull();
      expect(data.reviewer).not.toBeNull();
      expect(data.reviewer.id).toBe(testData.reviewer.id);
      expect(data.note).toBe('Need more teaching experience. Please reapply after 2 years.');
    }, 20000);
  });

  describe(' Reject Application - Validation Cases', () => {
    it('should fail if note is missing', async () => {
      const app = await prisma.instructorApplication.create({
        data: {
          applicantId: testData.applicant.id,
          requestedCourseTitle: 'Test Course',
          requestedCourseSummary: 'This is a test course for rejection validation.',
          status: 'PENDING'
        }
      });

      const response = await rejectApplication(app.id, {
        reviewerId: testData.reviewer.id
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Rejection note is required');

      await prisma.instructorApplication.delete({ where: { id: app.id } });
    }, 10000);

    it('should fail if application not found', async () => {
      const response = await rejectApplication('00000000-0000-0000-0000-000000000000', {
        reviewerId: testData.reviewer.id,
        note: 'Rejection note'
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Application not found');
    }, 10000);
  });
  describe(' Get All Applications', () => {
    beforeAll(async () => {
      await prisma.instructorApplication.deleteMany({
        where: { applicantId: testData.applicant.id }
      });

      await prisma.instructorApplication.createMany({
        data: [
          {
            applicantId: testData.applicant.id,
            requestedCourseTitle: 'Pending Course 1',
            requestedCourseSummary: 'First pending course summary.',
            status: 'PENDING'
          },
          {
            applicantId: testData.applicant.id,
            requestedCourseTitle: 'Approved Course',
            requestedCourseSummary: 'Approved course summary.',
            status: 'APPROVED',
            reviewerId: testData.reviewer.id,
            reviewedAt: new Date()
          },
          {
            applicantId: testData.applicant.id,
            requestedCourseTitle: 'Rejected Course',
            requestedCourseSummary: 'Rejected course summary.',
            status: 'REJECTED',
            reviewerId: testData.reviewer.id,
            reviewedAt: new Date(),
            note: 'Not qualified'
          }
        ]
      });
    });

    it('should get all applications without filter', async () => {
      const response = await getAllApplications();

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThanOrEqual(3);
      expect(Array.isArray(response.body.data)).toBe(true);
    }, 10000);

    it('should filter by status=PENDING', async () => {
      const response = await getAllApplications('?status=PENDING');

      expect(response.status).toBe(200);
      expect(response.body.data.every(app => app.status === 'PENDING')).toBe(true);
    }, 10000);

    it('should filter by status=APPROVED', async () => {
      const response = await getAllApplications('?status=APPROVED');

      expect(response.status).toBe(200);
      expect(response.body.data.every(app => app.status === 'APPROVED')).toBe(true);
    }, 10000);

    it('should filter by applicantId', async () => {
      const response = await getAllApplications(`?applicantId=${testData.applicant.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.every(app => app.applicant.id === testData.applicant.id)).toBe(true);
    }, 10000);

    it('should fail with invalid status filter', async () => {
      const response = await getAllApplications('?status=INVALID');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid status value');
    }, 10000);
  });
  describe(' Get Application By ID', () => {
    let applicationId;

    beforeAll(async () => {
      const app = await prisma.instructorApplication.create({
        data: {
          applicantId: testData.applicant.id,
          requestedCourseTitle: 'Specific Application',
          requestedCourseSummary: 'This is a specific application for testing get by ID.',
          portfolioUrl: 'https://portfolio.example.com',
          status: 'PENDING'
        }
      });
      applicationId = app.id;
    });

    it('should get application by ID successfully', async () => {
      const response = await getApplicationById(applicationId);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(applicationId);
      expect(response.body.data.applicant).not.toBeNull();
      expect(response.body.data.requestedCourse).not.toBeNull();
      expect(response.body.data.status).toBe('PENDING');
    }, 10000);

    it('should fail if application ID not found', async () => {
      const response = await getApplicationById('00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Application not found');
    }, 10000);
  });
});