// server/src/application_layer/notification.usecase.js

import { NotificationRepository } from '../../infrustructure_layer/repository/notification.repository.js';

export class NotificationUseCase {
  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async createNotification(userId, { title, body, channel = 'IN_APP', data = null }) {
    
    try {
      if (!userId || !title || !body) {
        throw new Error('Missing required fields: userId, title, body');
      }

      const notification = await this.notificationRepository.create({
        userId,
        title,
        body,
        channel,
        data
      });

      return notification;
    } catch (error) {
      throw new Error('Failed to create notification!');
    }
  }

  async getUserNotifications(userId, filters = {}) {
    try {
      const notifications = await this.notificationRepository.findByUserId(userId, filters);
      return notifications;
    } catch (error) {
      throw new Error('Failed to get notifications for user!');
    }
  }

  async getNotificationById(id) {
    try {
      const notification = await this.notificationRepository.findById(id);

      if (!notification) {
        throw new Error('Notification not found');
      }

      return notification;
    } catch (error) {
      throw new Error('Failed to get notification by id!');
    }
  }

  async markNotificationAsRead(id, userId) {
    try {
      const notification = await this.notificationRepository.findById(id);

      if (!notification) {
        throw new Error('Notification not found');
      }

      if (notification.userId !== userId) {
        throw new Error('Unauthorized: This notification does not belong to you');
      }

      const updatedNotification = await this.notificationRepository.markAsRead(id);
      return updatedNotification;
    } catch (error) {
      throw new Error('Failed to mark notification as read!');
    }
  }

  async markAllNotificationsAsRead(userId) {
    try {
      const count = await this.notificationRepository.markAllAsRead(userId);
      return { count };
    } catch (error) {
      throw new Error('Failed to mark all notifications as read!');
    }
  }

  async deleteNotification(id, userId) {
    try {
      const notification = await this.notificationRepository.findById(id);

      if (!notification) {
        throw new Error('Notification not found');
      }

      if (notification.userId !== userId) {
        throw new Error('Unauthorized: This notification does not belong to you');
      }

      await this.notificationRepository.delete(id);
      return true;
    } catch (error) {
      console.error('[NotificationUseCase] Error deleting notification:', error);
      throw new Error('Failed to delete notification!');
    }
  }

  async getUnreadCount(userId) {
    console.log('[NotificationUseCase] Getting unread count for user:', userId);
    try {
      const count = await this.notificationRepository.getUnreadCount(userId);
      console.log('[NotificationUseCase] Unread count:', count);
      return { count };
    } catch (error) {
      console.error('[NotificationUseCase] Error getting unread count:', error);
      throw new Error('Failed to get unread notification count!');
    }
  }
}
