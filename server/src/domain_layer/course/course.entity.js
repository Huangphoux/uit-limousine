import { z } from "zod";
import { ModuleEntity, moduleSchema } from "./module.entity.js";

export const courseSchema = z.object({
  id: z.string().nullable().default(null),
  title: z.string({ required_error: "Title is required" }).nonempty("Title cannot be empty"),

  // these fields can be string, null, or undefined
  shortDesc: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  language: z.string().default("en").optional(),
  level: z.string().nullable().optional(),
  price: z.number().nonnegative({ message: "Price must be >= 0" }).default(0),
  published: z.boolean().default(false),
  publishDate: z.date().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  durationWeeks: z.number().nullable().optional(),
  durationDays: z.number().nullable().optional(),
  durationHours: z.number().nullable().optional(),
  organization: z.string().nullable().optional(),
  requirement: z.string().nullable().optional(),

  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),

  // relations
  // instructor: z.object().nullable().optional(),
  instructorId: z.string().optional(),
  // category: z.string().nullable().optional(),

  // assignments: z.array(z.any()).optional(),
  // certificates: z.array(z.any()).optional(),
  // enrollments: z.array(z.any()).optional(),
  // modules: z.array(moduleSchema).optional(),
  // payments: z.array(z.any()).optional(),
  // reviews: z.array(z.any()).optional(),
  // threads: z.array(z.any()).optional(),
});

export class CourseEntity {
  static schema = courseSchema;

  rename(title) {
    this.title = CourseEntity.schema.shape.title.parse(title);
    this.updatedAt = new Date();
  }

  reviseDescription(description) {
    this.description = CourseEntity.schema.shape.description.parse(description);
    this.updatedAt = new Date();
  }

  setPrice(price) {
    if (this.published) throw Error("Cannot set price on published course");

    this.price = CourseEntity.schema.shape.price.parse(price);
    this.updatedAt = new Date();
  }

  changeLevel(level) {
    this.level = CourseEntity.schema.shape.level.parse(level);
    this.updatedAt = new Date();
  }

  changeLanguage(language) {
    this.language = CourseEntity.schema.shape.language.parse(language);
    this.updatedAt = new Date();
  }

  replaceCoverImage(coverImage) {
    this.coverImage = CourseEntity.schema.shape.coverImage.parse(coverImage);
    this.updatedAt = new Date();
  }

  setCategory(category) {
    this.category = CourseEntity.schema.shape.category.parse(category);
    this.updatedAt = new Date();
  }

  setDuration(weeks, days, hours) {
    // parse and normalize numbers or null
    this.durationWeeks = weeks != null ? Number(weeks) : null;
    this.durationDays = days != null ? Number(days) : null;
    this.durationHours = hours != null ? Number(hours) : null;
    this.updatedAt = new Date();
  }

  setOrganization(org) {
    this.organization = CourseEntity.schema.shape.organization.parse(org);
    this.updatedAt = new Date();
  }

  setRequirement(req) {
    this.requirement = CourseEntity.schema.shape.requirement.parse(req);
    this.updatedAt = new Date();
  }

  static create(input) {
    let parsedInput = CourseEntity.schema.parse(input);

    // Business rules here

    return Object.assign(new CourseEntity(), parsedInput);
  }

  static rehydrate(input) {
    if (!input) return null;

    const entity = new CourseEntity();

    Object.assign(entity, input);

    return entity;
  }

  toJSON() {
    return { ...this };
  }
}
