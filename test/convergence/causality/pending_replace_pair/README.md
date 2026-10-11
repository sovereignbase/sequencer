# Pending replace pair

An editor first writes:

```text
Draft
```

and immediately replaces it:

```text
Draft
↓ replace with "Final"

Final
```

The replacement Gossip contains the two operations that form the replace:

```text
remove "Draft"
insert "Final"
```

One receiver gets the edits in normal causal order:

```text
"Draft" arrives
↓
Draft

replace arrives
↓
Final
```

Another receiver gets the replace Gossip before the original `"Draft"` insertion exists locally:

```text
replace "Draft" with "Final" arrives

(empty)
```

Both entries of the replace remain pending because their causal parent is still missing.

When the delayed parent finally arrives:

```text
"Draft" arrives
↓
apply pending remove
↓
apply pending replacement insertion

Final
```

Pending processing must preserve the original internal order:

```text
remove "Draft"
↓
insert "Final"
```

It must not accidentally process the pair in reverse:

```text
insert "Final"
↓
remove
```

Both the ordered and pending receivers must therefore finish with exactly one projected Frame:

```text
Final
```

This verifies that pending processing preserves the atomic Remove → replacement Insert relationship even when the entire replace reaches a receiver before its causal parent.
