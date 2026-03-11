# mcp-osi

MCP server for generating and validating semantic models against [OSI](https://open-semantic-interchange.org/) and [dbt](https://docs.getdbt.com/docs/build/semantic-models) specs.

Schemas are fetched from upstream repos on startup — always validates against the latest spec.

## Tools

| Tool | Description |
|------|-------------|
| `validate_osi_schema` | Validate YAML/JSON against OSI spec |
| `scaffold_osi_schema` | Generate OSI schema skeleton |
| `get_osi_spec_reference` | Get OSI spec summary, JSON Schema, or example |
| `validate_dbt_semantic_model` | Validate YAML/JSON against dbt spec |
| `scaffold_dbt_semantic_model` | Generate dbt semantic model skeleton |
| `get_dbt_spec_reference` | Get dbt spec summary, JSON Schema, or example |

## Setup — Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "OSI": {
      "command": "npx",
      "args": ["-y", "github:H1D/mcp-osi"]
    }
  }
}
```

Restart Claude Desktop.

## Setup — Claude Code

```bash
claude mcp add osi npx -y github:H1D/mcp-osi
```

## Local development

```bash
git clone git@github.com:H1D/mcp-osi.git
cd mcp-osi
npm install
npm run dev
```
