# Position-directed Mask Gate search

Date: 2026-09-15

Decision: rejected and fully reverted.

## Hypothesis

When Mask change position equals the new Projection length, search only left;
otherwise search only right.

## Result

The focused repeated split-and-replace navigation test failed:

```text
expected value: 30
received value: 513
```

The first visible change position is not always the Mask's structural boundary
inside concurrent fragment trees. Convergence and stress passed, demonstrating
why the separate navigation invariant is necessary.

No benchmark result was accepted for this candidate.
