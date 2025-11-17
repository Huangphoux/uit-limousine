// tests/integration/api.test.js
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../src/app.js';

jest.setTimeout(30000);

describe('LMS API Integration Tests', () => {
  let prisma;
  let testUser = {
    email: `test_${Date.now()}@example.com`,
    password: 'Test123!@#',
    name: 'Test User'
  };
  let accessToken;
  let courseId;
  let lessonId;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
    
    // Cleanup any existing test user with this email
    await prisma.user.delete({ where: { email: testUser.email } }).catch(() => {});
  });

  afterAll(async () => {
    // Cleanup test data
    if (testUser.id) {
      await prisma.lessonProgress.deleteMany({ where: { userId: testUser.id } });
      await prisma.enrollment.deleteMany({ where: { userId: testUser.id } });
      await prisma.userRole.deleteMany({ where: { userId: testUser.id } });
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  // ============================================================================
  // 1. AUTHENTICATION TESTS
  // ============================================================================
  describe('1. Authentication', () => {
    test('1.1 Should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe(testUser.email);
      
      accessToken = res.body.data.accessToken;
      testUser.id = res.body.data.user.id;
    });

    test('1.2 Should not register with duplicate email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        });

      expect(res.status).toBe(400);
    });

    test('1.3 Should login with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data.user.email).toBe(testUser.email);
      
      accessToken = res.body.data.accessToken;
    });

    test('1.4 Should not login with invalid password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
    });

    test('1.5 Should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'anypassword'
        });

      expect(res.status).toBe(401);
    });
  });

  // ============================================================================
  // 2. COURSE SEARCH TESTS
  // ============================================================================
  describe('2. Course Search', () => {
    test('2.1 Should search all courses with authentication', async () => {
      const res = await request(app)
        .get('/courses')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('courses');
      expect(Array.isArray(res.body.data.courses)).toBe(true);
      
      if (res.body.data.courses.length > 0) {
        courseId = res.body.data.courses[0].id;
        expect(res.body.data.courses[0]).toHaveProperty('id');
        expect(res.body.data.courses[0]).toHaveProperty('title');
      }
    });

    test('2.2 Should allow searching courses without authentication', async () => {
      const res = await request(app)
        .get('/courses');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('2.3 Should search courses with filters', async () => {
      const res = await request(app)
        .get('/courses?search=react&page=1&limit=5')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('courses');
    });

    test('2.4 Should get course details by ID', async () => {
      // First get a course ID
      const searchRes = await request(app)
        .get('/courses')
        .set('Authorization', `Bearer ${accessToken}`);
      
      if (searchRes.body.data.courses.length > 0) {
        const testCourseId = searchRes.body.data.courses[0].id;
        
        const res = await request(app)
          .get(`/courses/${testCourseId}`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('title');
        expect(res.body).toHaveProperty('modules');
      }
    });

    test('2.5 Should return 404 for non-existent course', async () => {
      const res = await request(app)
        .get('/courses/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });

  // ============================================================================
  // 3. ENROLLMENT TESTS
  // ============================================================================
  describe('3. Course Enrollment', () => {
    test('3.1 Should enroll in a course', async () => {
      // Get a valid course ID first
      const searchRes = await request(app)
        .get('/courses')
        .set('Authorization', `Bearer ${accessToken}`);
      
      if (searchRes.body.data.courses.length > 0) {
        courseId = searchRes.body.data.courses[0].id;
        
        const res = await request(app)
          .post(`/courses/${courseId}/enroll`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({});

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('enrollmentId');
      }
    });

    test('3.2 Should not enroll without authentication', async () => {
      if (courseId) {
        const res = await request(app)
          .post(`/courses/${courseId}/enroll`)
          .send({});

        expect(res.status).toBe(401);
      }
    });

    test('3.3 Should handle duplicate enrollment gracefully', async () => {
      if (courseId) {
        const res = await request(app)
          .post(`/courses/${courseId}/enroll`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({});

        // Should either succeed (idempotent) or return conflict
        expect([200, 409]).toContain(res.status);
      }
    });
  });

  // ============================================================================
  // 4. COURSE MATERIALS TESTS
  // ============================================================================
  describe('4. Course Materials', () => {
    test('4.1 Should get course materials after enrollment', async () => {
      if (courseId) {
        const res = await request(app)
          .get(`/courses/${courseId}/materials`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('modules');
        expect(Array.isArray(res.body.data.modules)).toBe(true);
        
        // Save a lesson ID for later tests
        if (res.body.data.modules.length > 0 && 
            res.body.data.modules[0].lessons.length > 0) {
          lessonId = res.body.data.modules[0].lessons[0].id;
        }
      }
    });

    test('4.2 Should not get materials without authentication', async () => {
      if (courseId) {
        const res = await request(app)
          .get(`/courses/${courseId}/materials`);

        expect(res.status).toBe(401);
      }
    });
  });

  // ============================================================================
  // 5. LESSON PROGRESS TESTS
  // ============================================================================
  describe('5. Lesson Progress', () => {
    test('5.1 Should complete a lesson', async () => {
      if (lessonId) {
        const res = await request(app)
          .post(`/lessons/${lessonId}/complete`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({});

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('lessonId');
        expect(res.body.data).toHaveProperty('completedAt');
      }
    });

    test('5.2 Should not complete lesson without authentication', async () => {
      if (lessonId) {
        const res = await request(app)
          .post(`/lessons/${lessonId}/complete`)
          .send({});

        expect(res.status).toBe(401);
      }
    });

    test('5.3 Should show lesson as completed in materials', async () => {
      if (courseId && lessonId) {
        const res = await request(app)
          .get(`/courses/${courseId}/materials`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        
        // Find the completed lesson
        const modules = res.body.data.modules;
        let found = false;
        for (const module of modules) {
          const lesson = module.lessons.find(l => l.id === lessonId);
          if (lesson) {
            expect(lesson.isCompleted).toBe(true);
            found = true;
            break;
          }
        }
        expect(found).toBe(true);
      }
    });

    test('5.4 Should handle completing same lesson again (idempotent)', async () => {
      if (lessonId) {
        const res = await request(app)
          .post(`/lessons/${lessonId}/complete`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({});

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      }
    });
  });

  // ============================================================================
  // 6. LOGOUT TEST
  // ============================================================================
  describe('6. Logout', () => {
    test('6.1 Should logout successfully', async () => {
      const res = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('6.2 Should logout without token (graceful)', async () => {
      const res = await request(app)
        .post('/auth/logout')
        .send({});

      // Should either succeed or return 200
      expect([200, 401]).toContain(res.status);
    });
  });

  // ============================================================================
  // 7. ERROR HANDLING TESTS
  // ============================================================================
  describe('7. Error Handling', () => {
    test('7.1 Should reject invalid token', async () => {
      const res = await request(app)
        .post('/courses/test-course-id/enroll')
        .set('Authorization', 'Bearer invalid_token_12345');

      expect(res.status).toBe(401);
    });

    test('7.2 Should reject malformed Authorization header', async () => {
      const res = await request(app)
        .post('/courses/test-course-id/enroll')
        .set('Authorization', 'InvalidFormat');

      expect(res.status).toBe(401);
    });

    test('7.3 Should handle non-existent endpoints', async () => {
      const res = await request(app)
        .get('/nonexistent/endpoint')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });
});
