# Sequencer benchmarks

- [Lifecycle](lifecycle/README.md) measures scaling through continuous growth,
  mutation, immediate gossip and shrinkage.
- [Throughput](throughput/README.md) measures repeated API calls in independent
  bursts at starting sizes of 100, 1,000 and 10,000 Strips.

```powershell
npm run bench
npm run bench:lifecycle
npm run bench:throughput
```

Both default to three runs and produce JSON and Markdown reports under
`benchmark/.results`. `npm run bench` runs lifecycle followed by throughput;
the suite-specific commands run only the selected suite. When both suites use
`--output <path>`, filenames receive `.lifecycle` and `.throughput` suffixes.
Both report calls per second and average latency, with separate memory usage
and disk usage tables. Run `npm run bench -- --help` for shared options.

Default settings are collected at the top of `index.ts`. Command-line options
override them. Shared measurement helpers and types live in `.shared`;
each benchmark keeps its reporting code alongside its workload.
