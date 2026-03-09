function findDuplicates(items) {
    const seen = new Set();
    const dupes = [];
    for (const item of items) {
        if (seen.has(item))
            dupes.push(item);
        seen.add(item);
    }
    return dupes;
}
export function validateUniqueness(data) {
    const errors = [];
    const models = (data.semantic_model ?? []);
    for (const model of models) {
        const modelName = model.name ?? "<unnamed>";
        const datasets = (model.datasets ?? []);
        const metrics = (model.metrics ?? []);
        const relationships = (model.relationships ?? []);
        // Dataset names
        for (const dup of findDuplicates(datasets.map((d) => d.name).filter(Boolean))) {
            errors.push({
                type: "uniqueness",
                path: `semantic_model/${modelName}/datasets`,
                message: `Duplicate dataset name '${dup}'`,
            });
        }
        // Field names within each dataset
        for (const ds of datasets) {
            const dsName = ds.name ?? "<unnamed>";
            const fields = (ds.fields ?? []);
            for (const dup of findDuplicates(fields.map((f) => f.name).filter(Boolean))) {
                errors.push({
                    type: "uniqueness",
                    path: `semantic_model/${modelName}/datasets/${dsName}/fields`,
                    message: `Duplicate field name '${dup}'`,
                });
            }
        }
        // Metric names
        for (const dup of findDuplicates(metrics.map((m) => m.name).filter(Boolean))) {
            errors.push({
                type: "uniqueness",
                path: `semantic_model/${modelName}/metrics`,
                message: `Duplicate metric name '${dup}'`,
            });
        }
        // Relationship names
        for (const dup of findDuplicates(relationships.map((r) => r.name).filter(Boolean))) {
            errors.push({
                type: "uniqueness",
                path: `semantic_model/${modelName}/relationships`,
                message: `Duplicate relationship name '${dup}'`,
            });
        }
    }
    return errors;
}
