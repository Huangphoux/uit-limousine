import z from "zod";
import { AssignmentEntity } from "../../domain_layer/course/assignment.entity.js";

export const inputSchema = z.object({
    id: z.string().default(null),
    courseId: z.string().optional(),
    title: z.string().optional(),
    description: z.string().nullable().default(null),
    dueDate: z
        .union([z.string(), z.date()])
        .transform((val) => (val instanceof Date ? val : new Date(val)))
        .optional(),
    maxPoints: z.number().int().default(100),
});

export class UpdateAssignmentUsecase {
    constructor(assignmentRepo) {
        this.assignmentRepo = assignmentRepo;
    }

    async execute(input) {
        const parsedInput = inputSchema.parse(input);

        let assignment = await this.assignmentRepo.getById(parsedInput.id);
        if (!assignment) {
            const { id, ...creatingInput } = parsedInput
            assignment = AssignmentEntity.create(creatingInput);
        }
        else {
            if (assignment.title !== parsedInput.title) assignment.rename(parsedInput.title);
            if (assignment.description !== parsedInput.description) assignment.reviseDescription(parsedInput.description);
            if (assignment.dueDate !== parsedInput.dueDate) assignment.setDueDate(parsedInput.dueDate);
            if (assignment.maxPoints !== parsedInput.maxPoints) assignment.setMaxPoints(parsedInput.maxPoints);
        }

        return await this.assignmentRepo.save(assignment);
    }
}