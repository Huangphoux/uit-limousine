// server/src/presentation_layer/controllers/notification.controller.js

import { NotificationUseCase } from '../../application_layer/notification.usecase.js';
import { NotificationMapper } from '../../infrastructure_layer/mapper/notification.mapper.js';

export class NotificationController {
  constructor() {
    this.notificationUseCase = new NotificationUseCase();
  }

  // POST /notifications - Create a new notification
  async createNotification(req, res) {
    console.log('[NotificationController] POST /notifications - Body:', req.body);
    
    try {
      const userId = req.user?.id; // Assuming authentication middleware sets req.user
      const { targetUserId, title, body, channel, data } = req.body;

      // Admin can create notification for any user, otherwise create for self
      const recipientId = targetUserId || userId;

      if (!recipientId) {
        console.log('[NotificationController] Missing userId');
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const notification = await this.notificationUseCase.createNotification(recipientId, {
        title,
        body,
        channel,
        data
      });

      const notificationDTO = NotificationMapper.toDTO(notification);

      console.log('[NotificationController] Notification created successfully:', notificationDTO.id);
      return res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notificationDTO
      });
    } catch (error) {
      console.error('[NotificationController] Error creating notification:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to create notification'
      });
    }
  }

  // GET /notifications - Get all notifications for current user
  async getUserNotifications(req, res) {
    console.log('[NotificationController] GET /notifications - Query:', req.query);
    
    try {
      const userId = req.user?.id;

      if (!userId) {
        console.log('[NotificationController] Unauthorized - No user ID');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const filters = {};
      
      if (req.query.read !== undefined) {
        filters.read = req.query.read === 'true';
      }

      if (req.query.limit) {
        filters.limit = parseInt(req.query.limit);
      }

      const notifications = await this.notificationUseCase.getUserNotifications(userId, filters);
      const notificationDTOs = NotificationMapper.toDTOList(notifications);

      console.log('[NotificationController] Retrieved notifications:', notificationDTOs.length);
      return res.status(200).json({
        success: true,
        data: notificationDTOs,
        count: notificationDTOs.length
      });
    } catch (error) {
      console.error('[NotificationController] Error getting notifications:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get notifications'
      });
    }
  }

  // GET /notifications/:id - Get notification by ID
  async getNotificationById(req, res) {
    console.log('[NotificationController] GET /notifications/:id - Params:', req.params);
    
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const notification = await this.notificationUseCase.getNotificationById(id);

      // Verify ownership
      if (notification.userId !== userId) {
        console.log('[NotificationController] Unauthorized access attempt');
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You do not have access to this notification'
        });
      }

      const notificationDTO = NotificationMapper.toDTO(notification);

      console.log('[NotificationController] Notification retrieved:', notificationDTO.id);
      return res.status(200).json({
        success: true,
        data: notificationDTO
      });
    } catch (error) {
      console.error('[NotificationController] Error getting notification:', error);
      return res.status(error.message === 'Notification not found' ? 404 : 500).json({
        success: false,
        message: error.message || 'Failed to get notification'
      });
    }
  }

  // PUT /notifications/:id/read - Mark notification as read
  async markAsRead(req, res) {
    console.log('[NotificationController] PUT /notifications/:id/read - Params:', req.params);
    
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        console.log('[NotificationController] Unauthorized - No user ID');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const notification = await this.notificationUseCase.markNotificationAsRead(id, userId);
      const notificationDTO = NotificationMapper.toDTO(notification);

      console.log('[NotificationController] Notification marked as read:', notificationDTO.id);
      return res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notificationDTO
      });
    } catch (error) {
      console.error('[NotificationController] Error marking notification as read:', error);
      return res.status(error.message.includes('not found') ? 404 : 
                        error.message.includes('Unauthorized') ? 403 : 500).json({
        success: false,
        message: error.message || 'Failed to mark notification as read'
      });
    }
  }

  // PUT /notifications/read-all - Mark all notifications as read
  async markAllAsRead(req, res) {
    console.log('[NotificationController] PUT /notifications/read-all');
    
    try {
      const userId = req.user?.id;

      if (!userId) {
        console.log('[NotificationController] Unauthorized - No user ID');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const result = await this.notificationUseCase.markAllNotificationsAsRead(userId);

      console.log('[NotificationController] All notifications marked as read:', result.count);
      return res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
        data: result
      });
    } catch (error) {
      console.error('[NotificationController] Error marking all as read:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to mark all notifications as read'
      });
    }
  }

  // DELETE /notifications/:id - Delete notification
  async deleteNotification(req, res) {
    console.log('[NotificationController] DELETE /notifications/:id - Params:', req.params);
    
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        console.log('[NotificationController] Unauthorized - No user ID');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      await this.notificationUseCase.deleteNotification(id, userId);

      console.log('[NotificationController] Notification deleted:', id);
      return res.status(200).json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      console.error('[NotificationController] Error deleting notification:', error);
      return res.status(error.message.includes('not found') ? 404 : 
                        error.message.includes('Unauthorized') ? 403 : 500).json({
        success: false,
        message: error.message || 'Failed to delete notification'
      });
    }
  }

  // GET /notifications/unread-count - Get unread notifications count
  async getUnreadCount(req, res) {
    console.log('[NotificationController] GET /notifications/unread-count');
    
    try {
      const userId = req.user?.id;

      if (!userId) {
        console.log('[NotificationController] Unauthorized - No user ID');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const result = await this.notificationUseCase.getUnreadCount(userId);

      console.log('[NotificationController] Unread count:', result.count);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('[NotificationController] Error getting unread count:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get unread count'
      });
    }
  }
}