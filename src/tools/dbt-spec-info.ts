let dbtSchemaJson = "";

export function initDbtSpecInfo(schemaRaw: string) {
  dbtSchemaJson = schemaRaw;
}

const EXAMPLE_YAML = `# dbt semantic model example: e-commerce orders
version: 2

semantic_models:
  - name: orders
    model: ref('fct_orders')
    description: Order fact table with one row per order
    defaults:
      agg_time_dimension: order_date

    entities:
      - name: order_id
        type: primary
      - name: customer_id
        type: foreign

    dimensions:
      - name: order_date
        type: time
        type_params:
          time_granularity: day
      - name: order_status
        type: categorical

    measures:
      - name: order_total
        description: Total order amount in USD
        agg: sum
        expr: amount_usd
      - name: order_count
        description: Number of orders
        agg: count
        expr: "1"
      - name: avg_order_value
        description: Average order value
        agg: average
        expr: amount_usd
      - name: unique_customers
        description: Distinct customer count
        agg: count_distinct
        expr: customer_id

metrics:
  - name: revenue
    type: simple
    label: Total Revenue
    type_params:
      measure: order_total
  - name: large_orders
    type: derived
    label: Large Order Revenue
    type_params:
      expr: order_total
      metrics:
        - name: order_total
          filter:
            - "{{ Dimension('order_id__order_status') }} = 'completed'"
            - "{{ Dimension('order_id__order_total') }} > 100"
`;

const SPEC_SUMMARY = `# dbt Semantic Models — Quick Reference

## File structure
- \`version: 2\` (required)
- \`semantic_models\` (array): semantic model definitions
- \`metrics\` (array): metric definitions (can be in same file)

## SemanticModel (required: name, model)
- \`name\`: Unique identifier
- \`model\`: dbt ref, e.g. \`ref('my_model')\`
- \`description\`: Human-readable description
- \`defaults.agg_time_dimension\`: Default time dimension for measures
- \`primary_entity\`: Shorthand for primary entity name
- \`entities[]\`: Join keys and identifiers
- \`dimensions[]\`: Grouping attributes
- \`measures[]\`: Aggregatable columns

## Entity (required: name, type)
- \`name\`: Identifier name
- \`type\`: PRIMARY | UNIQUE | FOREIGN | NATURAL
- \`expr\`: SQL expression (defaults to column matching name)

## Dimension (required: name, type)
- \`name\`: Dimension name
- \`type\`: CATEGORICAL | TIME
- \`expr\`: SQL expression
- \`type_params.time_granularity\`: day | week | month | quarter | year (for TIME type)
- \`is_partition\`: Boolean for partitioned tables

## Measure (required: name, agg)
- \`name\`: Unique across ALL semantic models
- \`agg\`: SUM | COUNT | COUNT_DISTINCT | AVERAGE | MIN | MAX | MEDIAN | PERCENTILE | SUM_BOOLEAN
- \`expr\`: SQL expression or column name
- \`description\`: Human-readable description
- \`label\`: Display label for downstream tools
- \`create_metric\`: Boolean — auto-create a simple metric from this measure
- \`non_additive_dimension\`: Dimension to exclude from aggregation
- \`agg_params\`: Extra params (e.g. percentile value)

## Metric (required: name, type)
- \`name\`: Unique identifier
- \`type\`: SIMPLE | DERIVED | CUMULATIVE | CONVERSION | RATIO
- \`label\`: Display name
- \`type_params\`: Varies by type
  - SIMPLE: \`{ measure: measure_name }\`
  - DERIVED: \`{ expr: "...", metrics: [...] }\`
  - CUMULATIVE: \`{ measure: ..., window: ..., grain_to_date: ... }\`
  - RATIO: \`{ numerator: ..., denominator: ... }\`

## Key rules
- Every semantic model needs at least one entity with type PRIMARY
- Measure names must be globally unique across all semantic models
- Time dimensions need type_params.time_granularity
- \`model\` must be a valid dbt ref() or source()
- Metrics reference measures by name
`;

export function handleDbtSpecInfo(args: {
  section?: string;
}): { content: Array<{ type: "text"; text: string }> } {
  const section = args.section ?? "summary";

  switch (section) {
    case "schema":
      return { content: [{ type: "text", text: dbtSchemaJson }] };
    case "example":
      return { content: [{ type: "text", text: EXAMPLE_YAML }] };
    case "summary":
    default:
      return { content: [{ type: "text", text: SPEC_SUMMARY }] };
  }
}
