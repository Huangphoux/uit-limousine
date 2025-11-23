export function create(schema, EntityClass, input) {
    const parsedInput = schema ? schema.parse(input) : input;
    return Object.assign(new EntityClass(), parsedInput);
}

export function rehydrate(EntityClass, raw) {
    if (!raw) return null;
    return Object.assign(new EntityClass(), raw);
}

export function toPersistence(entity) {
    if (!entity) return null;
    const { id, ...persistable } = entity;
    return persistable;
}