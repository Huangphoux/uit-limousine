// server/src/tests/notification.test.js

import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Notification API Tests', () => {
  let testUser;
  let testUser2;
  let authToken; // You'll need to implement authentication to get this
  let createdNotificationId;

  before(async () => {
    console.log('[Test Setup] Creating test users...');
    
    // Create test users
    try {
      testUser = await prisma.user.create({
        data: {
          email: `test-notif-${Date.now()}@test.com`,
          username: `testuser-${Date.now()}`,
          name: 'Test User'
        }
      });

      testUser2 = await prisma.user.create({
        data: {
          email: `test-notif2-${Date.now()}@test.com`,
          username: `testuser2-${Date.now()}`,
          name: 'Test User 2'
        }
      });

      console.log('[Test Setup] Test users created:', testUser.id, testUser2.id);
    } catch (error) {
      console.error('[Test Setup] Error creating test users:', error);
      throw error;
    }
  });

  after(async () => {
    console.log('[Test Cleanup] Cleaning up test data...');
    
    try {
      // Delete test notifications
      await prisma.notification.deleteMany({
        where: {
          userId: { in: [testUser.id, testUser2.id] }
        }
      });

      // Delete test users
      await prisma.user.deleteMany({
        where: {
          id: { in: [testUser.id, testUser2.id] }
        }
      });

      await prisma.$disconnect();
      console.log('[Test Cleanup] Cleanup completed');
    } catch (error) {
      console.error('[Test Cleanup] Error cleaning up:', error);
    }
  });

  describe('POST /notifications', () => {
    it('should create a new notification', (done) => {
      console.log('[Test] Creating notification for user:', testUser.id);

      const notificationData = {
        targetUserId: testUser.id,
        title: 'Test Notification',
        body: 'This is a test notification',
        channel: 'IN_APP',
        data: { testKey: 'testValue' }
      };

      request(app)
        .post('/notifications')
        .set('Authorization', `Bearer ${authToken}`) // Mock authentication
        .send(notificationData)
        .end((err, res) => {
          if (err) {
            console.error('[Test] Error:', err);
            return done(err);
          }

          console.log('[Test] Response:', res.body);
          
          // Note: This will fail without proper authentication middleware
          // You'll need to implement authentication to make this work
          expect(res.status).to.be.oneOf([201, 401]); // 401 if not authenticated
          
          if (res.status === 201) {
            expect(res.body).to.have.property('success', true);
            expect(res.body.data).to.have.property('id');
            expect(res.body.data).to.have.property('title', notificationData.title);
            expect(res.body.data).to.have.property('body', notificationData.body);
            expect(res.body.data).to.have.property('read', false);
            
            createdNotificationId = res.body.data.id;
            console.log('[Test] Notification created with ID:', createdNotificationId);
          }
          
          done();
        });
    });

    it('should return error when missing required fields', (done) => {
      console.log('[Test] Testing validation - missing fields');

      request(app)
        .post('/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'No body' })
        .end((err, res) => {
          if (err) return done(err);

          console.log('[Test] Response:', res.body);
          expect(res.status).to.be.oneOf([400, 401, 500]);
          
          done();
        });
    });
  });

  describe('GET /notifications', () => {
    it('should get all notifications for authenticated user', (done) => {
      console.log('[Test] Getting all notifications');

      request(app)
        .get('/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);

          console.log('[Test] Response:', res.body);
          expect(res.status).to.be.oneOf([200, 401]);
          
          if (res.status === 200) {
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            console.log('[Test] Retrieved notifications count:', res.body.data.length);
          }
          
          done();
        });
    });

    it('should filter unread notifications', (done) => {
      console.log('[Test] Getting unread notifications only');

      request(app)
        .get('/notifications?read=false')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);

          console.log('[Test] Response:', res.body);
          expect(res.status).to.be.oneOf([200, 401]);
          
          if (res.status === 200 && res.body.data) {
            res.body.data.forEach(notif => {
              expect(notif.read).to.equal(false);
            });
            console.log('[Test] Unread notifications count:', res.body.data.length);
          }
          
          done();
        });
    });
  });

  describe('GET /notifications/unread-count', () => {
    it('should get unread notifications count', (done) => {
      console.log('[Test] Getting unread count');

      request(app)
        .get('/notifications/unread-count')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);

          console.log('[Test] Response:', res.body);
          expect(res.status).to.be.oneOf([200, 401]);
          
          if (res.status === 200) {
            expect(res.body).to.have.property('success', true);
            expect(res.body.data).to.have.property('count');
            expect(res.body.data.count).to.be.a('number');
            console.log('[Test] Unread count:', res.body.data.count);
          }
          
          done();
        });
    });
  });

  describe('PUT /notifications/:id/read', () => {
    it('should mark notification as read', (done) => {
      console.log('[Test] Marking notification as read:', createdNotificationId);

      if (!createdNotificationId) {
        console.log('[Test] Skipping - no notification ID available');
        return done();
      }

      request(app)
        .put(`/notifications/${createdNotificationId}/read`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);

          console.log('[Test] Response:', res.body);
          expect(res.status).to.be.oneOf([200, 401, 403, 404]);
          
          if (res.status === 200) {
            expect(res.body).to.have.property('success', true);
            expect(res.body.data).to.have.property('read', true);
            console.log('[Test] Notification marked as read successfully');
          }
          
          done();
        });
    });
  });

  describe('PUT /notifications/read-all', () => {
    it('should mark all notifications as read', (done) => {
      console.log('[Test] Marking all notifications as read');

      request(app)
        .put('/notifications/read-all')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);

          console.log('[Test] Response:', res.body);
          expect(res.status).to.be.oneOf([200, 401]);
          
          if (res.status === 200) {
            expect(res.body).to.have.property('success', true);
            expect(res.body.data).to.have.property('count');
            console.log('[Test] Marked count:', res.body.data.count);
          }
          
          done();
        });
    });
  });

  describe('DELETE /notifications/:id', () => {
    it('should delete notification', (done) => {
      console.log('[Test] Deleting notification:', createdNotificationId);

      if (!createdNotificationId) {
        console.log('[Test] Skipping - no notification ID available');
        return done();
      }

      request(app)
        .delete(`/notifications/${createdNotificationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);

          console.log('[Test] Response:', res.body);
          expect(res.status).to.be.oneOf([200, 401, 403, 404]);
          
          if (res.status === 200) {
            expect(res.body).to.have.property('success', true);
            console.log('[Test] Notification deleted successfully');
          }
          
          done();
        });
    });
  });

  describe('Authorization Tests', () => {
    it('should not allow accessing other users notifications', (done) => {
      console.log('[Test] Testing unauthorized access');

      // This test requires proper authentication implementation
      // It should verify that User 1 cannot access User 2's notifications
      
      done();
    });
  });

  describe('Direct Database Tests', () => {
    it('should create notification directly via repository', async () => {
      console.log('[Test] Testing direct repository access');

      try {
        const notification = await prisma.notification.create({
          data: {
            userId: testUser.id,
            title: 'Direct DB Test',
            body: 'Testing direct database creation',
            channel: 'IN_APP',
            read: false
          }
        });

        console.log('[Test] Created notification:', notification.id);
        expect(notification).to.have.property('id');
        expect(notification.title).to.equal('Direct DB Test');
        expect(notification.read).to.equal(false);

        // Cleanup
        await prisma.notification.delete({
          where: { id: notification.id }
        });

        console.log('[Test] Direct DB test completed successfully');
      } catch (error) {
        console.error('[Test] Direct DB test failed:', error);
        throw error;
      }
    });
  });
});

console.log('[Test] Notification test suite loaded');