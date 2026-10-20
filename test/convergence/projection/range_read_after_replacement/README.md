# range read after replacement

Bounded and indexed reads agree with bulk values after live replacements and restarts.

The fixed history uses an independent array model and a fresh native Session seed. It checks ordered consumer Splices, bulk and indexed reads, bounded reads, duplicate delivery, and both structured-clone and JSON snapshot hydration.

Edit intents and delivery controls are retained in [histories.ts](../../../.helpers/histories.ts); [history.ts](../../../.helpers/history.ts) runs the checks through the public API.
