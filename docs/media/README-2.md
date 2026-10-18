# Concurrent replacement delivery

Three replicas begin from the same text:

```text
I like green tea today
```

They edit it independently without exchanging Gossip.

Actor 0:

```text
I like green tea today
I like hot green tea today
We like hot green tea today
They prefer iced black tea today
```

Actor 1:

```text
I like green tea today
Well, actually, I think I like green tea today
Well, actually, I think I prefer green tea today
Well, I think I prefer green tea today
Well, I think I prefer black tea today
```

Actor 2:

```text
I like green tea today
I enjoy green tea today
```

After all Gossip has been delivered, all delivery orders must expose exactly the same Projection: removed or masked text is absent, every insertion that was not removed remains present, and concurrent surviving insertions remain separated into their deterministically ordered subtrees.

For example:

```text
[They prefer iced black]
[Well, I think I prefer black]
[I enjoy]
tea today
```

Here the bracketed ranges represent concurrent surviving subtrees. Their inserted text remains present, while original text masked by the concurrent edits does not reappear.
