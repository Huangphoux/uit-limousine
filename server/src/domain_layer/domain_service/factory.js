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

  let result = {};
  for (const [key, value] of Object.entries(persistable)) {
    const r = dispatcher(value, withRelations, key);
    if (r === null || r === undefined) continue; // Allow false, 0, ""
    result[key] = r;
  }

  return result;

  function dispatcher(value, withRelations, fieldName) {
    if (value === null || value === undefined) return null;
    if (value instanceof Date) return value; // Handle Date objects
    if (isPrimitive(value)) return toPersistenceNonContainer(value);

    if (!withRelations) return null;
    if (isContainer(value)) return toPersistenceContainer(value, fieldName);

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

  function toPersistenceContainer(value, fieldName) {
    if (!value.length) return null;

    // For nested relations (like lessons inside modules), just create new ones
    // The repository layer handles deleting old lessons before the upsert
    const isNestedRelation = fieldName === "lessons";

    if (isNestedRelation) {
      // Just create new lessons (old ones are deleted at repository level)
      return {
        create: value.map((v) => {
          const fullPersistence = toPersistence(v, withRelations);
          console.log(`[toPersistence] Lesson before destructuring:`, {
            title: v.title,
            mediaUrl: v.mediaUrl,
            fullPersistence,
          });
          const { id, ...rest } = fullPersistence;
          console.log(`[toPersistence] Lesson after destructuring:`, {
            title: v.title,
            rest,
          });
          return rest;
        }),
      };
    }

    // For top-level relations (like modules), use upsert
    return {
      upsert: value.map((v) => ({
        where: {
          id: v.id,
        },
        create: toPersistence(v, withRelations),
        update: toPersistence(v, withRelations),
      })),
    };
  }
}
