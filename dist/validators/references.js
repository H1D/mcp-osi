export function validateReferences(data) {
    const errors = [];
    const models = (data.semantic_model ?? []);
    for (const model of models) {
        const modelName = model.name ?? "<unnamed>";
        const datasets = (model.datasets ?? []);
        const relationships = (model.relationships ?? []);
        const datasetNames = new Set(datasets.map((d) => d.name).filter(Boolean));
        for (const rel of relationships) {
            const relName = rel.name ?? "<unnamed>";
            if (rel.from && !datasetNames.has(rel.from)) {
                errors.push({
                    type: "reference",
                    path: `semantic_model/${modelName}/relationships/${relName}`,
                    message: `References unknown dataset '${rel.from}' in 'from'`,
                });
            }
            if (rel.to && !datasetNames.has(rel.to)) {
                errors.push({
                    type: "reference",
                    path: `semantic_model/${modelName}/relationships/${relName}`,
                    message: `References unknown dataset '${rel.to}' in 'to'`,
                });
            }
        }
    }
    return errors;
}
