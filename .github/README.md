# CI

[ci.yaml](workflows/ci.yaml) runs on pushes and pull requests to `master`.

- Formatting uses Prettier and clang-format 23.1.3. Commitlint validates pushed
  commits and every pull request commit. Pushes commit formatting changes;
  pull requests must already be formatted.
- Tests configure Emscripten 6.0.12, build C++/WASM before TypeScript, and run
  coverage and runtime compatibility. Playwright installs Chromium, Firefox and
  WebKit. LCOV results are uploaded to Codecov.
- Successful push verification runs release-please. A created release rebuilds
  the package, synchronizes the JSR version, and publishes to npm and JSR.

CMake 4.4.4 and Ninja 1.13.2 are pinned in the workflow. Node 24 is selected
after Emscripten setup so the SDK's bundled Node does not replace the test runtime.
JSR publishes the ESM bundle with embedded WASM and its TypeScript declarations.
The publish step allows generated WASM files to differ from the checkout after rebuilding.

GitHub must allow Actions to write commits and create pull requests. Codecov
uses `CODECOV_TOKEN`; npm and JSR publishing require the repository's trusted
publishing links to be configured in those registries.

Local hooks are installed by `npm install` through Husky. Pre-commit runs
`npm run format`; commit-msg runs commitlint with `@commitlint/config-conventional`.
Local C++ formatting requires clang-format on PATH. `HUSKY=0` disables hooks in CI.
