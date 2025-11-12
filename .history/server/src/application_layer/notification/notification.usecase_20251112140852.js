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
      
      throw error;
    }
  }

  async getUserNotifications(userId, filters = {}) {
    
    
    try {
      const notifications = await this.notificationRepository.findByUserId(userId, filters);
      
    } catch (error) {
      
      throw error;
    }
  }

  async getNotificationById(id) {
    
    
    try {
      const notification = await this.notificationRepository.findById(id);
      
      if (!notification) {
        throw new Error('Notification not found');
      }

     
    } catch (error) {
     
      throw error;
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
      
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId) {
   
    
    try {
      const count = await this.notificationRepository.markAllAsRead(userId);
      return { count };
    } catch (error) {
      throw error;
    }
  }

  async deleteNotification(id, userId) {
    
    try {
      // Verify ownership
      const notification = await this.notificationRepository.findById(id);
      
      if (!notification) {
        throw new Error('Notification not found');
      }

      if (notification.userId !== userId) {
        throw new Error('Unauthorized: This notification does not belong to you');
      }

      await this.notificationRepository.delete(id);
      console.log('[NotificationUseCase] Notification deleted:', id);
      return true;
    } catch (error) {
      console.error('[NotificationUseCase] Error deleting notification:', error);
      throw error;
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
      throw error;
    }
  }
}