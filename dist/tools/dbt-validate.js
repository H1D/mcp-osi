import YAML from "yaml";
import _Ajv from "ajv";
const Ajv = _Ajv;
let validate;
export function initDbtValidator(schema) {
    const ajv = new Ajv({ allErrors: true, strict: false });
    validate = ajv.compile(schema);
}
function errorResult(type, message) {
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({ valid: false, error_count: 1, errors: [{ type, path: "(root)", message }] }, null, 2),
            },
        ],
    };
}
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
function validateSemanticModelLogic(data) {
    const errors = [];
    const models = (data.semantic_models ?? []);
    const modelNames = models.map((m) => m.name).filter(Boolean);
    for (const dup of findDuplicates(modelNames)) {
        errors.push({ type: "uniqueness", path: "semantic_models", message: `Duplicate semantic model name '${dup}'` });
    }
    for (const model of models) {
        const modelName = model.name ?? "<unnamed>";
        const entities = (model.entities ?? []);
        for (const dup of findDuplicates(entities.map((e) => e.name).filter(Boolean))) {
            errors.push({ type: "uniqueness", path: `semantic_models/${modelName}/entities`, message: `Duplicate entity name '${dup}'` });
        }
        const dimensions = (model.dimensions ?? []);
        for (const dup of findDuplicates(dimensions.map((d) => d.name).filter(Boolean))) {
            errors.push({ type: "uniqueness", path: `semantic_models/${modelName}/dimensions`, message: `Duplicate dimension name '${dup}'` });
        }
        const measures = (model.measures ?? []);
        for (const dup of findDuplicates(measures.map((m) => m.name).filter(Boolean))) {
            errors.push({ type: "uniqueness", path: `semantic_models/${modelName}/measures`, message: `Duplicate measure name '${dup}'` });
        }
        const hasPrimary = entities.some((e) => e.type?.toLowerCase() === "primary");
        if (entities.length > 0 && !hasPrimary) {
            errors.push({ type: "logic", path: `semantic_models/${modelName}/entities`, message: "No entity with type 'primary' found — semantic models typically require one" });
        }
    }
    return errors;
}
export function handleDbtValidate(args) {
    const format = args.format ?? "yaml";
    let data;
    try {
        data = format === "json" ? JSON.parse(args.schema_content) : YAML.parse(args.schema_content);
    }
    catch (e) {
        return errorResult("parse", `Invalid ${format.toUpperCase()}: ${e instanceof Error ? e.message : String(e)}`);
    }
    if (!data || typeof data !== "object") {
        return errorResult("parse", "Input parsed to null or non-object — check your YAML/JSON");
    }
    const errors = [];
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
    errors.push(...validateSemanticModelLogic(data));
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({ valid: errors.length === 0, error_count: errors.length, errors: errors.map((e) => ({ type: e.type, path: e.path, message: e.message })) }, null, 2),
            },
        ],
    };
}
