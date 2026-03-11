let osiSchemaJson = "";

export function initOsiSpecInfo(schemaRaw: string) {
  osiSchemaJson = schemaRaw;
}

const EXAMPLE_YAML = `# Minimal OSI example: a simple e-commerce model
version: "0.1.1"
semantic_model:
  - name: ecommerce_model
    description: Simple e-commerce semantic model
    datasets:
      - name: orders
        source: warehouse.public.orders
        primary_key: [order_id]
        description: Customer orders fact table
        fields:
          - name: order_id
            expression:
              dialects:
                - dialect: ANSI_SQL
                  expression: order_id
          - name: order_date
            expression:
              dialects:
                - dialect: ANSI_SQL
                  expression: order_date
            dimension:
              is_time: true
          - name: total_amount
            expression:
              dialects:
                - dialect: ANSI_SQL
                  expression: total_amount
      - name: customers
        source: warehouse.public.customers
        primary_key: [customer_id]
        description: Customer dimension
        fields:
          - name: customer_id
            expression:
              dialects:
                - dialect: ANSI_SQL
                  expression: customer_id
          - name: customer_name
            expression:
              dialects:
                - dialect: ANSI_SQL
                  expression: "first_name || ' ' || last_name"
            ai_context:
              synonyms: [buyer, client, shopper]
    relationships:
      - name: orders_to_customers
        from: orders
        to: customers
        from_columns: [customer_id]
        to_columns: [customer_id]
    metrics:
      - name: total_revenue
        expression:
          dialects:
            - dialect: ANSI_SQL
              expression: SUM(total_amount)
        description: Total revenue across all orders
`;

const SPEC_SUMMARY = `# OSI (Open Semantic Interchange) Spec v1.0 — Quick Reference

## Top-level structure
- \`version\` (required): Must match the current spec version (check schema for exact value)
- \`semantic_model\` (required): Array of SemanticModel objects
- \`dialects\` (optional): Enum declaration — ANSI_SQL, SNOWFLAKE, MDX, TABLEAU, DATABRICKS
- \`vendors\` (optional): Enum declaration — COMMON, SNOWFLAKE, SALESFORCE, DBT, DATABRICKS

## SemanticModel (required: name, datasets)
- \`name\`: Unique identifier
- \`description\`: Human-readable description
- \`ai_context\`: String or {instructions, synonyms[], examples[]} — context for AI tools
- \`datasets\`: Array of Dataset objects (min 1)
- \`relationships\`: Array of Relationship objects
- \`metrics\`: Array of Metric objects
- \`custom_extensions\`: Array of {vendor_name, data} objects

## Dataset (required: name, source)
- \`name\`: Unique identifier
- \`source\`: Physical table reference (db.schema.table) or query
- \`primary_key\`: String array (single or composite key)
- \`unique_keys\`: Array of string arrays
- \`fields\`: Array of Field objects
- \`description\`, \`ai_context\`, \`custom_extensions\`

## Field (required: name, expression)
- \`name\`: Unique within dataset
- \`expression\`: {dialects: [{dialect, expression}]} — min 1 dialect
- \`dimension\`: {is_time: boolean} — marks time dimensions
- \`label\`: Categorization label
- \`description\`, \`ai_context\`, \`custom_extensions\`

## Relationship (required: name, from, to, from_columns, to_columns)
- \`name\`: Unique identifier
- \`from\`: Many-side dataset name
- \`to\`: One-side dataset name
- \`from_columns\`: FK columns (min 1)
- \`to_columns\`: PK/UK columns (min 1)
- \`ai_context\`, \`custom_extensions\`

## Metric (required: name, expression)
- \`name\`: Unique identifier
- \`expression\`: {dialects: [{dialect, expression}]} — typically aggregate SQL
- \`description\`, \`ai_context\`, \`custom_extensions\`

## Key rules
- All names must be unique within their scope (datasets in model, fields in dataset, etc.)
- Relationships must reference existing dataset names
- Expressions require at least one dialect entry
- custom_extensions.data must be a JSON string
`;

export function handleSpecInfo(args: {
  section?: string;
}): { content: Array<{ type: "text"; text: string }> } {
  const section = args.section ?? "summary";

  switch (section) {
    case "schema":
      return { content: [{ type: "text", text: osiSchemaJson }] };
    case "example":
      return { content: [{ type: "text", text: EXAMPLE_YAML }] };
    case "summary":
    default:
      return { content: [{ type: "text", text: SPEC_SUMMARY }] };
  }
}
