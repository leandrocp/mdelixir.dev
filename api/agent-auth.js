import { handleMethods, sendJson } from "./response.js";

const registration = {
  registration_required: false,
  resource: "https://mdelixir.dev/",
  identity_types_supported: ["anonymous"],
  credential_types_supported: ["none"],
  scope: "public",
  instructions:
    "Access MDEx website content and the read-only MCP server without registering or sending an Authorization header.",
};

export default function handler(request, response) {
  if (!handleMethods(request, response, ["GET", "HEAD", "POST"])) return;

  sendJson(request, response, 200, registration, { cacheControl: "public, max-age=3600" });
}
