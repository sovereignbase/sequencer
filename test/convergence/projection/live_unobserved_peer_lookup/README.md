# Unobserved live-peer lookup

Two live editors exchange every Gossip update and acknowledgement while repeatedly editing the same document. Neither editor reads the Projection between edits.

For example, the first round repeatedly rewrites the whole document:

```text
Old draft
↓ replace

New draft
↓ remove

(empty)
↓ insert

First version
↓ peer replaces

Final version
```

The second round edits around that surviving text:

```text
Final version
↓ insert at head

Intro note
Final version

↓ replace head

Opening note
Final version

↓ remove head

Final version

↓ insert at tail

Final version
Needs review

↓ peer replaces head

Ready now
Needs review
```

The third round extends and rewrites the middle and tail:

```text
Ready now
Needs review

↓ insert at tail

Ready now
Needs review
Temporary ending

↓ replace middle

Ready now
Publish Friday
Temporary ending

↓ remove tail

Ready now
Publish Friday

↓ insert in middle

Ready now
Review tomorrow
Publish Friday

↓ peer replaces middle

Ready now
Review complete
Publish Friday
```

The fourth round edits the head and middle again:

```text
Ready now
Review complete
Publish Friday

↓ insert at head

Project status
Ready now
Review complete
Publish Friday

↓ replace second block

Project status
Status updated
Review complete
Publish Friday

↓ remove "Review complete"

Project status
Status updated
Publish Friday

↓ insert at head

Final report
Project status
Status updated
Publish Friday

↓ peer replaces "Project status"

Final report
Approved version
Status updated
Publish Friday
```

Throughout all four rounds, neither peer calls `value()`. Their gates and traversal jumps must remain correct solely through `insert`, `replace`, `remove`, and `apply`.

Only after the entire edit history has completed does the test read every Projection position. Both live replicas must expose the same eight Frames:

```text
Final report
Approved version
Status updated
Publish Friday
```

The final Frame is particularly important: a stale gate previously allowed traversal to continue beyond the structural tail at `value(7)`. No Sequence reconstruction is involved; the guarantee applies directly to the continuously running replicas.
