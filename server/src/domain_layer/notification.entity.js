// server/src/domain_layer/notification.entity.js

export class NotificationEntity {
  constructor({
    id,
    userId,
    channel = 'IN_APP',
    title,
    body,
    data = null,
    read = false,
    createdAt
  }) {
    this.id = id;
    this.userId = userId;
    this.channel = channel;
    this.title = title;
    this.body = body;
    this.data = data;
    this.read = read;
    this.createdAt = createdAt;

    console.log('[NotificationEntity] Created:', { id, userId, title });
  }

  markAsRead() {
    console.log('[NotificationEntity] Marking as read:', this.id);
    this.read = true;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      channel: this.channel,
      title: this.title,
      body: this.body,
      data: this.data,
      read: this.read,
      createdAt: this.createdAt
    };
  }
}