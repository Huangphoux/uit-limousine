import { z } from "zod";
import { ObjectId } from "mongodb";

export const inputSchema = z.object({
    lessonId: z.string(),
});

export const outputSchema = z.array(z.object({
    lessonResourceId: z.string(),
    lessonId: z.string(),
    stream: z.any(),
}));

export class GetLessonResourcesUsecase {
    constructor(lessonResourceRepo, fileStorage) {
        this.lessonResourceRepo = lessonResourceRepo;
        this.fileStorage = fileStorage;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);

        const resources = await this.lessonResourceRepo.getByLessonId(parsedInput.lessonId);

        const streams = await Promise.all(
            resources.map(r => this.fileStorage.openStream(new ObjectId(r.fileId)))
        );

        const output = resources.map((r, index) => ({
            lessonResourceId: r.id,
            lessonId: r.lessonId,
            stream: streams[index],
        }));

        return outputSchema.parse(output);
    }
}