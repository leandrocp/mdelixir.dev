import { handleMethods, sendJson } from "./response.js";

export default function handler(request, response) {
  if (!handleMethods(request, response, ["GET", "HEAD"])) return;

  sendJson(request, response, 200, { keys: [] }, { cacheControl: "public, max-age=86400" });
}
