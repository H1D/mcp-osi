import type { ValidationError } from "./json-schema.js";

interface Named {
  name?: string;
}

function findDuplicates(items: string[]): string[] {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const item of items) {
    if (seen.has(item)) dupes.push(item);
    seen.add(item);
  }
  return dupes;
}

export function validateUniqueness(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];
  const models = (data.semantic_model ?? []) as Record<string, unknown>[];

  for (const model of models) {
    const modelName = (model.name as string) ?? "<unnamed>";
    const datasets = (model.datasets ?? []) as Named[];
    const metrics = (model.metrics ?? []) as Named[];
    const relationships = (model.relationships ?? []) as Named[];

    // Dataset names
    for (const dup of findDuplicates(datasets.map((d) => d.name!).filter(Boolean))) {
      errors.push({
        type: "uniqueness",
        path: `semantic_model/${modelName}/datasets`,
        message: `Duplicate dataset name '${dup}'`,
      });
    }

    // Field names within each dataset
    for (const ds of datasets) {
      const dsName = ds.name ?? "<unnamed>";
      const fields = ((ds as Record<string, unknown>).fields ?? []) as Named[];
      for (const dup of findDuplicates(fields.map((f) => f.name!).filter(Boolean))) {
        errors.push({
          type: "uniqueness",
          path: `semantic_model/${modelName}/datasets/${dsName}/fields`,
          message: `Duplicate field name '${dup}'`,
        });
      }
    }

    // Metric names
    for (const dup of findDuplicates(metrics.map((m) => m.name!).filter(Boolean))) {
      errors.push({
        type: "uniqueness",
        path: `semantic_model/${modelName}/metrics`,
        message: `Duplicate metric name '${dup}'`,
      });
    }

    // Relationship names
    for (const dup of findDuplicates(relationships.map((r) => r.name!).filter(Boolean))) {
      errors.push({
        type: "uniqueness",
        path: `semantic_model/${modelName}/relationships`,
        message: `Duplicate relationship name '${dup}'`,
      });
    }
  }

  return errors;
}
