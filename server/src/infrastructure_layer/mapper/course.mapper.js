import { CourseEntity } from "../../domain_layer/course/course.entity.js";

export class CourseMapper {
  static toPersistence(entity) {
    return {
      title: entity.title,
      shortDesc: entity.shortDesc,
      description: entity.description,
      language: entity.language,
      level: entity.level,
      price: entity.price,
      published: entity.published,
      publishDate: entity.publishDate,
      coverImage: entity.coverImage,
      category: entity.category,
      durationWeeks: entity.durationWeeks,
      durationDays: entity.durationDays,
      durationHours: entity.durationHours,
      organization: entity.organization,
      requirement: entity.requirement,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDomain(raw) {
    if (!raw) return null;

    return CourseEntity.rehydrate(raw);
  }
}
