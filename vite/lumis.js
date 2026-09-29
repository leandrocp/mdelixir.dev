import { createHighlighter } from "@lumis-sh/lumis";
import { htmlMultiThemes } from "@lumis-sh/lumis/formatters";
import { multiThemesPreAttrs, openTag } from "@lumis-sh/lumis/formatters/html";
import plaintext from "@lumis-sh/lumis/langs/plaintext";
import latte from "@lumis-sh/themes/catppuccin_latte";
import macchiato from "@lumis-sh/themes/catppuccin_macchiato";
import lumis from "@lumis-sh/vite";
import bash from "@lumis-sh/wasm-bash";
import elixir from "@lumis-sh/wasm-elixir";
import html from "@lumis-sh/wasm-html";
import json from "@lumis-sh/wasm-json";
import markdown from "@lumis-sh/wasm-markdown";
import xml from "@lumis-sh/wasm-xml";

/**
 * Build-time syntax highlighting with Lumis.
 *
 * Code blocks are written as `<pre><code class="language-LANG">` holding plain
 * (HTML-escaped) source, and `@lumis-sh/vite` highlights them in place, keeping
 * every attribute written on either element. Inline snippets are a `<code
 * data-lumis="LANG">` that is not the first child of a `<pre>`, so the Vite
 * plugin leaves it alone and `lumisInlineCode` highlights it instead.
 * Everything runs in Node during dev and build, so the browser downloads no
 * highlighter and no parsers — it only ever receives finished HTML.
 *
 * Themes are emitted as `light-dark()` values, which follows the site's
 * `prefers-color-scheme` dark mode without any JavaScript.
 */
const THEMES = { light: latte, dark: macchiato };
const DEFAULT_THEME = "light-dark()";

/** The site's own chrome paints code backgrounds; Lumis appends this after the theme's. */
const TRANSPARENT = { style: "background-color: transparent;" };

/**
 * Every language the markup names, loaded before the first highlight.
 *
 * Injected grammars are not listed: Lumis loads them from the installed parser
 * packages while it highlights. That covers `comment` inside Elixir comments and
 * `css` inside HTML, each a devDependency of its own, and `markdown_inline`,
 * which `@lumis-sh/wasm-markdown` brings along. `plaintext` needs no parser.
 */
const LANGUAGES = [bash, elixir, html, json, markdown, plaintext, xml];

const INLINE_CODE = /<code((?:[^>"']|"[^"]*"|'[^']*')*)>([^<]*)<\/code>/g;
const ATTRIBUTE = /([a-zA-Z_:][-\w:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const NAMED_ENTITIES = { lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", amp: "&" };

function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, body) => {
    if (body[0] === "#") {
      const code =
        body[1] === "x" || body[1] === "X"
          ? Number.parseInt(body.slice(2), 16)
          : Number.parseInt(body.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return NAMED_ENTITIES[body] ?? match;
  });
}

function parseAttributes(source) {
  const attributes = {};
  for (const [, name, doubled, singled, bare] of source.matchAll(ATTRIBUTE)) {
    attributes[name.toLowerCase()] = decodeEntities(doubled ?? singled ?? bare ?? "");
  }
  return attributes;
}

function formatter(language, structure) {
  return htmlMultiThemes({
    language,
    themes: THEMES,
    defaultTheme: DEFAULT_THEME,
    preAttrs: TRANSPARENT,
    structure,
  });
}

/**
 * Highlight `<code data-lumis="LANG">` snippets that sit in the page's own markup.
 *
 * The inline structure writes the token spans alone, so the authored `<code>`
 * takes the theme's base color the way a block's `<pre>` would.
 */
function lumisInlineCode() {
  let ready;

  return {
    name: "lumis-inline-code",

    async transformIndexHtml(source) {
      ready ??= createHighlighter({ languages: LANGUAGES });
      const highlighter = await ready;

      return source.replace(INLINE_CODE, (match, attributeSource, rawSource) => {
        const { "data-lumis": language, ...authored } = parseAttributes(attributeSource);
        if (!language) return match;

        const spans = highlighter.highlight(
          decodeEntities(rawSource),
          formatter(language, "inline"),
        );
        const attrs = multiThemesPreAttrs({
          themes: THEMES,
          defaultTheme: DEFAULT_THEME,
          attrs: { ...TRANSPARENT, ...authored },
        });

        return `${openTag("code", attrs)}${spans}</code>`;
      });
    },
  };
}

export function lumisHighlight() {
  return [lumis({ languages: LANGUAGES, formatter }), lumisInlineCode()];
}
