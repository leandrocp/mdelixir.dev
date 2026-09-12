import { createHighlighter } from "@lumis-sh/lumis";
import { htmlMultiThemes } from "@lumis-sh/lumis/formatters";
import bash from "@lumis-sh/lumis/langs/bash";
import comment from "@lumis-sh/lumis/langs/comment";
import css from "@lumis-sh/lumis/langs/css";
import elixir from "@lumis-sh/lumis/langs/elixir";
import html from "@lumis-sh/lumis/langs/html";
import json from "@lumis-sh/lumis/langs/json";
import markdown from "@lumis-sh/lumis/langs/markdown";
import markdownInline from "@lumis-sh/lumis/langs/markdown_inline";
import plaintext from "@lumis-sh/lumis/langs/plaintext";
import xml from "@lumis-sh/lumis/langs/xml";
import latte from "@lumis-sh/themes/catppuccin_latte";
import macchiato from "@lumis-sh/themes/catppuccin_macchiato";

/**
 * Build-time syntax highlighting with Lumis.
 *
 * Any `<pre data-lumis="LANG">` or `<code data-lumis="LANG">` in index.html holds
 * plain (HTML-escaped) source. This plugin replaces its contents with highlighted
 * markup, keeping every attribute the author wrote on the element. Highlighting
 * runs in Node during dev and build, so the browser downloads no highlighter and
 * no parsers — it only ever receives finished HTML.
 *
 * Themes are emitted as `light-dark()` values, which follows the site's
 * `prefers-color-scheme` dark mode without any JavaScript.
 */
const THEMES = { light: latte, dark: macchiato };

/**
 * Every language the page needs, loaded before the first highlight.
 *
 * Three are never named by a `data-lumis` attribute and are only ever reached as
 * an injected grammar: `markdown_inline` inside the markdown sample, `comment`
 * inside Elixir comments, and `css` inside HTML. Each language here except
 * `plaintext`, which needs no parser, has a matching `@lumis-sh/wasm-*`
 * devDependency, so a build resolves every parser from `node_modules` and never
 * reaches for the CDN.
 */
const LANGUAGES = [
  bash,
  comment,
  css,
  elixir,
  html,
  json,
  markdown,
  markdownInline,
  plaintext,
  xml,
];

/** Marks a snippet that stays on one line, so the line wrapper must not be a block. */
const INLINE_CLASS = "lumis-inline";

const PRE_ELEMENT = /<pre((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/pre>/g;
const CODE_ELEMENT = /<code((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/code>/g;
const ATTRIBUTE = /([a-zA-Z_:][-\w:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const LUMIS_OUTPUT = /^<pre([^>]*)><code([^>]*)>([\s\S]*)<\/code><\/pre>$/;

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
  const attributes = new Map();
  for (const [, name, doubled, singled, bare] of source.matchAll(ATTRIBUTE)) {
    attributes.set(name.toLowerCase(), doubled ?? singled ?? bare ?? "");
  }
  return attributes;
}

function serializeAttributes(attributes) {
  return Array.from(attributes, ([name, value]) =>
    value === "" ? ` ${name}` : ` ${name}="${value.replaceAll('"', "&quot;")}"`,
  ).join("");
}

/** The site's own chrome paints code-block backgrounds, so drop the theme's. */
function withoutBackground(style) {
  return style
    .split(";")
    .map((declaration) => declaration.trim())
    .filter((declaration) => declaration && !/^background-color\s*:/.test(declaration))
    .join("; ");
}

function mergeClasses(...values) {
  const classes = new Set();
  for (const value of values) {
    for (const name of (value ?? "").split(/\s+/)) if (name) classes.add(name);
  }
  return Array.from(classes).join(" ");
}

/** Fold author attributes onto the ones Lumis generated; `class` unions, others win. */
function merge(generated, authored) {
  const merged = new Map(generated);
  for (const [name, value] of authored) {
    merged.set(name, name === "class" ? mergeClasses(merged.get(name), value) : value);
  }
  return merged;
}

export function lumisHighlight() {
  let highlighter;
  let loading;

  /** One highlighter for the whole process, with every parser already loaded. */
  async function ready() {
    loading ??= createHighlighter({ languages: LANGUAGES }).then((created) => {
      highlighter = created;
    });
    await loading;
  }

  function highlightBlock(source, language) {
    const output = highlighter.highlight(
      source,
      htmlMultiThemes({ language, themes: THEMES, defaultTheme: "light-dark()" }),
    );

    const parsed = output.match(LUMIS_OUTPUT);
    if (!parsed) throw new Error(`Unexpected Lumis output for language "${language}"`);

    const [, preAttributes, codeAttributes, inner] = parsed;
    const pre = parseAttributes(preAttributes);
    pre.set("style", withoutBackground(pre.get("style") ?? ""));

    return { pre, code: parseAttributes(codeAttributes), inner };
  }

  function replaceBlocks(source, pattern, tag) {
    return source.replace(pattern, (match, attributeSource, rawSource) => {
      if (!attributeSource.includes("data-lumis")) return match;

      const authored = parseAttributes(attributeSource);
      const language = authored.get("data-lumis");
      const codeId = authored.get("data-lumis-code-id");
      authored.delete("data-lumis");
      authored.delete("data-lumis-code-id");

      const { pre, code, inner } = highlightBlock(decodeEntities(rawSource), language);

      if (tag === "pre") {
        if (codeId) code.set("id", codeId);
        return `<pre${serializeAttributes(merge(pre, authored))}><code${serializeAttributes(code)}>${inner}</code></pre>`;
      }

      // No `<pre>` wrapper of our own: carry the theme's base color and stay on one line.
      code.set("style", pre.get("style"));
      code.set("class", mergeClasses(code.get("class"), "lumis", INLINE_CLASS));
      return `<code${serializeAttributes(merge(code, authored))}>${inner}</code>`;
    });
  }

  return {
    name: "lumis-highlight",

    // Pay the parser load once, before any HTML is transformed.
    buildStart: ready,
    configureServer: ready,

    async transformIndexHtml(source) {
      await ready();

      // `<pre>` first, since one may wrap a `<code data-lumis>` that the second
      // pass then finds. Generated `<code>` elements carry no `data-lumis`, so
      // the second pass leaves them alone.
      return replaceBlocks(replaceBlocks(source, PRE_ELEMENT, "pre"), CODE_ELEMENT, "code");
    },
  };
}
