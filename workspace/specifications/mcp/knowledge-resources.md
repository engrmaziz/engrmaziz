# MCP Knowledge Resources (Static vs Dynamic)

## Static Resources
These are resources that rarely change and can be heavily cached by the MCP server or the LLM client.
- `portfolio://skills/*`
- `portfolio://education/*`
- `portfolio://certifications/*`

## Dynamic Resources (Do Not Cache)
These resources contain rapidly evolving state or depend on external APIs (if integrated).
- `portfolio://metrics/current-github-stars` (Future integration)
- `portfolio://availability/current-status` (If linked to a calendar API)

## Prompt Integration
The `assistant-intelligence/` files should NOT be exposed as raw resources. They should be exposed via the MCP `prompts` primitive.
Example: The `cover-letter-framework.md` should be exposed as an MCP Prompt named `generate_cover_letter`, allowing the user to trigger it natively from their client UI.
