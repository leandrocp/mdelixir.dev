import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import agentAuthHandler from "../api/agent-auth.js";
import mcpHandler from "../api/mcp.js";
import oauthAuthorizationHandler from "../api/oauth-authorization.js";
import oauthJwksHandler from "../api/oauth-jwks.js";
import oauthTokenHandler from "../api/oauth-token.js";

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
}

function invoke(handler, method, body) {
  const headers = new Map();
  let responseBody;
  const response = {
    statusCode: undefined,
    setHeader(name, value) {
      headers.set(name.toLowerCase(), value);
    },
    end(value) {
      responseBody = value;
    },
  };

  handler({ method, body }, response);

  return {
    status: response.statusCode,
    headers,
    body: responseBody === undefined ? undefined : JSON.parse(responseBody),
  };
}

test("OAuth metadata consistently describes anonymous access", async () => {
  const authorizationServer = await readJson("../public/.well-known/oauth-authorization-server");
  const protectedResource = await readJson("../public/.well-known/oauth-protected-resource");

  assert.equal(authorizationServer.issuer, protectedResource.authorization_servers[0]);
  assert.deepEqual(authorizationServer.grant_types_supported, []);
  assert.deepEqual(authorizationServer.response_types_supported, []);
  assert.equal(authorizationServer.agent_auth.skill, "https://mdelixir.dev/auth.md");
  assert.deepEqual(authorizationServer.agent_auth.identity_types_supported, ["anonymous"]);
  assert.deepEqual(authorizationServer.agent_auth.credential_types_supported, ["none"]);
  assert.deepEqual(authorizationServer.agent_auth.anonymous.credential_types_supported, ["none"]);
  assert.equal(authorizationServer.agent_auth.register_uri, "https://mdelixir.dev/agent/auth");
  // Scanners read claim_uri from agent_auth itself, so advertise it there and under anonymous.
  assert.equal(authorizationServer.agent_auth.claim_uri, "https://mdelixir.dev/agent/auth");
  assert.equal(
    authorizationServer.agent_auth.anonymous.claim_uri,
    authorizationServer.agent_auth.claim_uri,
  );
  assert.deepEqual(protectedResource.scopes_supported, ["public"]);
  assert.ok(protectedResource.bearer_methods_supported.includes("header"));
});

test("MCP Server Card covers the current schema and scanner discovery fields", async () => {
  const card = await readJson("../public/.well-known/mcp/server-card.json");

  assert.equal(
    card.$schema,
    "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
  );
  assert.equal(card.name, "dev.mdelixir/mdex");
  assert.equal(card.serverInfo.name, "mdelixir.dev");
  assert.equal(card.transport.endpoint, "https://mdelixir.dev/mcp");
  assert.deepEqual(card.capabilities, { tools: true, resources: true, prompts: true });
  assert.equal(card.remotes[0].url, card.transport.endpoint);
});

test("anonymous registration and OAuth endpoints state that credentials are unnecessary", () => {
  const registration = invoke(agentAuthHandler, "POST", {});
  const authorization = invoke(oauthAuthorizationHandler, "GET");
  const token = invoke(oauthTokenHandler, "POST", {});
  const jwks = invoke(oauthJwksHandler, "GET");

  assert.equal(registration.status, 200);
  assert.equal(registration.body.registration_required, false);
  assert.deepEqual(registration.body.credential_types_supported, ["none"]);
  assert.equal(authorization.status, 400);
  assert.equal(authorization.body.error, "unsupported_response_type");
  assert.equal(token.status, 400);
  assert.equal(token.body.error, "unsupported_grant_type");
  assert.deepEqual(jwks.body, { keys: [] });
});

test("MCP endpoint initializes and exposes each advertised capability", () => {
  const initialize = invoke(mcpHandler, "POST", {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: {} },
  });
  const tools = invoke(mcpHandler, "POST", {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
  });
  const resources = invoke(mcpHandler, "POST", {
    jsonrpc: "2.0",
    id: 3,
    method: "resources/list",
  });
  const prompts = invoke(mcpHandler, "POST", {
    jsonrpc: "2.0",
    id: 4,
    method: "prompts/list",
  });

  assert.equal(initialize.status, 200);
  assert.equal(initialize.body.result.protocolVersion, "2025-06-18");
  assert.equal(initialize.body.result.serverInfo.name, "mdelixir.dev");
  assert.ok(initialize.body.result.capabilities.tools);
  assert.ok(initialize.body.result.capabilities.resources);
  assert.ok(initialize.body.result.capabilities.prompts);
  assert.ok(tools.body.result.tools.length > 0);
  assert.ok(resources.body.result.resources.length > 0);
  assert.ok(prompts.body.result.prompts.length > 0);
});

test("MCP endpoint accepts notifications without inventing a response", () => {
  const notification = invoke(mcpHandler, "POST", {
    jsonrpc: "2.0",
    method: "notifications/initialized",
  });

  assert.equal(notification.status, 202);
  assert.equal(notification.body, undefined);
});

test("Vercel routes every advertised dynamic endpoint", async () => {
  const configuration = await readJson("../vercel.json");
  const routes = new Map(
    configuration.rewrites.map(({ source, destination }) => [source, destination]),
  );

  assert.equal(routes.get("/oauth/authorize"), "/api/oauth-authorization");
  assert.equal(routes.get("/oauth/token"), "/api/oauth-token");
  assert.equal(routes.get("/oauth/jwks"), "/api/oauth-jwks");
  assert.equal(routes.get("/agent/auth"), "/api/agent-auth");
  assert.equal(routes.get("/mcp"), "/api/mcp");
});
