export function setCors(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Accept, Content-Type, MCP-Protocol-Version, MCP-Session-Id",
  );
}

export function handleMethods(request, response, allowedMethods) {
  setCors(response);

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return false;
  }

  if (!allowedMethods.includes(request.method)) {
    response.setHeader("Allow", [...allowedMethods, "OPTIONS"].join(", "));
    response.statusCode = 405;
    response.end();
    return false;
  }

  return true;
}

export function sendJson(request, response, statusCode, body, options = {}) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  if (options.cacheControl) response.setHeader("Cache-Control", options.cacheControl);
  response.statusCode = statusCode;
  response.end(request.method === "HEAD" ? undefined : JSON.stringify(body));
}
