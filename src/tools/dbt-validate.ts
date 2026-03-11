import YAML from "yaml";
import _Ajv from "ajv";
const Ajv = _Ajv as unknown as typeof _Ajv.default;
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbtSchema = JSON.parse(
  readFileSync(join(__dirname, "../schema/dbt-yml-schema.json"), "utf-8")
);

type ToolResult = { content: Array<{ type: "text"; text: string }> };

interface ValidationError {
  type: string;
  path: string;
  message: string;
}

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(dbtSchema);

function errorResult(type: string, message: string): ToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ valid: false, error_count: 1, errors: [{ type, path: "(root)", message }] }, null, 2),
      },
    ],
  };
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

function validateSemanticModelLogic(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];
  const models = (data.semantic_models ?? []) as Record<string, unknown>[];

  // Check unique semantic model names
  const modelNames = models.map((m) => m.name as string).filter(Boolean);
  for (const dup of findDuplicates(modelNames)) {
    errors.push({ type: "uniqueness", path: "semantic_models", message: `Duplicate semantic model name '${dup}'` });
  }

  for (const model of models) {
    const modelName = (model.name as string) ?? "<unnamed>";

    // Check unique entity names
    const entities = (model.entities ?? []) as Record<string, unknown>[];
    for (const dup of findDuplicates(entities.map((e) => e.name as string).filter(Boolean))) {
      errors.push({ type: "uniqueness", path: `semantic_models/${modelName}/entities`, message: `Duplicate entity name '${dup}'` });
    }

    // Check unique dimension names
    const dimensions = (model.dimensions ?? []) as Record<string, unknown>[];
    for (const dup of findDuplicates(dimensions.map((d) => d.name as string).filter(Boolean))) {
      errors.push({ type: "uniqueness", path: `semantic_models/${modelName}/dimensions`, message: `Duplicate dimension name '${dup}'` });
    }

    // Check unique measure names
    const measures = (model.measures ?? []) as Record<string, unknown>[];
    for (const dup of findDuplicates(measures.map((m) => m.name as string).filter(Boolean))) {
      errors.push({ type: "uniqueness", path: `semantic_models/${modelName}/measures`, message: `Duplicate measure name '${dup}'` });
    }

    // Check at least one primary entity exists
    const hasPrimary = entities.some((e) => (e.type as string)?.toLowerCase() === "primary");
    if (entities.length > 0 && !hasPrimary) {
      errors.push({ type: "logic", path: `semantic_models/${modelName}/entities`, message: "No entity with type 'primary' found — semantic models typically require one" });
    }
  }

  return errors;
}

export function handleDbtValidate(args: {
  schema_content: string;
  format?: string;
}): ToolResult {
  const format = args.format ?? "yaml";
  let data: Record<string, unknown>;

  try {
    data = format === "json" ? JSON.parse(args.schema_content) : YAML.parse(args.schema_content);
  } catch (e) {
    return errorResult("parse", `Invalid ${format.toUpperCase()}: ${e instanceof Error ? e.message : String(e)}`);
  }

  if (!data || typeof data !== "object") {
    return errorResult("parse", "Input parsed to null or non-object — check your YAML/JSON");
  }

  const errors: ValidationError[] = [];

  // JSON Schema validation
  const valid = validate(data);
  if (!valid) {
    for (const err of validate.errors ?? []) {
      errors.push({
        type: "schema",
        path: err.instancePath || "(root)",
        message: err.message ?? "Unknown schema error",
      });
    }
  }

  // Semantic logic checks
  errors.push(...validateSemanticModelLogic(data));

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          { valid: errors.length === 0, error_count: errors.length, errors: errors.map((e) => ({ type: e.type, path: e.path, message: e.message })) },
          null, 2
        ),
      },
    ],
  };
}
