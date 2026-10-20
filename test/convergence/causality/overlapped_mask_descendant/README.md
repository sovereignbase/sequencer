# overlapped mask descendant

A child anchored to the authored end of an overlapping mask remains replayable when only part of that mask consumes Frames.

The fixed history uses an independent array model and a fresh native Session seed. It checks ordered consumer Splices, bulk and indexed reads, bounded reads, duplicate delivery, and both structured-clone and JSON snapshot hydration.

Edit intents and delivery controls are retained in [histories.ts](../../../.helpers/histories.ts); [history.ts](../../../.helpers/history.ts) runs the checks through the public API.
