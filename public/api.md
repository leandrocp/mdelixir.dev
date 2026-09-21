# MDEx discovery API

The MDEx website exposes a small, read-only HTTP API for automated discovery. It describes MDEx and points agents to the project documentation; it does not render Markdown or run the MDEx library remotely.

No registration, API key, OAuth token, or other credential is required.

## Endpoints

- `GET /.well-known/api-catalog` — RFC 9727 API catalog
- `GET /.well-known/agent-skills/index.json` — agent skills index
- `GET /.well-known/ai-catalog.json` — agentic resource discovery manifest
- `GET /.well-known/oauth-protected-resource` — public-access resource metadata
- `GET /.well-known/oauth-authorization-server` — anonymous agent-access metadata
- `GET /.well-known/mcp/server-card.json` — MCP server discovery card
- `GET /index.md` — agent-oriented MDEx guide
- `GET /llms.txt` — concise project index
- `GET /auth.md` — public-access and agent-registration guidance
- `GET /api/health` — discovery API health
- `POST /mcp` — read-only MCP server over Streamable HTTP

The OpenAPI description is available at <https://mdelixir.dev/openapi.json>.
