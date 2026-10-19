# Generative convergence stress

[All suites](../README.md) · [Test](convergence.stress.test.ts)

Fast-check generates two to five independent replicas, mixed insert/remove/replace histories and the native random seed that determines Session ordering. The Worker compares chronological delivery with an independently shuffled order, checking visible length and every indexed Frame. Each scenario has an interruptible execution boundary; replay preserves both edits and Session ordering.

The Worker imports the built package. For a standalone run:

```powershell
npm run build:ts
npm run test:stress
```

| Environment variable       | Purpose                                            | Default                   |
| -------------------------- | -------------------------------------------------- | ------------------------- |
| `SEQUENCER_STRESS_RUNS`    | Generated scenarios.                               | `64`                      |
| `SEQUENCER_STRESS_TIMEOUT` | Per-scenario Worker timeout in milliseconds.       | `1500`                    |
| `SEQUENCER_STRESS_SEED`    | Positive integer seed for reproducible generation. | `0x5e0eace`               |
| `SEQUENCER_STRESS_PATH`    | Fast-check path printed for a failing scenario.    | Unset                     |
| `SEQUENCER_STRESS_SHRINK`  | Set to `true` to minimize a failure.               | Stop on the first failure |

Failures print replay instructions. Preserve an exact expected editing result in the relevant [convergence group](../convergence/README.md) when promoting a discovered scenario into a regression.
