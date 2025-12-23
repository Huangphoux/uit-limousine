export function create(schema, EntityClass, input) {
    const parsedInput = schema ? schema.parse(input) : input;
    return Object.assign(new EntityClass(), parsedInput);
}

export function rehydrate(EntityClass, raw) {
    if (!raw) return null;
    return Object.assign(new EntityClass(), raw);
}

export function toPersistence(entity, withRelations) {
    if (!entity) return null;
    const { id, ...persistable } = entity;

    let result = {}
    for (const [key, value] of Object.entries(persistable)) {
        const r = dispatcher(value, withRelations);
        if (!r) continue;
        result[key] = r;
    }

    return result;

    function dispatcher(value, withRelations) {
        if (!value) return null;
        if (isPrimitive(value))
            return toPersistenceNonContainer(value);

        if (!withRelations)
            return null;
        if (isContainer(value))
            return toPersistenceContainer(value);

        return null;
    }

    function isPrimitive(value) {
        return ["string", "number", "boolean"].includes(typeof value);
    }

    function isContainer(value) {
        return Array.isArray(value);
    }

    function toPersistenceNonContainer(value) {
        return value;
    }

    function toPersistenceContainer(value) {
        if (!value.length) return null;
        return {
            connectOrCreate: value.map(v => ({
                where: {
                    id: v.id
                },
                create: toPersistence(v),
            }))
        };
    }
}

