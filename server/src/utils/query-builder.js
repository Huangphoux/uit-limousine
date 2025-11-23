export function buildQuery(schema) {
    return Object.keys(schema.shape).reduce((query, key) => {
        query[key] = true;
        return query;
    }, {});
}