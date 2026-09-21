import { handleMethods, sendJson } from "./response.js";

export default function handler(request, response) {
  if (!handleMethods(request, response, ["POST"])) return;

  sendJson(request, response, 400, {
    error: "unsupported_grant_type",
    error_description: "mdelixir.dev is public and does not issue access tokens.",
    auth_documentation: "https://mdelixir.dev/auth.md",
  });
}
