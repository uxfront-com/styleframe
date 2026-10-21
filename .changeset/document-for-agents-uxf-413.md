---
"@styleframe/core": patch
"@styleframe/loader": patch
"@styleframe/transpiler": patch
"@styleframe/runtime": patch
"@styleframe/scanner": patch
"@styleframe/theme": patch
"@styleframe/cli": patch
"@styleframe/plugin": patch
"@styleframe/figma": patch
---

Add a `README.md` to each of these packages, so the npm page and the installed package say what the package is, how to install it and where its docs are. Each one links to the new "Using Styleframe with AI agents" page, which covers the `check`, `inspect` and `strict` loop and the mistakes that build without a warning. Until now these packages listed `README.md` in their `files` but shipped none.
