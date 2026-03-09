import YAML from "yaml";
import { validateJsonSchema } from "../validators/json-schema.js";
import { validateUniqueness } from "../validators/uniqueness.js";
import { validateReferences } from "../validators/references.js";
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
export function handleValidate(args) {
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
    const errors = [
        ...validateJsonSchema(data),
        ...validateUniqueness(data),
        ...validateReferences(data),
    ];
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({ valid: errors.length === 0, error_count: errors.length, errors: errors.map((e) => ({ type: e.type, path: e.path, message: e.message })) }, null, 2),
            },
        ],
    };
}
