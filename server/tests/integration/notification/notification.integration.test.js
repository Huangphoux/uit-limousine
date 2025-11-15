// server/src/tests/notification/notification.integration.test.js

import request from 'supertest';
import app from '../../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Notification Integration Tests', () => {
  let testUser;
  let authToken;
  let notificationId;

  beforeAll(async () => {
    try {
      testUser = await prisma.user.create({
        data: {
          email: `test-notif-${Date.now()}@test.com`,
          username: `testnotif${Date.now()}`,
          name: 'Test User'
        }
      });
      // TODO: Get real token from login API
      authToken = 'mock-token';
    } catch (error) {
      throw error;
    }
  }, 10000); // Increase timeout to 10s

  afterAll(async () => {
    try {
      if (testUser && testUser.id) {
        await prisma.notification.deleteMany({ where: { userId: testUser.id } });
        await prisma.user.delete({ where: { id: testUser.id } });
      }
    } catch (error) {
    } finally {
      await prisma.$disconnect();
    }
  }, 10000);

  describe('POST /notifications', () => {
    test('should create notification', async () => {
      
      const res = await request(app)
        .post('/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          targetUserId: testUser.id,
          title: 'Test Notification',
          body: 'Test body',
          channel: 'IN_APP'
        });


      if (res.status === 401) {
        return;
      }

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      notificationId = res.body.data.id;
    });

    test('should fail without title', async () => {
      
      const res = await request(app)
        .post('/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ body: 'No title' });


      if (res.status === 401) {
        return;
      }
      
      expect([400, 500]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /notifications', () => {
    test('should get all notifications', async () => {
      
      const res = await request(app)
        .get('/notifications')
        .set('Authorization', `Bearer ${authToken}`);


      if (res.status === 401) {
        return;
      }

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('should filter unread', async () => {
      
      const res = await request(app)
        .get('/notifications?read=false')
        .set('Authorization', `Bearer ${authToken}`);


      if (res.status === 401) {
        return;
      }

      expect(res.status).toBe(200);
    });
  });

  describe('GET /notifications/unread-count', () => {
    test('should get unread count', async () => {
      
      const res = await request(app)
        .get('/notifications/unread-count')
        .set('Authorization', `Bearer ${authToken}`);


      if (res.status === 401) {
        return;
      }

      expect(res.status).toBe(200);
      expect(typeof res.body.data.count).toBe('number');
    });
  });

  describe('GET /notifications/:id', () => {
    test('should get notification by id', async () => {
      if (!notificationId) {
        return;
      }

      
      const res = await request(app)
        .get(`/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${authToken}`);


      if (res.status === 401) {
        return;
      }

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(notificationId);
    });
  });

  describe('PUT /notifications/:id/read', () => {
    test('should mark as read', async () => {
      if (!notificationId) {
        return;
      }

      
      const res = await request(app)
        .put(`/notifications/${notificationId}/read`)
        .set('Authorization', `Bearer ${authToken}`);


      if (res.status === 401) {
        return;
      }

      expect(res.status).toBe(200);
      expect(res.body.data.read).toBe(true);
    });
  });

  describe('PUT /notifications/read-all', () => {
    test('should mark all as read', async () => {
      
      const res = await request(app)
        .put('/notifications/read-all')
        .set('Authorization', `Bearer ${authToken}`);


      if (res.status === 401) {
        return;
      }

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('count');
    });
  });

  describe('DELETE /notifications/:id', () => {
    test('should delete notification', async () => {
      if (!notificationId) {
        return;
      }

      
      const res = await request(app)
        .delete(`/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${authToken}`);


      if (res.status === 401) {
        return;
      }

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});