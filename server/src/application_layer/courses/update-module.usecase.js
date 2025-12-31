import z from "zod"
import { ModuleEntity } from "../../domain_layer/course/module.entity.js";

export const inputSchema = z.object({
    id: z.string().nullable().optional(),
    courseId: z.string().nullable().optional(),
    title: z.string(),
    position: z.number().optional(),
})

export class UpdateModuleUsecase {
    constructor(moduleRepo) {
        this.moduleRepo = moduleRepo;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);

        let module = await this.moduleRepo.getById(parsedInput.id);
        if (!module) {
            module = ModuleEntity.create({ title: parsedInput.title, position: parsedInput.position, courseId: parsedInput.courseId });
        }
        else {
            if (module.title !== parsedInput.title) module.rename(parsedInput.title);
            if (module.position !== parsedInput.position) module.reorder(parsedInput.position);
        }

        const savedModule = await this.moduleRepo.save(module);
        return savedModule;
    }
}