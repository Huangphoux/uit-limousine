import z from "zod";
import { ObjectId } from "mongodb";

const inputSchema = z.object({
    lessonId: z.string(),
    resourceId: z.string(),
})

const outputSchema = z.object({
    filename: z.string(),
    mimeType: z.string(),
    stream: z.any(),
})

export class StreamLessonResourceUsecase {
    constructor(lessonResourceRepo, fileStorage) {
        this.lessonResourceRepo = lessonResourceRepo;
        this.fileStorage = fileStorage;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);

        const resource = await this.lessonResourceRepo.getById(parsedInput.resourceId);
        if (!resource)
            throw Error(`Invalid resource id`);
        if (parsedInput.lessonId !== resource.lessonId)
            throw Error(`Invalid resource id`);

        const stream = await this.fileStorage.openStream(new ObjectId(resource.fileId));

        return outputSchema.parse({
            filename: resource.filename,
            mimeType: resource.mimeType,
            stream,
        });
    }
}