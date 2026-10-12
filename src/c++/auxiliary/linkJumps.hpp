#pragma once
#include "../class.hpp"

namespace sequencer {
/** Replaces a bidirectional jump and detaches conflicting reverse links.
 * @param p Projection whose traversal index changes.
 * @param left Left endpoint in Structural Order.
 * @param right Right endpoint in Structural Order.
 * @param frames Visible Frames crossed, counting the left endpoint but not the right.
 * @param strips Structural steps between endpoints, including hidden Strips.
 */
void link_jumps(Projection &p, Index left, Index right, Word frames, Word strips);
} // namespace sequencer
