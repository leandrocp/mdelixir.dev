const SECTIONS = {
  overview: { id: "hero", label: "Overview" },
  getting_started: { id: "getting-started", label: "Getting Started" },
  examples: { id: "see-it-in-action", label: "See It In Action" },
  performance: { id: "blazingly-fast", label: "Performance" },
  features: { id: "features", label: "Features" },
  liveview: { id: "phoenix-liveview-ready", label: "Phoenix LiveView" },
  ai_applications: { id: "built-for-ai-applications", label: "AI Applications" },
  comparison: { id: "why-mdex", label: "Why MDEx" },
  testimonials: { id: "what-people-say", label: "Testimonials" },
};

const OUTPUT_FORMATS = ["ast", "html", "heex", "json", "xml", "delta", "slack"];

function whenDomReady() {
  if (document.readyState !== "loading") return Promise.resolve();

  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", resolve, { once: true });
  });
}

export const WEBMCP_TOOLS = [
  {
    name: "navigate_to_mdex_section",
    description:
      "Navigate this page to a main MDEx section. This changes only the current page's URL fragment and scroll position.",
    inputSchema: {
      type: "object",
      properties: {
        section: {
          type: "string",
          description: "The MDEx section to show.",
          enum: Object.keys(SECTIONS),
        },
      },
      required: ["section"],
      additionalProperties: false,
    },
    async execute({ section }) {
      await whenDomReady();

      const destination = SECTIONS[section];
      const element = destination && document.getElementById(destination.id);

      if (!element) {
        throw new Error(`Unknown MDEx section: ${section}`);
      }

      window.history.pushState(null, "", `#${destination.id}`);
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      return {
        section,
        label: destination.label,
        url: window.location.href,
      };
    },
  },
  {
    name: "show_mdex_output_format",
    description:
      "Select an output format in the MDEx example and return the example output currently displayed for that format.",
    inputSchema: {
      type: "object",
      properties: {
        format: {
          type: "string",
          description: "The MDEx output format to display.",
          enum: OUTPUT_FORMATS,
        },
      },
      required: ["format"],
      additionalProperties: false,
    },
    async execute({ format }) {
      await whenDomReady();

      if (!OUTPUT_FORMATS.includes(format)) {
        throw new Error(`Unknown MDEx output format: ${format}`);
      }

      const tab = document.querySelector(`[data-tab="${format}"]`);
      const panel = document.querySelector(`[data-panel="${format}"]`);

      if (!tab || !panel) {
        throw new Error(`MDEx output format is unavailable: ${format}`);
      }

      tab.click();

      return {
        format,
        output: panel.textContent.trim(),
      };
    },
  },
  {
    name: "get_mdex_installation",
    description:
      "Return the MDEx installation snippets shown on this page. This reads the page without changing it.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
    },
    async execute() {
      await whenDomReady();

      const mixButton = document.querySelector('[data-copy="code-mix"]');
      const igniterCommand = document.getElementById("code-igniter");

      if (!mixButton?.dataset.copyText || !igniterCommand) {
        throw new Error("MDEx installation instructions are unavailable");
      }

      return {
        mix: mixButton.dataset.copyText,
        igniter: igniterCommand.textContent.trim(),
      };
    },
  },
];

let registrationController;

export async function initWebMcp() {
  if (registrationController) return;

  const modelContext = document.modelContext ?? navigator.modelContext;
  if (!modelContext) return;

  if (typeof modelContext.registerTool === "function") {
    registrationController = new AbortController();

    try {
      await Promise.all(
        WEBMCP_TOOLS.map((tool) =>
          modelContext.registerTool(tool, { signal: registrationController.signal }),
        ),
      );
      window.addEventListener("pagehide", () => registrationController.abort(), { once: true });
    } catch (error) {
      registrationController.abort();
      registrationController = undefined;
      console.warn("Unable to register WebMCP tools", error);
    }

    return;
  }

  // Compatibility with the original early-preview API.
  if (typeof navigator.modelContext?.provideContext === "function") {
    navigator.modelContext.provideContext({ tools: WEBMCP_TOOLS });
  }
}
