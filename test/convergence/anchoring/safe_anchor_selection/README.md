# Safe local anchor selection

A local insertion must use an available canonical anchor point. At an already
reserved boundary, it anchors to the end of the insertion using that boundary.
A fragment boundary remains reserved after its occupying insertion is removed.
The removal mask supplies a free end; an unrelated preceding visible Frame
does not identify that reservation.

The regression builds `a b x c`, removes `b`, and replaces `x` with `y`.
The result must be `a y c`, with the replacement anchored at the removal mask's end.
The tests verify the published anchor and indexed values, both locally and
after immediate Gossip delivery with acknowledgement replies.

Another case retains a 102-Frame subtree after removing its original parent.
An insertion at position 8 must stay at position 8 after leaving the cached gate,
rather than follow that subtree. Ordered, reverse, and mixed delivery must
preserve the exact edited values. A separate case checks replacement before
a fully removed whole successor, whose fragment offset is implicit zero.
A head replacement followed by insertion must likewise produce `x y a b`
on both peers, without reusing the removed child's occupied parent boundary.

Replacing `b` in a peer-authored append `a b c d e` must produce `a x c d e`,
not move `x` behind the append's surviving Frames. Removing an original prefix
leaves that insertion's positive zero reservation available when no child has
occupied it. Both Session orders
and an immediate follow-up edit are checked without intervening reads.

After removing a head insertion and appending elsewhere, inserting at the head
must still use the preceding mask's free end. Hydration and the next head edit
must preserve `new head a tail`.

The same rule applies when the synchronized receiver's first visible Frame has
a nonzero original Footage offset after a removal spanning multiple insertions.
Its new head insertion must retain the requested position across hydration.
