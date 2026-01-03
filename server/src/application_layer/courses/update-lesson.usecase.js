import z from "zod";
import { LessonEntity } from "../../domain_layer/course/lesson.entity.js";

export const inputSchema = z.object({
    id: z.string().default(null),
    moduleId: z.string().default(null),
    assignmentId: z.string().nullable().optional(),
    title: z.string(),
    content: z.string().optional(),
    contentType: z.string(),
    mediaUrl: z.string().nullable().optional(),
    durationSec: z.number().nullable().optional(),
    position: z.number().optional(),
});

export class UpdateLessonUsecase {
    constructor(lessonRepo, updateAssignmentUsecase) {
        this.lessonRepo = lessonRepo;
        this.updateAssignmentUsecase = updateAssignmentUsecase;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);

        let lesson = await this.lessonRepo.getById(parsedInput.id);
        if (!lesson) {
            const { id, ...creatingInput } = parsedInput
            lesson = LessonEntity.create(creatingInput);
        }
        else {
            if (lesson.title !== parsedInput.title) lesson.rename(parsedInput.title);
            if (lesson.mediaUrl !== parsedInput.mediaUrl) lesson.changeMediaUrl(parsedInput.mediaUrl);
            if (lesson.content !== parsedInput.content) lesson.modifyContent(parsedInput.content);
            if (lesson.contentType !== parsedInput.contentType) lesson.changeContentType(parsedInput.contentType);
            if (lesson.durationSec !== parsedInput.durationSec) lesson.setLessonDuration(parsedInput.durationSec);
            if (lesson.position !== parsedInput.position) lesson.reorder(parsedInput.position);
            if (lesson.assignmentId !== parsedInput.assignmentId) lesson.changeAssignment(parsedInput.assignmentId);
        }

        return await this.lessonRepo.save(lesson);;
    }
}