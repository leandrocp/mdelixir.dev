import { animateCounterById } from "./counter.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Flatten the build-time highlighted snippet into typeable runs.
 *
 * Lumis wraps each line in a `span.l-line`, joins lines with a newline, and puts
 * each token in a styled `span`, so the nearest styled ancestor of a text node
 * carries that run's colors.
 */
function highlightedTokens(element) {
  const tokens = [];

  function walk(node, style) {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.data) tokens.push({ text: child.data, style });
      } else {
        walk(child, child.getAttribute("style") || style);
      }
    }
  }

  walk(element, "");

  return tokens;
}

function renderToken({ text, style }) {
  const escaped = text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

  if (!style) return escaped;

  return `<span style="${style}">${escaped}</span>`;
}

export function initTypewriter() {
  const titleEl = document.getElementById("hero-title");
  const cursorEl = document.getElementById("hero-cursor");
  const subtitleEl = document.getElementById("hero-subtitle");
  const statsEl = document.getElementById("hero-stats");
  const codeEl = document.getElementById("hero-code");
  const ctaEl = document.getElementById("hero-cta");
  const poweredEl = document.getElementById("hero-powered");

  if (!titleEl) return;

  const text = titleEl.textContent;

  if (prefersReducedMotion) {
    titleEl.textContent = text;
    if (cursorEl) cursorEl.classList.add("opacity-0");
    [subtitleEl, statsEl, codeEl, ctaEl, poweredEl].forEach((el) => {
      if (el) {
        el.classList.remove("opacity-0");
        el.classList.add("animate-fade-in");
      }
    });
    typeCode(true);
    return;
  }

  // Content is visible in the initial HTML; only hide it once animation is ready.
  titleEl.textContent = "";
  [subtitleEl, statsEl, codeEl, ctaEl, poweredEl].forEach((el) => {
    if (el) el.classList.add("opacity-0");
  });
  let charIndex = 0;

  function typeChar() {
    if (charIndex < text.length) {
      titleEl.textContent += text.charAt(charIndex);
      charIndex++;
      const delay = 40 + Math.random() * 40;
      setTimeout(typeChar, delay);
    } else {
      if (cursorEl) cursorEl.classList.add("opacity-0");
      setTimeout(showSubtitle, 200);
    }
  }

  function showSubtitle() {
    if (subtitleEl) {
      subtitleEl.classList.remove("opacity-0");
      subtitleEl.classList.add("animate-fade-in");
    }
    setTimeout(showStats, 200);
  }

  function showStats() {
    if (statsEl) {
      statsEl.classList.remove("opacity-0");
      statsEl.classList.add("animate-slide-up");
      animateCounterById("stat-speed", 395.26, 2000, 2);
      animateCounterById("stat-memory", 2.36, 2000, 2);
    }
    setTimeout(showCode, 300);
  }

  function showCode() {
    if (codeEl) {
      codeEl.classList.remove("opacity-0");
      codeEl.classList.add("animate-slide-up");
      typeCode();
    }
    setTimeout(showCTA, 1000);
  }

  function showCTA() {
    if (ctaEl) {
      ctaEl.classList.remove("opacity-0");
      ctaEl.classList.add("animate-slide-up");
    }
    setTimeout(showPowered, 400);
  }

  function showPowered() {
    if (poweredEl) {
      poweredEl.classList.remove("opacity-0");
      poweredEl.classList.add("animate-fade-in");
    }
  }

  function typeCode(instant) {
    const codeContent = document.getElementById("hero-code-content");
    if (!codeContent) return;

    const tokens = highlightedTokens(codeContent);
    if (tokens.length === 0) return;

    if (instant) {
      codeContent.innerHTML = tokens.map(renderToken).join("");
      return;
    }

    codeContent.textContent = "";
    let tokenIndex = 0;
    let charIndex = 0;
    let typed = "";

    function typeNext() {
      const token = tokens[tokenIndex];

      if (charIndex < token.text.length) {
        charIndex++;
        codeContent.innerHTML =
          typed + renderToken({ ...token, text: token.text.slice(0, charIndex) });
        // A newline lands as a whole run, so pause on it the way a person would.
        const pause = token.text[charIndex - 1] === "\n" ? 300 : 25 + Math.random() * 20;
        setTimeout(typeNext, pause);
        return;
      }

      typed += renderToken(token);
      tokenIndex++;
      charIndex = 0;

      if (tokenIndex < tokens.length) setTimeout(typeNext, 0);
    }

    setTimeout(typeNext, 300);
  }

  setTimeout(typeChar, 600);
}
