# Tail replace remove

Actor 100 begins with:

```text
The report is ready.
```

and then inserts a four-part branch before that original tail:

```text
Draft complete.
Review finished.
Figures checked.
Approval received.
The report is ready.
```

Actor 101 independently inserts its own concurrent root:

```text
Meeting notes.
```

Actor 100 then replaces the final original sentence:

```text
Draft complete.
Review finished.
Figures checked.
Approval received.
The report is ready.

↓ replace "The report is ready." with "The report is published."

Draft complete.
Review finished.
Figures checked.
Approval received.
The report is published.
```

After that, Actor 100 adds two more head insertions:

```text
Final update.
Executive summary.
Draft complete.
Review finished.
Figures checked.
Approval received.
The report is published.
```

The replacement insertion and its remove share the same stable boundary. The positive replacement must remain paired before the negative remove so the Mask consumes the old:

```text
The report is ready.
```

and never consumes:

```text
The report is published.
```

or Actor 101's concurrent root:

```text
Meeting notes.
```

After all Gossip is integrated, including reconstruction through a restart, the visible Projection must contain exactly the surviving text:

```text
Meeting notes.

Final update.
Executive summary.
Draft complete.
Review finished.
Figures checked.
Approval received.
The report is published.
```

The original `root` is removed, while the replacement, concurrent root, branch content, and later head insertions all remain present.
