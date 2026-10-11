# Head projection boundary

`head`, `gate`, and `tail` are Projection cursors. Each points to a Strip
containing a visible projected Frame:

- `head` contains the left-most visible Frame at Projection position `0`;
- `gate` contains the currently projected visible Frame;
- `tail` contains the right-most visible Frame at Projection position
  `projectionFrameCount - 1`.

They do not identify Structural Order boundaries. In particular, a mask or a
zero-length fragment cannot be `head` or `tail`.

Removing the first projected Frame leaves reducing Structural Order to the
left of the surviving Footage. `head` must still identify the Strip containing
Projection position zero even when those structural nodes precede it.

The invariant must hold for locally authored, remotely applied, and hydrated
state.
