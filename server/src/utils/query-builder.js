import { z } from "zod";

/**
 * Recursively build a Prisma `select` object from a Zod schema.
 * Includes all fields from the schema. Nested objects are handled recursively.
 */
export function buildQuery(schema) {
    if (!(schema instanceof z.ZodObject)) return true; // primitives → select all

    const shape = schema.shape;
    const select = {};

    for (const key of Object.keys(shape)) {
        let field = shape[key];
        if (field instanceof z.ZodOptional) {
            field = field.unwrap();
        }
        if (field instanceof z.ZodObject) {
            select[key] = { select: buildQuery(field) };
        }
        else if (field instanceof z.ZodArray) {
            select[key] = { select: buildQuery(field.element) };
        }
        else {
            select[key] = true;
        }
    }

    return select;
}
