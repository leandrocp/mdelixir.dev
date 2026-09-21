const catalog = {
  linkset: [
    {
      anchor: "https://mdelixir.dev/",
      "service-desc": [
        {
          href: "https://mdelixir.dev/openapi.json",
          type: "application/json",
        },
      ],
      "service-doc": [
        {
          href: "https://mdelixir.dev/api.md",
          type: "text/markdown",
        },
      ],
      status: [
        {
          href: "https://mdelixir.dev/api/health",
          type: "application/health+json",
        },
      ],
    },
  ],
};

const linkHeader = [
  '<https://mdelixir.dev/>; rel="item"',
  '<https://mdelixir.dev/openapi.json>; rel="service-desc"; type="application/json"',
  '<https://mdelixir.dev/api.md>; rel="service-doc"; type="text/markdown"',
  '<https://mdelixir.dev/api/health>; rel="status"; type="application/health+json"',
].join(", ");

export default function handler(request, response) {
  response.setHeader(
    "Content-Type",
    'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
  );
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  response.setHeader("Link", linkHeader);

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
  response.end(request.method === "HEAD" ? undefined : JSON.stringify(catalog));
}
