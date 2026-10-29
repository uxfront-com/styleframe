---
title: Figma Plugin - Design Tokens Sync
description: Styleframe is the source of truth for your design tokens. Sync variables between code and Figma using the W3C DTCG format, with full multi-mode support.
---

## Export Styleframe Design Tokens to Figma and Back

Sync your design tokens between Figma and code as W3C DTCG JSON, with a mode for each theme, completely free.

[Install Figma plugin](https://www.figma.com/community/plugin/1597716416772135340/styleframe) · [Read plugin documentation](/docs/getting-started/integrations/figma-plugin)

## The Figma plugin

[Install Figma plugin](https://www.figma.com/community/plugin/1597716416772135340/styleframe)

## A First-Class Token Synchronization Layer

Your code is your source of truth. Export it to the Design Tokens Community Group format, which Figma, Style Dictionary, Tokens Studio and other tools read.

- **Type-Safe Tokens**: Full TypeScript support, with autocomplete, refactoring and compile-time errors that catch token mismatches before production.
- **Multi-Mode by Design**: Light, dark and custom themes are DTCG modifiers, so modes stay explicit.
- **True Bidirectional Sync**: Import DTCG tokens into Figma or export Figma Variables back to JSON, with structure and aliases intact.
- **Free Forever**: No subscription. No seat limits. The CLI and Figma plugin are free and open source. Your design system, your rules.

## Import Design Tokens into Figma

Drop a Styleframe DTCG JSON file into the plugin, preview its variables and modes, and create a Figma variable collection with one click.

![Styleframe - Import Design Tokens into Figma](/assets/images/figma-import.png)

- **Auto-Create Collections**: Each collection gets a mode for Light, Dark and every custom theme in your tokens.
- **Type Validation**: Color, dimension, number and string types are checked before import, and invalid tokens are flagged, not dropped.

## Export Figma Variables to Styleframe

Select a Figma variable collection and export it to the Styleframe W3C DTCG format.

![Styleframe - Export Design Tokens from Figma](/assets/images/figma-export.png)

- **One-Click Export**: The plugin converts types, maps aliases and organizes modes for you.
- **Clipboard Ready**: Copy the JSON to your clipboard, or save it as a file for version control.
- **Reference Syntax**: Variable aliases become DTCG references ({token.path}).

[Learn about DTCG Format](https://www.designtokens.org/)

## Automate with the CLI

Developer Workflow

Export design tokens directly from your Styleframe config. Run in CI/CD pipelines to keep Figma tokens in sync with every code change.

```bash [Terminal]
# Export Styleframe variables to Figma-compatible format
npx styleframe figma export \
        --config styleframe.config.ts \
        --output tokens/ \
        --collection "Design Tokens"

# Output:
# Loading configuration from "styleframe.config.ts"...
# Building DTCG document...
# Flattening to Figma-compatible format...
# Wrote "tokens/Default.tokens.json" (450 tokens)
# Wrote "tokens/Dark.tokens.json" (450 tokens)
# Exported 450 tokens as 2 Figma-compatible mode file(s)
```

- **Git-Integrated Workflow**: Export tokens on every commit, and review token updates in pull requests.
- **CI/CD Ready**: Add the export command to your build pipeline.

[CLI Documentation](/docs/getting-started/tooling/cli#dtcg)

## Sync Design Tokens to Figma in Minutes

Install the Figma plugin, export your Styleframe config, and sync your design tokens. No subscriptions.

[Install Figma plugin](https://www.figma.com/community/plugin/1597716416772135340/styleframe) · [Read plugin documentation](/docs/getting-started/integrations/figma-plugin)
