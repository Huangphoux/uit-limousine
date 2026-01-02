import z from "zod";

export const assignmentSchema = z.object({
    id: z.string().default(null),
    courseId: z.string(),
    title: z.string().default(null),
    description: z.string().nullable().default(null),
    dueDate: z.date(),
    maxPoints: z.number().int().default(100),
    createdAt: z.date().default(() => new Date()),
})

export class AssignmentEntity {
    static schema = assignmentSchema;

    rename(title) {
        this.title = AssignmentEntity.schema.shape.title.parse(title);
    }

    reviseDescription(description) {
        this.description = AssignmentEntity.schema.shape.description.parse(description);
    }

    setDueDate(date) {
        this.dueDate = AssignmentEntity.schema.shape.dueDate.parse(date);
    }

    setMaxPoints(points) {
        this.maxPoints = AssignmentEntity.schema.shape.maxPoints.parse(points);
    }

    static create(input) {
        let parsedInput = AssignmentEntity.schema.parse(input);

        // Business rules here

        return Object.assign(new AssignmentEntity(), parsedInput);
    }

    static rehydrate(input) {
        if (!input) return null;

        const entity = new AssignmentEntity();

        Object.assign(entity, input);

        return entity;
    }
}