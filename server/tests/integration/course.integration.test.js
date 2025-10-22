import request from 'supertest';
import app from '../../src/app.js';

describe('GET /api/courses/:id', () => {
  let courseId;

  beforeAll(async () => {
    // Lấy id khoá học đầu tiên từ API (đã seed dữ liệu)
    const res = await request(app).get('/api/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    courseId = res.body[0]?.id;
  });

  it('should return course detail for valid id', async () => {
    const res = await request(app).get(`/api/courses/${courseId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', courseId);
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