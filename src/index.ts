#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { handleValidate } from "./tools/validate.js";
import { handleScaffold } from "./tools/scaffold.js";
import { handleSpecInfo } from "./tools/spec-info.js";
import { handleDbtValidate } from "./tools/dbt-validate.js";
import { handleDbtScaffold } from "./tools/dbt-scaffold.js";
import { handleDbtSpecInfo } from "./tools/dbt-spec-info.js";

const server = new McpServer({
  name: "mcp-osi",
  version: "0.2.0",
});

server.tool(
  "validate_osi_schema",
  "Validate an OSI (Open Semantic Interchange) semantic model against the official spec. " +
    "Checks JSON Schema conformance, name uniqueness, and relationship reference integrity.",
  {
    schema_content: z.string().describe("The OSI schema content as a YAML or JSON string"),
    format: z.enum(["yaml", "json"]).default("yaml").describe("Input format"),
  },
  async (args) => handleValidate(args)
);

server.tool(
  "scaffold_osi_schema",
  "Generate a starter OSI semantic model skeleton. " +
    "Produces a valid OSI schema pre-populated with provided datasets.",
  {
    model_name: z.string().describe("Name for the semantic model"),
    description: z.string().optional().describe("Description of the semantic model"),
    datasets: z
      .array(
        z.object({
          name: z.string().describe("Dataset name"),
          source: z.string().describe("Source table (e.g. db.schema.table)"),
          description: z.string().optional().describe("Dataset description"),
        })
      )
      .optional()
      .describe("Seed datasets to include"),
    format: z.enum(["yaml", "json"]).default("yaml").describe("Output format"),
  },
  async (args) => handleScaffold(args)
);

server.tool(
  "get_osi_spec_reference",
  "Get the OSI specification reference, JSON Schema, or examples. " +
    "Use this to understand the spec before generating or reviewing OSI schemas.",
  {
    section: z
      .enum(["summary", "schema", "example"])
      .default("summary")
      .describe(
        "'summary' for quick reference, 'schema' for full JSON Schema, 'example' for annotated example"
      ),
  },
  async (args) => handleSpecInfo(args)
);

// --- dbt tools ---

server.tool(
  "validate_dbt_semantic_model",
  "Validate a dbt semantic model YAML against the official dbt JSON Schema. " +
    "Checks schema conformance, name uniqueness, and primary entity presence.",
  {
    schema_content: z.string().describe("The dbt YAML content as a string"),
    format: z.enum(["yaml", "json"]).default("yaml").describe("Input format"),
  },
  async (args) => handleDbtValidate(args)
);

server.tool(
  "scaffold_dbt_semantic_model",
  "Generate a starter dbt semantic model skeleton with entities, dimensions, and measures.",
  {
    model_name: z.string().describe("Name for the semantic model"),
    description: z.string().optional().describe("Description"),
    datasets: z
      .array(
        z.object({
          name: z.string().describe("Semantic model name"),
          model: z.string().describe("dbt ref, e.g. ref('my_model')"),
          primary_entity: z.string().optional().describe("Primary entity name"),
          description: z.string().optional().describe("Description"),
        })
      )
      .optional()
      .describe("Seed models to include"),
    format: z.enum(["yaml", "json"]).default("yaml").describe("Output format"),
  },
  async (args) => handleDbtScaffold(args)
);

server.tool(
  "get_dbt_spec_reference",
  "Get the dbt semantic model specification reference, JSON Schema, or examples. " +
    "Use this to understand dbt's format before generating or reviewing semantic models.",
  {
    section: z
      .enum(["summary", "schema", "example"])
      .default("summary")
      .describe("'summary' for quick reference, 'schema' for full JSON Schema, 'example' for annotated example"),
  },
  async (args) => handleDbtSpecInfo(args)
);

const transport = new StdioServerTransport();
await server.connect(transport);
