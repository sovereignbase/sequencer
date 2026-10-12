#pragma once
#include "components/ContainmentTable/class.hpp"
#include "components/FrontierTable/class.hpp"
#include "components/PendingTable/class.hpp"
#include <cmath>
#include <stdexcept>

namespace sequencer {
class Projection {
public:
  const Word actor;
  Strips strips;
  Index structural_head{}, head{}, tail{}, gate{};
  Word structural_count{}, frame_count{}, gate_position{};
  Index left_jump_to_patch{}, right_jump_to_patch{};
  Index last_insert{};
  std::array<Word, 2> increase_clock, decrease_clock;
  ContainmentTable containment;
  PendingTable pending;
  FrontierTable frontier;
  std::vector<Span> released;
  std::vector<ContentAppend> appended;

  Projection(Word actor_id, Word increasing_session, Word decreasing_session)
      : actor(actor_id), increase_clock{increasing_session, 0},
        decrease_clock{decreasing_session, 0} {}
  Index allocate(Insertion i) { return strips.append(i); }
  Word length() const { return frame_count; }
  void insert_first(Index i);
  Index split_strip(Index anchor, Word point, std::int32_t incoming_diff);
  Index subtree_end(Index root);
  std::pair<Word, Index> find_containing_fragment(Index origin, Index incoming);
  std::int32_t anchor_strip(Index incoming, Index anchor, Word point, bool continuation = false);
  Word find_frame(Word position, bool for_insertion = false);
  Word position_of(Index strip, std::int32_t gate_diff = 0);
  void patch_jumps(std::int32_t frame_diff, Word strip_diff, Index incoming);
  std::pair<Word, Index> select_anchor(Word position);
  Gossip insert(Word count, Word content, Word at);
  Word extend(Index origin, Word count, Word content, Word source_start = 0);
  Gossip remove(Word start, std::int64_t end);
  Gossip replace(Word count, Word content, Word start, std::int64_t end);
  Result apply(const Gossip &gossip);
  void hydrate(const Gossip &insertions, const std::vector<Acknowledgement> &frontiers);
  Result merge(const Gossip &insertions, const std::vector<Acknowledgement> &frontiers);
  std::vector<Span> values(Word start, Word end);
  Sequence sequence() const;
};
} // namespace sequencer
