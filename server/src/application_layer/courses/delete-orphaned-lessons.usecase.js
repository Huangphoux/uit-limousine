import z from "zod"

const inputSchema = z.object({
    keptLessonIds: z.array(z.string()),
    moduleId: z.string(),
})

export class DeleteOrphanedLessonsUsecase {
    constructor(lessonRepo, lessonRead) {
        this.lessonRepo = lessonRepo;
        this.lessonRead = lessonRead;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);

        const setlessonIds = new Set(parsedInput.keptLessonIds);
        let currentIds = await this.lessonRead.getIdsByModuleId(parsedInput.moduleId);
        currentIds = currentIds.map(c => c.id);
        const deletedIds = currentIds.filter(i => !setlessonIds.has(i));
        await this.lessonRepo.deleteByIds(deletedIds);
    }
}