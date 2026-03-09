#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { handleValidate } from "./tools/validate.js";
import { handleScaffold } from "./tools/scaffold.js";
import { handleSpecInfo } from "./tools/spec-info.js";
const server = new McpServer({
    name: "mcp-osi",
    version: "0.1.0",
});
server.tool("validate_osi_schema", "Validate an OSI (Open Semantic Interchange) semantic model against the official spec. " +
    "Checks JSON Schema conformance, name uniqueness, and relationship reference integrity.", {
    schema_content: z.string().describe("The OSI schema content as a YAML or JSON string"),
    format: z.enum(["yaml", "json"]).default("yaml").describe("Input format"),
}, async (args) => handleValidate(args));
server.tool("scaffold_osi_schema", "Generate a starter OSI semantic model skeleton. " +
    "Produces a valid OSI schema pre-populated with provided datasets.", {
    model_name: z.string().describe("Name for the semantic model"),
    description: z.string().optional().describe("Description of the semantic model"),
    datasets: z
        .array(z.object({
        name: z.string().describe("Dataset name"),
        source: z.string().describe("Source table (e.g. db.schema.table)"),
        description: z.string().optional().describe("Dataset description"),
    }))
        .optional()
        .describe("Seed datasets to include"),
    format: z.enum(["yaml", "json"]).default("yaml").describe("Output format"),
}, async (args) => handleScaffold(args));
server.tool("get_osi_spec_reference", "Get the OSI specification reference, JSON Schema, or examples. " +
    "Use this to understand the spec before generating or reviewing OSI schemas.", {
    section: z
        .enum(["summary", "schema", "example"])
        .default("summary")
        .describe("'summary' for quick reference, 'schema' for full JSON Schema, 'example' for annotated example"),
}, async (args) => handleSpecInfo(args));
const transport = new StdioServerTransport();
await server.connect(transport);
