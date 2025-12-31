import z from "zod";
import { LessonResourceEntity } from "../../domain_layer/course/lesson-resource.entity.js";

export const inputSchema = z.object({
    id: z.string().nullable().default(null),
    lessonId: z.string().default(null),
    filename: z.string(),
    mimeType: z.string(),
    stream: z.any()
});

export class UploadLessonResourceUsecase {
    constructor(lessonResourceRepo, fileStorage) {
        this.lessonResourceRepo = lessonResourceRepo;
        this.fileStorage = fileStorage;
    }

    async execute(input) {
        console.log(input);
        const parsedInput = inputSchema.parse(input);
        if (!parsedInput.stream)
            return {};
        const storedFile = await this.fileStorage.save(parsedInput.stream, parsedInput.filename, parsedInput.mimeType);
        const fileId = storedFile.fileId.toHexString();

        let lessonResource = null;
        if (!parsedInput.id) {
            lessonResource = LessonResourceEntity.create({ lessonId: parsedInput.lessonId, fileId: fileId, filename: parsedInput.filename, mimeType: parsedInput.mimeType });
        }
        else {
            lessonResource = await this.lessonResourceRepo.getById(parsedInput.id);
            await this.fileStorage.delete(lessonResource.fileId);
            lessonResource.changeFile(fileId, parsedInput.filename, parsedInput.mimeType);
        }

        return await this.lessonResourceRepo.save(lessonResource);
    }
}