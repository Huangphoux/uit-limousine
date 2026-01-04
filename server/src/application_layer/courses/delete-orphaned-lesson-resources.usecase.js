import z from "zod"

const inputSchema = z.object({
    keptLessonResourceIds: z.array(z.string()),
    lessonId: z.string(),
})

export class DeleteOrphanedLessonResourcesUsecase {
    constructor(lessonResourceRepo, lessonResourceRead) {
        this.lessonResourceRepo = lessonResourceRepo;
        this.lessonResourceRead = lessonResourceRead;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);

        const setlessonResourceIds = new Set(parsedInput.keptLessonResourceIds);
        let currentIds = await this.lessonResourceRead.getIdsByLessonId(parsedInput.lessonId);
        currentIds = currentIds.map(c => c.id);
        const deletedIds = currentIds.filter(i => !setlessonResourceIds.has(i));
        await this.lessonResourceRepo.deleteByIds(deletedIds);
    }
}