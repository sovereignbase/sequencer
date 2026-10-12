# Bidirectional Mask Gate search

Date: 2026-09-15

Decision: rejected and fully reverted.

## Hypothesis

Walk right and left concurrently and use the first visible neighbor, reducing
the structural work from `right distance + left distance` to the shorter side.

## Result

The focused repeated split-and-replace navigation test failed:

```text
expected value: 30
received value: 513
```

The current candidate-change position cannot derive the absolute position of
an arbitrarily selected left structural neighbor. The existing right-first
preference is semantically significant.

No benchmark result was accepted for this candidate.
