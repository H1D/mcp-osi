import YAML from "yaml";
export const SCAFFOLD_TOOL = {
    name: "scaffold_osi_schema",
    description: "Generate a starter OSI semantic model skeleton. " +
        "Produces a valid OSI schema pre-populated with provided datasets, " +
        "ready to be filled in with fields, relationships, and metrics.",
    inputSchema: {
        type: "object",
        properties: {
            model_name: {
                type: "string",
                description: "Name for the semantic model",
            },
            description: {
                type: "string",
                description: "Description of the semantic model",
            },
            datasets: {
                type: "array",
                description: "Seed datasets to include",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Dataset name" },
                        source: {
                            type: "string",
                            description: "Source table (e.g. db.schema.table)",
                        },
                        description: { type: "string", description: "Dataset description" },
                    },
                    required: ["name", "source"],
                },
            },
            format: {
                type: "string",
                enum: ["yaml", "json"],
                description: "Output format (default: yaml)",
                default: "yaml",
            },
        },
        required: ["model_name"],
    },
};
export function handleScaffold(args) {
    const format = args.format ?? "yaml";
    const datasets = (args.datasets ?? [{ name: "example_table", source: "database.schema.example_table" }]).map((ds) => ({
        name: ds.name,
        source: ds.source,
        ...(ds.description ? { description: ds.description } : {}),
        fields: [
            {
                name: "id",
                expression: {
                    dialects: [{ dialect: "ANSI_SQL", expression: "id" }],
                },
                description: "Primary identifier — replace with actual field",
            },
        ],
    }));
    const schema = {
        version: "1.0",
        semantic_model: [
            {
                name: args.model_name,
                ...(args.description ? { description: args.description } : {}),
                datasets,
                relationships: [],
                metrics: [],
            },
        ],
    };
    const output = format === "json" ? JSON.stringify(schema, null, 2) : YAML.stringify(schema);
    return {
        content: [
            {
                type: "text",
                text: output,
            },
        ],
    };
}
