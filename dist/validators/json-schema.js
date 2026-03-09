import _Ajv2020 from "ajv/dist/2020.js";
const Ajv2020 = _Ajv2020;
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const osiSchema = JSON.parse(readFileSync(join(__dirname, "../schema/osi-schema.json"), "utf-8"));
const ajv = new Ajv2020({ allErrors: true });
const validate = ajv.compile(osiSchema);
export function validateJsonSchema(data) {
    const valid = validate(data);
    if (valid)
        return [];
    return (validate.errors ?? []).map((err) => ({
        type: "schema",
        path: err.instancePath || "(root)",
        message: err.message ?? "Unknown schema error",
    }));
}
