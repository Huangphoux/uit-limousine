export class GenericMapper {
    constructor(schema, fieldMap = {}) {
        this.schema = schema;
        this.fieldMap = fieldMap;
    }

    toPersistence(entity) {
        const plain = {};
        const shapeKeys = Object.keys(this.schema.shape);

        for (const key of shapeKeys) {
            const dbKey = this.fieldMap[key] ?? key;
            plain[dbKey] = entity[key];
        }

        return plain;
    }

    toDomain(EntityClass, raw) {
        if (!raw) return null;

        const entity = new EntityClass({});
        Object.assign(entity, raw);
        return entity;
    }
}
