---
"@styleframe/core": patch
"@styleframe/cli": patch
"@styleframe/plugin": patch
"@styleframe/config-vite": patch
"@styleframe/figma": patch
---

Update the third-party dependencies, which raises some of the ranges you install. The core package now needs `csstype` `^3.2.4`, the CLI needs `magicast` `^0.5.5` and the bundler plugin needs `unplugin` `^3.7.0`. The shared Vite config now expects `vite` `^8.3.8` and `unplugin-dts` `^1.1.2` as peers, so a project on an older Vite sees a peer warning. The Figma plugin's export now skips Easing and Timing variables, which Figma added and Styleframe has no token type for yet, where before it passed them on with a type that nothing reads.
