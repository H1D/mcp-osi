import YAML from "yaml";

type ToolResult = { content: Array<{ type: "text"; text: string }> };

interface DatasetInput {
  name: string;
  model: string;
  primary_entity?: string;
  description?: string;
}

export function handleDbtScaffold(args: {
  model_name: string;
  description?: string;
  datasets?: DatasetInput[];
  format?: string;
}): ToolResult {
  const format = args.format ?? "yaml";

  const semanticModels = (args.datasets ?? [{ name: args.model_name, model: `ref('${args.model_name}')` }]).map(
    (ds) => ({
      name: ds.name,
      model: ds.model,
      ...(ds.description ? { description: ds.description } : {}),
      defaults: {
        agg_time_dimension: "created_at",
      },
      entities: [
        {
          name: ds.primary_entity ?? "id",
          type: "primary",
        },
      ],
      dimensions: [
        {
          name: "created_at",
          type: "time",
          type_params: {
            time_granularity: "day",
          },
        },
      ],
      measures: [
        {
          name: `${ds.name}_count`,
          description: `Count of ${ds.name} records — replace with actual measures`,
          agg: "count",
          expr: "1",
        },
      ],
    })
  );

  const schema = { version: 2, semantic_models: semanticModels };
  const output = format === "json" ? JSON.stringify(schema, null, 2) : YAML.stringify(schema);

  return { content: [{ type: "text", text: output }] };
}
