# root subtree redelivery

Reverse and duplicate delivery retains complete causal subtrees through local edits and snapshot hydration.

The fixed history uses an independent array model and a fresh native Session seed. It checks ordered consumer Splices, bulk and indexed reads, bounded reads, duplicate delivery, and both structured-clone and JSON snapshot hydration.

Edit intents and delivery controls are retained in [histories.ts](../../../.helpers/histories.ts); [history.ts](../../../.helpers/history.ts) runs the checks through the public API.
