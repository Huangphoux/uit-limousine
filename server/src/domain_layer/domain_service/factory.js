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

export function toPersistenceNonContainer(entity) {
    if (!entity) return null;

    const type = ["string", "number", "boolean"];
    const result = {};
    for (const [key, value] of Object.entries(entity)) {
        if (value && type.includes(typeof value)) {
            result[key] = value;
        }
    }
    return result;
}

export function toPersistenceContainer(entity) {
    if (!entity) return null;

    const type = ["array", "hash", "set"];
    const result = {};
    for (const [key, value] of Object.entries(entity)) {
        if (value && type.includes(typeof value)) {
            result[key] = {
                createOrConnect: value.map(v => ({
                
                }))
            };
        }
    }
    return result;
}