// server/src/infrastructure_layer/repository/notification.repository.js

import { PrismaClient } from '@prisma/client';
import { NotificationEntity } from '../../domain_layer/notification.entity.js';

const prisma = new PrismaClient();

export class NotificationRepository {
  async create(notificationData) {
    
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: notificationData.userId,
          channel: notificationData.channel || 'IN_APP',
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data || null,
          read: false
        }
      });

      return new NotificationEntity(notification);
    } catch (error) {
      throw new Error('Failed to create notification!');
    }
  }

  async findById(id) {
    
    try {
      const notification = await prisma.notification.findUnique({
        where: { id }
      });

      if (!notification) {
        return null;
      }

      return new NotificationEntity(notification);
    } catch (error) {
      throw new Error('Failed to find notification by id!');
    }
  }

  async findByUserId(userId, filters = {}) {
    
    try {
      const where = { userId };
      
      if (filters.read !== undefined) {
        where.read = filters.read;
      }

      const notifications = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 50
      });

      return notifications.map(n => new NotificationEntity(n));
    } catch (error) {
      throw new Error('Failed to find notifications for user!');
    }
  }

  async markAsRead(id) {
    
    try {
      const notification = await prisma.notification.update({
        where: { id },
        data: { read: true }
      });

      return new NotificationEntity(notification);
    } catch (error) {
      throw new Error('Failed to mark notification as read!');
    }
  }

  async markAllAsRead(userId) {
    
    try {
      const result = await prisma.notification.updateMany({
        where: { 
          userId,
          read: false 
        },
        data: { read: true }
      });

      return result.count;
    } catch (error) {
      throw new Error('Failed to mark all notifications as read!');
    }
  }

  async delete(id) {
    
    try {
      await prisma.notification.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      throw new Error('Failed to delete notification!');
    }
  }

  async getUnreadCount(userId) {
    
    try {
      const count = await prisma.notification.count({
        where: { 
          userId,
          read: false 
        }
      });

      return count;
    } catch (error) {
      throw new Error('Failed to get unread notification count!');
    }
  }
}
