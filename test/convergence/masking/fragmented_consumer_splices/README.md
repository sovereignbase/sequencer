# Fragmented consumer splices

A receiver inserts `X, Y` and `Z` between the original Frames of `a b c d e f`.
An offline author's removal of those original Frames must leave `X, Y, Z` both
in the Projection and in a consumer array updated solely with the returned
`Change` splices.

`apply` and `merge` report separate removals around the surviving insertions.
Each splice uses the view left by preceding splices. Replacement follows the
same rule; overlapping masks omit fragments whose actual removal effect is zero.
