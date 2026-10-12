# Experiment 10 — exact jump-cache patching

Date: 2026-09-15

The lifecycle crash was reproduced as a stale jump distance reaching a sentinel.
Updating the nearest post-mutation jump failed the navigation regression
(`expected 179`, received `552`) and was rejected.

Retained solution: visible lookup caches the reciprocal link crossing the edit;
mutation patches it once; a new Strip rewrites its enclosing link from already
measured left/right distances. Mask insertion clears its source patch, and hard
deletion hides footage before post-Mask jump construction.

A temporary validator compared every jump distance with the linked structure
after every operation in 128 split/Mask/replace steps. No mismatch remained.
The validator and logging were removed from production.
