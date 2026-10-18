# Scripts

Node executes these TypeScript files directly. `npm run typecheck` checks them
alongside the tests and benchmarks.

| Command                    | Script                                 | Purpose                                                                                                                                               |
| -------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build:c++`        | [build-wasm.ts](build-wasm.ts)         | Builds the `wasm-release` CMake preset, installs the module and declarations into `src/typescript/wasm/raw`, and restores synchronous initialization. |
| `npm run docs:c++`         | [build-cpp-docs.ts](build-cpp-docs.ts) | Extracts Doxygen XML and renders the C++ API in `docs/c++` with Breathe and Sphinx. Documentation warnings fail the build.                            |
| `npm run format:c++`       | [format-cpp.ts](format-cpp.ts)         | Formats C++ source files and headers in place using `.clang-format`.                                                                                  |
| `npm run format:check:c++` | [format-cpp.ts](format-cpp.ts)         | Checks C++ formatting without changing files; differences fail with clang-format's exit status.                                                       |

Configure the WASM build with `npm run configure:wasm` before its first build.
It requires an active Emscripten SDK, CMake, and Ninja. Documentation requires
Doxygen and the Python packages in `requirements.txt`; formatting requires
clang-format. Each script preserves the invoked tool's failure status.

The C++ documentation build uses the version in `package.json` for both Doxygen
and Sphinx.

`npm run format` applies Prettier and clang-format. `npm run format:check` checks
both without writing files. The Husky pre-commit hook formats the repository;
the commit-msg hook enforces Conventional Commits through commitlint.

`npm test` uses [run-tests.ts](run-tests.ts) to run Vitest and compatibility
verification before updating the README's test and runtime sections and
`docs/tests/index.html`. The HTML overview uses the same JSON results and links
to the Vitest report in `docs/tests/vitest` and coverage in `docs/tests/coverage`.
Compatibility
runs even when coverage thresholds fail. Individual test commands update their
own results; a run without coverage removes the previous coverage summary.
[compatibility-report.ts](compatibility-report.ts) records Node's structured
test counts and each runtime's passed, failed, or skipped state.

The overview template is [.shared/test-report.html](.shared/test-report.html).
Missing suites appear as unexecuted; runs without coverage do not display old
coverage values. Reports refresh even when verification fails.
