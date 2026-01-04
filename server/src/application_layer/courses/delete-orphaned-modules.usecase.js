import z from "zod"

const inputSchema = z.object({
    keptModuleIds: z.array(z.string()),
    courseId: z.string(),
})

export class DeleteOrphanedModulesUsecase {
    constructor(moduleRepo, moduleRead) {
        this.moduleRepo = moduleRepo;
        this.moduleRead = moduleRead;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);

        const setModuleIds = new Set(parsedInput.keptModuleIds);
        let currentIds = await this.moduleRead.getIdsByCourseId(parsedInput.courseId);
        currentIds = currentIds.map(c => c.id);
        const deletedIds = currentIds.filter(i => !setModuleIds.has(i));
        await this.moduleRepo.deleteByIds(deletedIds);
    }
}