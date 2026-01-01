import z from "zod";
import { inputSchema as updateCourseInputSchema } from "./update-course.usecase.js";
import { inputSchema as updateModuleInputSchema } from "./update-module.usecase.js";
import { inputSchema as updateLessonInputSchema } from "./update-lesson.usecase.js";
import { inputSchema as uploadLessonResourceInputSchema } from "./upload-lesson-resource.usecase.js";
import { inputSchema as updateAssignmentInputSchema } from "./update-assignment.usecase.js";

const inputSchema = updateCourseInputSchema.extend({
  modules: z
    .array(
      updateModuleInputSchema.extend({
        lessons: z
          .array(
            updateLessonInputSchema.extend({
              lessonResources: z.array(uploadLessonResourceInputSchema).default([]),
              ...updateAssignmentInputSchema.shape,
            })
          )
          .default([]),
      })
    )
    .default([]),
});

export class ComprehensiveUpdateCourseUsecase {
  constructor(
    updateCourseUsecase,
    updateModuleUsecase,
    updateLessonUsecase,
    updateAssignmentUsecase,
    uploadLessonResourceUsecase,
    deleteOrphanedModulesUsecase,
    deleteOrphanedLessonsUsecase,
    deleteOrphanedLessonResourcesUsecase
  ) {
    this.updateCourseUsecase = updateCourseUsecase;
    this.updateModuleUsecase = updateModuleUsecase;
    this.updateLessonUsecase = updateLessonUsecase;
    this.updateAssignmentUsecase = updateAssignmentUsecase;
    this.uploadLessonResourceUsecase = uploadLessonResourceUsecase;
    this.deleteOrphanedModulesUsecase = deleteOrphanedModulesUsecase;
    this.deleteOrphanedLessonsUsecase = deleteOrphanedLessonsUsecase;
    this.deleteOrphanedLessonResourcesUsecase = deleteOrphanedLessonResourcesUsecase;
  }

  async execute(input) {
    const parsedInput = inputSchema.parse(input);

    const course = await this.updateCourseUsecase.execute(parsedInput);

    let keptModuleIds = [];
    for (const module of parsedInput.modules) {
      keptModuleIds.push(module.id);
      let keptLessonIds = [];
      for (const lesson of module.lessons) {
        keptLessonIds.push(lesson.id);
        let keptLessonResourceIds = [];
        for (const resource of lesson.lessonResources || []) {
          // Only include existing resource ids (new uploads won't have an id yet)
          if (resource && resource.id) keptLessonResourceIds.push(resource.id);
        }
        await this.deleteOrphanedLessonResourcesUsecase.execute({
          keptLessonResourceIds,
          lessonId: lesson.id,
        });
      }
      await this.deleteOrphanedLessonsUsecase.execute({ keptLessonIds, moduleId: module.id });
    }
    await this.deleteOrphanedModulesUsecase.execute({ keptModuleIds, courseId: course.id });

    for (let moduleInput of parsedInput.modules) {
      moduleInput.courseId = course.id;
      const module = await this.updateModuleUsecase.execute(moduleInput);
      for (let lessonInput of moduleInput.lessons) {
        if (lessonInput.contentType === "assignment") {
          lessonInput.courseId = moduleInput.courseId;
          const assignment = await this.updateAssignmentUsecase.execute(lessonInput);
          lessonInput.assignmentId = assignment.id;
        }
        lessonInput.moduleId = module.id;
        const lesson = await this.updateLessonUsecase.execute(lessonInput);
        for (let resourceInput of lessonInput.lessonResources) {
          resourceInput.lessonId = lesson.id;
          await this.uploadLessonResourceUsecase.execute(resourceInput);
        }
      }
    }

    return {};
  }
}
