import type { ValidationError } from "./json-schema.js";

interface Relationship {
  name?: string;
  from?: string;
  to?: string;
}

interface Dataset {
  name?: string;
}

export function validateReferences(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];
  const models = (data.semantic_model ?? []) as Record<string, unknown>[];

  for (const model of models) {
    const modelName = (model.name as string) ?? "<unnamed>";
    const datasets = (model.datasets ?? []) as Dataset[];
    const relationships = (model.relationships ?? []) as Relationship[];

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
