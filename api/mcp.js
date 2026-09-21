import { handleMethods, sendJson } from "./response.js";

const SERVER_INFO = { name: "mdelixir.dev", version: "1.0.0" };
const PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26"];

const resources = [
  {
    uri: "https://mdelixir.dev/index.md",
    name: "MDEx agent guide",
    description: "Agent-oriented guidance for evaluating and using MDEx.",
    mimeType: "text/markdown",
  },
  {
    uri: "https://mdelixir.dev/api.md",
    name: "MDEx discovery API",
    description: "Documentation for the public discovery endpoints.",
    mimeType: "text/markdown",
  },
];

const tools = [
  {
    name: "get_mdex_resources",
    description: "Return authoritative MDEx documentation and package links.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "get_mdex_installation",
    description: "Return the current Mix and Igniter installation snippets for MDEx.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
];

const prompts = [
  {
    name: "choose_mdex",
    title: "Evaluate MDEx",
    description: "Create a focused checklist for evaluating MDEx in an Elixir project.",
    arguments: [
      {
        name: "use_case",
        description: "The Markdown rendering or transformation use case.",
        required: false,
      },
    ],
  },
];

function result(id, value) {
  return { jsonrpc: "2.0", id, result: value };
}

function error(id, code, message) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

function handleRequest(message) {
  if (!message || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
    return error(message?.id, -32600, "Invalid Request");
  }

  if (message.id === undefined) return null;

  switch (message.method) {
    case "initialize": {
      const requestedVersion = message.params?.protocolVersion;
      const protocolVersion = PROTOCOL_VERSIONS.includes(requestedVersion)
        ? requestedVersion
        : PROTOCOL_VERSIONS[0];

      return result(message.id, {
        protocolVersion,
        capabilities: {
          tools: { listChanged: false },
          resources: { subscribe: false, listChanged: false },
          prompts: { listChanged: false },
        },
        serverInfo: SERVER_INFO,
        instructions:
          "Use this read-only server to discover MDEx documentation and installation guidance.",
      });
    }
    case "ping":
      return result(message.id, {});
    case "tools/list":
      return result(message.id, { tools });
    case "tools/call":
      if (message.params?.name === "get_mdex_resources") {
        return result(message.id, {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                website: "https://mdelixir.dev/",
                guide: "https://mdelixir.dev/index.md",
                documentation: "https://hexdocs.pm/mdex",
                package: "https://hex.pm/packages/mdex",
                source: "https://github.com/leandrocp/mdex",
              }),
            },
          ],
          structuredContent: {
            website: "https://mdelixir.dev/",
            guide: "https://mdelixir.dev/index.md",
            documentation: "https://hexdocs.pm/mdex",
            package: "https://hex.pm/packages/mdex",
            source: "https://github.com/leandrocp/mdex",
          },
        });
      }
      if (message.params?.name === "get_mdex_installation") {
        return result(message.id, {
          content: [
            {
              type: "text",
              text: 'Add {:mdex, "~> 0.13"} to mix.exs or run mix igniter.install mdex.',
            },
          ],
          structuredContent: {
            mix: '{:mdex, "~> 0.13"}',
            igniter: "mix igniter.install mdex",
          },
        });
      }
      return error(message.id, -32602, `Unknown tool: ${message.params?.name ?? ""}`);
    case "resources/list":
      return result(message.id, { resources });
    case "resources/read": {
      const resource = resources.find(({ uri }) => uri === message.params?.uri);
      if (!resource) return error(message.id, -32602, "Unknown resource URI");

      return result(message.id, {
        contents: [
          {
            uri: resource.uri,
            mimeType: resource.mimeType,
            text: `Fetch the canonical ${resource.name} from ${resource.uri}.`,
          },
        ],
      });
    }
    case "prompts/list":
      return result(message.id, { prompts });
    case "prompts/get":
      if (message.params?.name !== "choose_mdex") {
        return error(message.id, -32602, "Unknown prompt");
      }
      return result(message.id, {
        description: prompts[0].description,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Evaluate MDEx for this Elixir use case: ${message.params?.arguments?.use_case || "Markdown rendering"}. Use the MDEx agent guide and verify version-specific claims against HexDocs.`,
            },
          },
        ],
      });
    default:
      return error(message.id, -32601, "Method not found");
  }
}

export default function handler(request, response) {
  if (!handleMethods(request, response, ["POST"])) return;

  let payload = request.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      sendJson(request, response, 400, error(null, -32700, "Parse error"));
      return;
    }
  }

  if (Array.isArray(payload)) {
    if (payload.length === 0) {
      sendJson(request, response, 400, error(null, -32600, "Invalid Request"));
      return;
    }

    const replies = payload.map(handleRequest).filter(Boolean);
    if (replies.length === 0) {
      response.statusCode = 202;
      response.end();
      return;
    }

    sendJson(request, response, 200, replies);
    return;
  }

  const reply = handleRequest(payload);
  if (!reply) {
    response.statusCode = 202;
    response.end();
    return;
  }

  sendJson(request, response, 200, reply);
}
