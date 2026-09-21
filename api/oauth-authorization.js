import { handleMethods, sendJson } from "./response.js";

export default function handler(request, response) {
  if (!handleMethods(request, response, ["GET", "HEAD"])) return;

  sendJson(
    request,
    response,
    400,
    {
      error: "unsupported_response_type",
      error_description:
        "mdelixir.dev is public and does not require an OAuth authorization response.",
      auth_documentation: "https://mdelixir.dev/auth.md",
    },
    { cacheControl: "public, max-age=3600" },
  );
}
