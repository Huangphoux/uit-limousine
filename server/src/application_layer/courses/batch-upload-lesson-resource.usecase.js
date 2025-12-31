import z from "zod";
import { inputSchema as atomicUploadInputSchema } from "./upload-lesson-resource.usecase.js";

const inputSchema = z.array(atomicUploadInputSchema);

export class BatchUploadLessonResourcesUsecase {
    constructor(uploadLessonResourceUsecase) {
        this.uploadLessonResourceUsecase = uploadLessonResourceUsecase;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);

        await Promise.all(parsedInput.map(i => this.uploadLessonResourceUsecase.execute(i)));

        return {};
    }
}