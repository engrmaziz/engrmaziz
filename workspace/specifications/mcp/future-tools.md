# Future MCP Capabilities

While Phase 1 focuses on exposing the static markdown files, future iterations of the MCP Server will introduce active automation.

## 1. Automated Graph Updates
- **Tool:** `update_graph_relationships`
- **Capability:** Allows Claude to actively suggest and write new edges to `knowledge-graph.json` if it discovers a missing semantic link during a conversation.

## 2. Interactive Interview Mode
- **Tool:** `trigger_qualification_webhook`
- **Capability:** Instead of just outputting text, Claude could trigger an MCP tool that pings a Slack channel or CRM (e.g., Salesforce) with the Lead Qualification details extracted from the user chat.

## 3. Real-Time Deployment Verification
- **Tool:** `verify_deployment_status`
- **Capability:** Allows the LLM to curl the `deployed_url` of a project (e.g., AegisFlow) and confirm to the user that "Yes, the server is live and responding in 42ms right now."
