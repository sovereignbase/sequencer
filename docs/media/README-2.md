# Three online and three offline editors

Every editor starts from the same retained document:

```text
Project notes.
```

## Online causal chain

Three online editors hand the latest Sequence forward:

```text
Editor 1:
Project notes.
The draft is ready.

Editor 2:
Project notes.
The draft is ready.
Review begins tomorrow.

Editor 3:
Project notes.
The draft is ready.
Review begins tomorrow.
Publication follows Friday.
```

This forms one causal subtree:

```text
The draft is ready.
Review begins tomorrow.
Publication follows Friday.
```

## Independent offline chains

Three other editors retain the original document and work independently without seeing the online changes or each other's edits:

```text
Editor 4:
Project notes.
Add the budget section.
Verify the final numbers.

Editor 5:
Project notes.
Include the customer feedback.
Summarize the responses.

Editor 6:
Project notes.
Update the technical appendix.
Check the diagrams.
```

When all edits are synchronized, the four concurrent branches are ordered deterministically while every causal subtree remains contiguous.

For example:

```text
Project notes.

The draft is ready.
Review begins tomorrow.
Publication follows Friday.

Add the budget section.
Verify the final numbers.

Include the customer feedback.
Summarize the responses.

Update the technical appendix.
Check the diagrams.
```

An arrival order must never interleave independent branches like:

```text
Add the budget section.
Include the customer feedback.
Verify the final numbers.
```

## Offline data arriving during online editing

Offline edits may arrive while the online chain is still progressing, including children arriving before their causal parents:

```text
The draft is ready.

Verify the final numbers.
Add the budget section.

Review begins tomorrow.

Summarize the responses.
Include the customer feedback.

Publication follows Friday.
```

The unresolved children remain pending until their parents arrive. Once every operation is available, the Projection must still resolve to the same document shown above.

The suite also checks chronological delivery, complete reverse delivery, and 10,000 deterministic shuffled arrival orders.

## Mixed lifecycle

The same six-editor topology is repeated with inserts, removals, and replacements.

For example:

```text
Online branch:

The draft is ready.
Temporary note.
↓ remove "Temporary note."

Old review date.
↓ replace with
Review begins tomorrow.


Offline branch 1:

Add the budget section.
Temporary estimate.
↓ remove "Temporary estimate."

Verify the final numbers.


Offline branch 2:

Include the customer feedback.
Old summary.
↓ replace with
Summarize the responses.


Offline branch 3:

Update the technical appendix.
Temporary diagram note.
↓ remove "Temporary diagram note."

Old instruction.
↓ replace with
Check the diagrams.
```

Removed text must remain absent and replacement Footage must remain present. After synchronization, the final Projection is still:

```text
Project notes.

The draft is ready.
Review begins tomorrow.
Publication follows Friday.

Add the budget section.
Verify the final numbers.

Include the customer feedback.
Summarize the responses.

Update the technical appendix.
Check the diagrams.
```

Chronological, reverse, mid-session, and 64 additional deterministic mixed-lifecycle delivery orders must all reconstruct that same Projection.
