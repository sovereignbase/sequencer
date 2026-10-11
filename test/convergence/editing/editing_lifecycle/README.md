# Local editing lifecycle

One editor builds a document by inserting Footage at the head, middle, and tail
of the visible Projection:

```text
a b c
a b c d e f
g h i a b c d e f
g h i j k l a b c d e f
g h i j k m n o l a b c d e f
g h i j k m n o l a b c d e f p q r
s t u g h i j k m n o l a b c d e f p q r
```

The editor then replaces the new head, removes it, removes a fragmented range
from the middle, and replaces another range near the tail:

```text
v w x g h i j k m n o l a b c d e f p q r
g h i j k m n o l a b c d e f p q r
g h i j k a b c d e f p q r
g h i j k a b c d e y z q r
```

After every edit, the complete Projection and every indexed Frame must expose
the shown order. Head, middle, and tail edits must therefore remain consistent
even after earlier operations have split the underlying structure into several
Strips and Masks.

Finally, the editor retains the Sequence and reconstructs its Projection. The
reconstructed Projection must preserve the same visible result:

```text
g h i j k a b c d e y z q r
```
