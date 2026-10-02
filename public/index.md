---
title: MDEx - Markdown for Elixir
url: https://mdelixir.dev/index.md
description: MDEx capabilities, installation, examples, and documentation links.
---

# MDEx

> An extensible Markdown library for Elixir with Phoenix LiveView integration.

MDEx is a fast, extensible Markdown library for Elixir powered by a Rust parser. It supports Markdown parsing, rendering, document transformation, and LiveView output.

## Capabilities

- Phoenix LiveView rendering via the `~MD` sigil with the `HEEX` modifier.
- Incremental processing of incomplete Markdown fragments for streaming interfaces.
- AST, HTML, HEEx, JSON, XML, Quill Delta, Slack mrkdwn, and Markdown output.
- AST traversal and transformation through `MDEx.Document`.
- Plugins and syntax highlighting with Lumis or Syntect.
- Raw HTML is omitted by default, with opt-in escaping, sanitization, or unsafe rendering.
- A native layer using Comrak for parsing, Ammonia for sanitization, and Lumis for syntax highlighting.

## Install

```elixir
def deps do
  [
    {:mdex, "~> 0.12"}
  ]
end
```

```bash
mix igniter.install mdex
```

## Quick Example

```elixir
html = MDEx.to_html!("# Hello from MDEx")

rendered = ~MD"""
# Welcome, {@user.name}

<.badge>#{@plan}</.badge>
"""HEEX
```

## Primary Links

- Docs: https://hexdocs.pm/mdex
- Getting Started: https://hexdocs.pm/mdex/MDEx.html#module-installation
- Phoenix LiveView: https://hexdocs.pm/mdex/phoenix_live_view_heex.html
- Streaming: https://hexdocs.pm/mdex/streaming.html
- Syntax Highlighting: https://hexdocs.pm/mdex/syntax_highlight.html
- Plugins: https://hexdocs.pm/mdex/plugins.html
- Safety: https://hexdocs.pm/mdex/safety.html
- API Reference: https://hexdocs.pm/mdex/MDEx.html
- Hex package: https://hex.pm/packages/mdex
- GitHub: https://github.com/leandrocp/mdex

## Agent Resources

- [Documentation index](https://mdelixir.dev/llms.txt)
- [Discovery API and MCP](https://mdelixir.dev/api.md)
- [Anonymous access](https://mdelixir.dev/auth.md)
