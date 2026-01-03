// tests/integration/courses.integration.test.js
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../src/app.js'
import { loginUseCase } from "../../composition-root.js";
import bcrypt from 'bcrypt';

jest.setTimeout(20000);

describe('Course Integration Test', () => {
  let prisma;
  let testCourseId;
  let authToken;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();

    const email = `course-test-${Date.now()}@test.com`;
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: { email, username: `u${Date.now()}`, password: hashedPassword, name: 'Test' }
    });
    
    const loginResult = await loginUseCase.execute({ email, password });
    authToken = loginResult.accessToken;

    // Tạo dữ liệu test
    const course = await prisma.course.create({
      data: {
        title: 'Test Course',
        description: 'Test Description',
      }
    });
    testCourseId = course.id;
  });

  afterAll(async () => {
    await prisma.course.deleteMany({ where: { title: 'Test Course' } });
    await prisma.$disconnect();
  });

  it('should return course detail for valid id', async () => {
    const res = await request(app).get(`/courses/${testCourseId}`).set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', testCourseId);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('instructor');
    expect(res.body).toHaveProperty('modules');
    expect(Array.isArray(res.body.modules)).toBe(true);
    expect(res.body).toHaveProperty('reviews');
    expect(Array.isArray(res.body.reviews)).toBe(true);
    expect(res.body).toHaveProperty('students');
  });

  it('should return 404 for invalid id', async () => {
    const res = await request(app).get('/courses/invalid-id-123').set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
