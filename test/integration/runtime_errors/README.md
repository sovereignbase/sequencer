# Runtime errors

Unexpected native and JavaScript failures identify the public Projection call
and preserve the original thrown value as `cause`. Existing Sequencer errors
retain their identity, code and cause. Faults are injected at native exports;
public arguments remain valid.
