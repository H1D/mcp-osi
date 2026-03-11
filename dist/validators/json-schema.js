import _Ajv2020 from "ajv/dist/2020.js";
const Ajv2020 = _Ajv2020;
let validate;
export function initOsiValidator(schema) {
    const ajv = new Ajv2020({ allErrors: true });
    validate = ajv.compile(schema);
}
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
