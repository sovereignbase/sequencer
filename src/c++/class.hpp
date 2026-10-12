#pragma once
#include "components/ContainmentTable/class.hpp"
#include "components/FrontierTable/class.hpp"
#include "components/PendingTable/class.hpp"
#include <cmath>
#include <span>
#include <stdexcept>

namespace sequencer {
/** Visible Projection of a replicated Sequence. */
class Projection {
public:
  /** Actor identifier used in Acknowledgements. */
  const Word actor;
  /** Indexed Strip arena; index zero is the absent-link sentinel. */
  Strips strips;
  Index structural_head{} /**< First Strip in Structural Order, including hidden history. */,
      head{} /**< Strip owning the first visible Frame. */,
      tail{} /**< Strip owning the last visible Frame. */,
      gate{} /**< Retained local lookup Strip, possibly a hidden insertion boundary. */;
  Word structural_count{} /**< Linked Strip count, including fragments and masks. */,
      frame_count{} /**< Visible positive Frame count. */,
      gate_position{} /**< Visible position at the gate Strip's first Frame or boundary. */;
  Index left_jump_to_patch{} /**< Left endpoint of the jump spanning the next local edit. */,
      right_jump_to_patch{} /**< Right endpoint of that same jump. */;
  /** Last locally authored positive root eligible for an intact extension. */
  Index last_insert{};
  /** Independent positive and reducing clocks, each stored as [Session, next time]. */
  std::array<Word, 2> increase_clock, decrease_clock;
  /** Canonical Insertion identity to materialized root. */
  ContainmentTable containment;
  /** Unresolved Insertions grouped by their missing canonical parent. */
  PendingTable pending;
  /** Actor membership and Acknowledgements used only by export compaction. */
  FrontierTable frontier;
  /** Deferred Footage releases; count zero releases the entire binding. */
  std::vector<Span> released;
  /** Deferred suffix appends joining content under an existing Insertion binding. */
  std::vector<ContentAppend> appended;
  /** Deferred copy-on-write slices protecting caller arrays and retained snapshots. */
  std::vector<Span> copied;

  /** Initializes empty history with independently supplied Session identities.
   * @param actor_id Acknowledging Actor.
   * @param increasing_session Session for locally authored positive Insertions.
   * @param decreasing_session Session for locally authored reducing Insertions.
   */
  Projection(Word actor_id, Word increasing_session, Word decreasing_session)
      : actor(actor_id), increase_clock{increasing_session, 0},
        decrease_clock{decreasing_session, 0} {}
  /** Allocates an unlinked Strip; linking, counts and containment are separate.
   * @param i Canonical coordinates and JavaScript binding reference.
   * @return Stable arena index.
   */
  Index allocate(Insertion i) { return strips.append(i); }
  /** Reads visible length without structural traversal.
   * @return Maintained visible Frame count.
   */
  Word length() const { return frame_count; }
  /** Initializes structural and visible endpoints for the first root.
   * @param i Unlinked root Strip in an empty Structural Order.
   */
  void insert_first(Index i);
  /** Splits materialization without changing canonical Insertion coordinates.
   * @param anchor Strip containing the logical boundary.
   * @param point Original Frame boundary, relative to its canonical Insertion.
   * @param incoming_diff Incoming visible effect; negative values consume the right prefix.
   * @return Structural successor at the new boundary.
   */
  Index split_strip(Index anchor, Word point, std::int32_t incoming_diff);
  /** Finds a competitor's final descendant so sibling subtrees stay contiguous.
   * @param root First Strip of the causal subtree.
   * @return Last Strip belonging to that subtree.
   */
  Index subtree_end(Index root);
  /** Resolves a historical anchor through fragments and already consumed Frames.
   * @param origin Canonical parent root, or a known fragment from which to continue.
   * @param incoming Incoming Strip whose mask effect may be shortened by overlap.
   * @return Resolved logical boundary and its current owning Strip.
   */
  std::pair<Word, Index> find_containing_fragment(Index origin, Index incoming);
  /** Places a Strip in deterministic Structural Order and materializes mask continuations.
   * @param incoming Unlinked Strip to place.
   * @param anchor Current owner of the logical boundary; none for the virtual root.
   * @param point Boundary relative to the owning Insertion or mask.
   * @param continuation Whether this is an existing positive Insertion's extension fragment.
   * @return Actual signed visible effect across all materialized fragments.
   */
  std::int32_t anchor_strip(Index incoming, Index anchor, Word point, bool continuation = false);
  /** Resolves a visible position and retains the owning Strip as gate.
   * @param position Visible Frame position, or insertion boundary when requested.
   * @param for_insertion Whether logical boundaries may resolve through hidden history.
   * @return Original Frame coordinate within the gate Insertion.
   */
  Word find_frame(Word position, bool for_insertion = false);
  /** Locates a newly linked Strip relative to the retained local gate.
   * @param strip Strip whose visible start is required.
   * @param gate_diff Effect already applied before the retained gate boundary.
   * @return Visible Projection position of the Strip's boundary.
   */
  Word position_of(Index strip, std::int32_t gate_diff = 0);
  /** Updates and, when necessary, splits the jump spanning a local edit.
   * @param frame_diff Signed change to visible distance.
   * @param strip_diff Added structural Strip count.
   * @param incoming Strip marking the edit boundary.
   */
  void patch_jumps(std::int32_t frame_diff, Word strip_diff, Index incoming);
  /** Translates a visible insertion boundary into a replayable logical anchor.
   * @param position Insertion boundary in 0..frame_count.
   * @return Logical point and its anchoring Strip.
   */
  std::pair<Word, Index> select_anchor(Word position);
  /** Authors positive Frames, extending only an eligible local Insertion.
   * @param count Positive Footage length.
   * @param content JavaScript binding token; native code never reads the values.
   * @param at Visible insertion boundary.
   * @return Canonical Gossip operation, including only the suffix for an extension.
   */
  Insertion insert(Word count, Word content, Word at);
  /** Appends a contiguous logical suffix while respecting remote fragmentation.
   * @param origin Existing positive canonical root.
   * @param count Number of newly visible Frames.
   * @param content Binding carrying the incoming suffix.
   * @param source_start Offset of that suffix in its source Footage.
   * @return Visible start of the added suffix.
   */
  Word extend(Index origin, Word count, Word content, Word source_start = 0);
  /** Requests private Footage before clearing externally owned content slots.
   * @param fragment Any fragment of the positive canonical Insertion.
   */
  void own_content(Index fragment);
  /** Authors masks for each original Insertion crossed by an inclusive visible range.
   * @param start First removed Projection position.
   * @param end Last removed position; start greater than end represents an empty range.
   * @return Reducing Insertions followed by the local removal Acknowledgement.
   */
  Gossip remove(Word start, std::int64_t end);
  /** Authors removal, then insertion against the resulting visible boundary.
   * @param count Replacement Frame count; zero means removal only.
   * @param content Replacement Footage binding.
   * @param start First replaced Projection position.
   * @param end Last replaced position, inclusive.
   * @return Gossip preserving removal-before-insertion order.
   */
  Gossip replace(Word count, Word content, Word start, std::int64_t end);
  /** Integrates canonical operations and releases newly satisfied dependencies.
   * @param gossip Already read native entries; transport validation occurs at the ABI.
   * @return Ordered visible Splices and Gossip containing Acknowledgements.
   */
  Result apply(std::span<const Entry> gossip);
  /** Integrates operations into retained output storage without clearing existing results.
   * @param gossip Already read native entries.
   * @param result Output to append to, allowing one Result across an entire ABI batch.
   */
  void apply(std::span<const Entry> gossip, Result &result);
  /** Reconstructs trusted exported history and prebuilds traversal jumps.
   * @param insertions Canonical Insertions in dependency-compatible Structural Order.
   * @param frontiers Retained Actor Acknowledgements.
   */
  void hydrate(const Gossip &insertions, const std::vector<Acknowledgement> &frontiers);
  /** Integrates snapshot history and then observes its retained Acknowledgements.
   * @param insertions Canonical snapshot Insertions.
   * @param frontiers Snapshot Acknowledgements.
   * @return Visible Splices and Gossip containing Acknowledgements for newly integrated history.
   */
  Result merge(const Gossip &insertions, const std::vector<Acknowledgement> &frontiers);
  /** Resolves an inclusive visible range to JavaScript Footage spans.
   * @param start First included Projection position.
   * @param end Last included position.
   * @return Ordered positive spans; masks contribute no values.
   */
  std::vector<Span> values(Word start, Word end);
  /** Reuses output capacity while resolving an inclusive visible range.
   * @param start First included Projection position.
   * @param end Last included position.
   * @param output Span vector cleared and repopulated by this call.
   */
  void values(Word start, Word end, std::vector<Span> &output);
  /** Exports equivalent retained state without rewriting live history.
   * @return Snapshot with acknowledgement-gated removal compaction.
   */
  Sequence sequence() const;
};
} // namespace sequencer
