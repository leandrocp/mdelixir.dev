# MDEx auth.md

MDEx is an open-source Elixir library, and mdelixir.dev is its public website. Agents do not need to register a user or obtain a credential to read the site, call its discovery APIs, or connect to its read-only MCP server.

## Audience

These instructions are for agents helping users evaluate, install, or use MDEx.

## Discover

Fetch the public discovery documents:

- Protected Resource Metadata: <https://mdelixir.dev/.well-known/oauth-protected-resource>
- Authorization Server Metadata: <https://mdelixir.dev/.well-known/oauth-authorization-server>
- MCP Server Card: <https://mdelixir.dev/.well-known/mcp/server-card.json>

The supported scope is `public`.

## Register

Registration is not required. The endpoint advertised as `agent_auth.register_uri` is <https://mdelixir.dev/agent/auth>, and `GET`, `HEAD`, and `POST` all return the same read-only descriptor confirming that no account is created and no credential is issued. Do not submit user identity or authentication data.

```http
POST /agent/auth HTTP/1.1
Host: mdelixir.dev
Accept: application/json
```

```json
{
  "registration_required": false,
  "resource": "https://mdelixir.dev/",
  "identity_types_supported": ["anonymous"],
  "credential_types_supported": ["none"],
  "scope": "public"
}
```

The response is not a credential. Do not store it, and do not send an `Authorization` header afterwards.

## Authentication

- Supported identity type: `anonymous`
- Supported credential type: `none`
- Authorization header: not required
- OAuth grants and response types: none
- Public scope: `public`

The OAuth-shaped discovery endpoints exist so agents can determine programmatically that access is anonymous. The authorization and token endpoints do not issue codes or tokens, and the JWKS contains no signing keys.

## Use

Access public resources directly:

```http
GET /index.md HTTP/1.1
Host: mdelixir.dev
```

Useful resources:

- Agent guide: <https://mdelixir.dev/index.md>
- API documentation: <https://mdelixir.dev/api.md>
- MCP endpoint: <https://mdelixir.dev/mcp>
- MDEx documentation: <https://hexdocs.pm/mdex>
- Hex package: <https://hex.pm/packages/mdex>
- Source code: <https://github.com/leandrocp/mdex>

## Claim and revocation

`agent_auth.claim_uri` points back at <https://mdelixir.dev/agent/auth>. There is no claim ceremony: the endpoint completes immediately, issues nothing, and never returns a `user_code` or a verification URL to poll.

Revocation does not apply and no `revocation_uri` is advertised. MDEx does not create an account, session, token, API key, or other credential through this website, so there is nothing to claim or revoke.
