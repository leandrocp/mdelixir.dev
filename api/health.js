const health = {
  status: "pass",
  serviceId: "https://mdelixir.dev/",
  description: "The MDEx website discovery API is available.",
};

export default function handler(request, response) {
  response.setHeader("Content-Type", "application/health+json");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD, OPTIONS");
    response.statusCode = 405;
    response.end();
    return;
  }

  response.statusCode = 200;
  response.end(request.method === "HEAD" ? undefined : JSON.stringify(health));
}
