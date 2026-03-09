import _Ajv2020 from "ajv/dist/2020.js";
const Ajv2020 = _Ajv2020 as unknown as typeof _Ajv2020.default;
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const osiSchema = JSON.parse(
  readFileSync(join(__dirname, "../schema/osi-schema.json"), "utf-8")
);

export interface ValidationError {
  type: "schema" | "uniqueness" | "reference";
  path: string;
  message: string;
}

const ajv = new Ajv2020({ allErrors: true });
const validate = ajv.compile(osiSchema);

export function validateJsonSchema(data: unknown): ValidationError[] {
  const valid = validate(data);
  if (valid) return [];

  return (validate.errors ?? []).map((err: { instancePath?: string; message?: string }) => ({
    type: "schema" as const,
    path: err.instancePath || "(root)",
    message: err.message ?? "Unknown schema error",
  }));
}
