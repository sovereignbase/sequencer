# Author-time view equivalence

This test verifies that a replica reconstructs the author's intended text even when the same insertions arrive in a different order.

The author creates:

```text
world
Hello world
Well, Hello world
Well, actually Hello world
Now, Well, actually Hello world
Okay, Now, Well, actually Hello world
```

The two receivers get the same operations in different orders:

```text
Ordered delivery:
world
Hello
Well
actually
Now
Okay

Unordered delivery:
world
Hello
actually
Now
Well
Okay
```

In the unordered delivery, `actually` arrives before `Well`, even though it was authored after `Well`. Its stored anchor must preserve that historical relationship until `Well` is available.

Both delivery orders must therefore resolve to:

```text
Okay, Now, Well, actually Hello world
```
