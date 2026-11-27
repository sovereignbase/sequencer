# Indexed traversal and checkpoint adjustment, 9 August 2026

These studies measure indexed linked-list traversal in a Wasm Structure of Arrays
layout and the cost of maintaining projection checkpoints after edits.

- Separating traversal links reduces the working set without changing stable
  uint32 indices or adding pointers.
- Interleaving independent walkers overlaps dependent memory loads. Eight walkers
  reached approximately twice single-walker throughput across the measured range;
  wider configurations exposed additional gains and hardware limits.
- Checkpoint-aware adjustment compares complete suffix walks with bounded
  adjustment at a frequency of 128 Strips. A separate study measures the tradeoff
  between indexed reads and checkpoint maintenance.

[details.zip](details.zip) contains all three original studies and their
measurement files, including workload sizes, walker widths, SIMD store results
and limitations. `MANIFEST.sha256` records every file hash.
