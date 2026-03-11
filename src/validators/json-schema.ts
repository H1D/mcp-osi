import _Ajv2020 from "ajv/dist/2020.js";
const Ajv2020 = _Ajv2020 as unknown as typeof _Ajv2020.default;

export interface ValidationError {
  type: "schema" | "uniqueness" | "reference";
  path: string;
  message: string;
}

let validate: ReturnType<InstanceType<typeof Ajv2020>["compile"]>;

export function initOsiValidator(schema: Record<string, unknown>) {
  const ajv = new Ajv2020({ allErrors: true });
  validate = ajv.compile(schema);
}

export function validateJsonSchema(data: unknown): ValidationError[] {
  const valid = validate(data);
  if (valid) return [];

  return (validate.errors ?? []).map((err: { instancePath?: string; message?: string }) => ({
    type: "schema" as const,
    path: err.instancePath || "(root)",
    message: err.message ?? "Unknown schema error",
  }));
}
