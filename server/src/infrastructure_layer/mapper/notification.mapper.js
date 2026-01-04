// server/src/infrastructure_layer/mapper/notification.mapper.js

export class NotificationMapper {
  static toDTO(notificationEntity) {
    console.log("[NotificationMapper] Converting entity to DTO:", notificationEntity.id);

    return {
      id: notificationEntity.id,
      userId: notificationEntity.userId,
      channel: notificationEntity.channel,
      title: notificationEntity.title,
      body: notificationEntity.body,
      data: notificationEntity.data,
      read: notificationEntity.read,
      createdAt: notificationEntity.createdAt,
      type: notificationEntity.type || "NORMAL",
    };
  }

  static toDTOList(notificationEntities) {
    console.log(
      "[NotificationMapper] Converting entity list to DTO list:",
      notificationEntities.length
    );

    return notificationEntities.map((entity) => this.toDTO(entity));
  }
}
