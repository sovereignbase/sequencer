# Live scale-down gossip

Two continuously synchronized peers build and edit the same document through repeated inserts, replacements, and removals.

For example, the document may grow through edits such as:

```text
Hello world.

↓ insert

Hello beautiful world.

↓ replace "beautiful" with "quiet"

Hello quiet world.

↓ insert

Today, Hello quiet world.

↓ replace "Hello" with "goodbye"

Today, goodbye quiet world.
```

After this heavily edited state has accumulated replacement Masks and fragmented history, the workload begins scaling the visible document back down while normal edits continue:

```text
Today, goodbye quiet world.

↓ remove "quiet "

Today, goodbye world.

↓ replace "goodbye" with "farewell"

Today, farewell world.

↓ remove "Today, "

farewell world.

↓ remove "farewell "

world.

↓ remove "world."

(empty)
```

Every local edit is delivered immediately to the other peer and every acknowledgement is returned to its author.

After every update, both live peers must expose the same `projectionFrameCount` and resolve identical Footage from every Projection position, including throughout the scale-down after repeated replacements, removals, fragmentation, and retained Masks.
