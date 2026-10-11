# Unordered replace delivery

Two actors begin from the same retained text:

```text
I like green tea
```

They edit it independently.

Actor 0:

```text
I like green tea
I really like green tea
I really like black tea
I like black tea
```

Actor 1:

```text
I like green tea
I prefer green tea
I prefer green hot tea
I prefer hot tea
```

The resulting insert, remove, and replace operations are delivered to fresh replicas chronologically, in reverse, and in a deterministic mixed order.

After all operations have arrived, removed or replaced original text remains absent while every surviving insertion remains present in its deterministic subtree position.

For example:

```text
I prefer black hot tea
```

Every delivery order must expose exactly the same `projectionFrameCount` and return the same Footage from every Projection position.
