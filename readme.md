rollup-plugin-node-globals
===

Plugin to insert node globals including

- process
- global
- Buffer
- __dirname
- __filename

Plus `process.nextTick` and `process.browser` are optimized to only pull in
themselves and __dirname and __filename point to the file on disk

No options beyond the default plugin ones and a basedir for resolving __dirname and __filename.
