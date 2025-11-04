// tests/integration/courses.integration.test.js
import express from 'express';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

jest.setTimeout(20000);

describe('Course Integration Test', () => {
  let app;
  let prisma;
  let testCourseId;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();

    // Tạo dữ liệu test
    const course = await prisma.course.create({
      data: {
        title: 'Test Course',
        description: 'Test Description',
      },
    });
    testCourseId = course.id;

    app = express();
    app.use(express.json());
    app.use('/api/courses', require('../../src/presentation_layer/routes/courses.route.js').default);
  });

  afterAll(async () => {
    await prisma.course.deleteMany({ where: { title: 'Test Course' } });
    await prisma.$disconnect();
  });

  it('should return course detail for valid id', async () => {
    const res = await request(app).get(`/api/courses/${testCourseId}`);
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
    const res = await request(app).get('/api/courses/invalid-id-123');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
