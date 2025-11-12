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
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
    }
  }

  async delete(id) {
    console.log('[NotificationRepository] Deleting notification:', id);
    
    try {
      await prisma.notification.delete({
        where: { id }
      });

      console.log('[NotificationRepository] Notification deleted:', id);
      return true;
    } catch (error) {
      console.error('[NotificationRepository] Error deleting notification:', error);
      throw error;
    }
  }

  async getUnreadCount(userId) {
    console.log('[NotificationRepository] Getting unread count for user:', userId);
    
    try {
      const count = await prisma.notification.count({
        where: { 
          userId,
          read: false 
        }
      });

      console.log('[NotificationRepository] Unread count:', count);
      return count;
    } catch (error) {
      console.error('[NotificationRepository] Error getting unread count:', error);
      throw error;
    }
  }
}