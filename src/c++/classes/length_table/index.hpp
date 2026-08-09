/**
 * @file
 * @brief Defines the fixed-frequency index for bounded Projection traversal.
 *
 * LengthTable stores one dense Projector Strip index for every 128 Projection
 * positions. Reads begin at the nearest checkpoint and follow the Projector's
 * compact `left` or `right` link vector for at most 64 positions. Structural
 * edits update the table in complete 128-position intervals and propagate only
 * the remaining sub-interval displacement through the existing suffix.
 */
#pragma once
#include "../../declarations/projector/index.hpp"
#include <cstdint>
#include <utility>
#include <vector>

/**
 * @brief Periodic dense-index entry points into one Projector Projection.
 *
 * Checkpoint `i` identifies the Strip at Projection position `i * 128`. The
 * table contains no independent ordering information: every stored value is an
 * index into Projector-owned dense storage, and traversal follows the
 * Projector's `left` and `right` Structure-of-Arrays links.
 *
 * An edit length is decomposed as `length = 128q + r`, where `r < 128`.
 * Complete intervals are represented by inserting or erasing `q` checkpoint
 * entries. Only `r` is applied to the surviving suffix through linked
 * traversal, keeping its adjustment distance strictly below the checkpoint
 * frequency. Suffix traversal processes sixteen independent checkpoint chains
 * per full batch so an optimizing WebAssembly compiler may expose instruction-
 * and memory-level parallelism.
 *
 * @invariant Checkpoints occur in ascending Projection order at a frequency of
 * 128 positions.
 * @invariant Every checkpoint is a valid index for the owning Projector's dense
 * Strip and traversal-link vectors.
 * @invariant Adjacent checkpoints represent exactly 128 Projection positions
 * when both positions exist.
 * @note Allocation failure during insertion terminates because mutation is
 * exposed through a `noexcept` operation.
 */
class LengthTable {

private:
  /** @brief Dense Strip index stored at each 128-position boundary. */
  std::vector<uint32_t> checkpoints;

public:
  /**
   * @brief Adjust checkpoints following one Projection insertion or removal.
   *
   * The first affected table entry is selected directly from `after_index`.
   * Complete 128-position intervals are handled structurally in `checkpoints`:
   * removal erases entries, while insertion creates entries by walking the new
   * region once. The surviving suffix walks only `length & 127u` links in
   * sixteen-chain batches, followed by a scalar tail of at most fifteen
   * checkpoints.
   *
   * Removal compacts the affected suffix and applies the remainder through the
   * Projector's `left` links. Insertion materializes new interval checkpoints
   * through `right`, then applies the remainder only to the pre-existing
   * suffix.
   *
   * @param remove `true` for removal and `false` for insertion.
   * @param after_index Projection position selecting the first affected
   * checkpoint interval.
   * @param length Number of Projection positions inserted or removed.
   * @param projector Owning Projector whose dense bidirectional links are
   * traversed.
   * @pre `projector` is non-null.
   * @pre Every traversed checkpoint and link is a valid dense Projector index.
   * @post Complete checkpoint intervals reflect the edit structurally.
   * @post Every surviving affected checkpoint reflects the sub-128 remainder.
   * @complexity For `q = length / 128`, `r = length % 128`, and `a` surviving
   * affected checkpoints, removal costs O(c + ar) for table compaction size
   * `c`; insertion costs O(c + 128q + ar). Linked suffix work is always
   * O(127a) or less.
   */
  inline void adjust_chekpoints(bool remove, std::uint32_t after_index,
                                std::uint32_t length,
                                Projector *projector) noexcept {
    if (length == 0 || checkpoints.empty())
      return;

    constexpr std::uint32_t walker_count = 16u;
    constexpr std::uint32_t checkpoint_frequency = 128u;
    const std::uint32_t first_affected_checkpoint =
        after_index / checkpoint_frequency;
    if (first_affected_checkpoint >= checkpoints.size())
      return;

    /// HELPER START
    const auto adjust_suffix = [&](const std::uint32_t suffix_start,
                                   const std::uint32_t steps,
                                   const std::uint32_t *links) noexcept {
      // Advance sixteen independent chains per batch, then finish the tail.
      const std::uint32_t checkpoint_count =
          static_cast<std::uint32_t>(checkpoints.size());
      std::uint32_t checkpoint_index = suffix_start;
      for (; checkpoint_count - checkpoint_index >= walker_count;
           checkpoint_index += walker_count) {
        std::uint32_t walkers[walker_count];
        // SIMD: contiguous checkpoint lanes are candidates for v128 loads.
        for (std::uint32_t walker = 0; walker < walker_count; ++walker)
          walkers[walker] = checkpoints[checkpoint_index + walker];
        // ILP: sixteen independent dependency chains remain live per step.
        // MLP: their indexed link loads should overlap across the memory
        // hierarchy.
        for (std::uint32_t step = 0; step < steps; ++step)
          for (std::uint32_t walker = 0; walker < walker_count; ++walker)
            walkers[walker] = links[walkers[walker]];
        // SIMD: contiguous corrected lanes are candidates for v128 stores.
        for (std::uint32_t walker = 0; walker < walker_count; ++walker)
          checkpoints[checkpoint_index + walker] = walkers[walker];
      }
      for (; checkpoint_index < checkpoint_count; ++checkpoint_index)
        for (std::uint32_t step = 0; step < steps; ++step)
          checkpoints[checkpoint_index] = links[checkpoints[checkpoint_index]];
    };
    /// HELPER END

    std::uint32_t complete_intervals = length / checkpoint_frequency;
    const std::uint32_t remainder = length & 127u;

    if (remove) {
      // Erase complete intervals and walk only the surviving remainder.
      const std::uint32_t affected_checkpoint_count =
          static_cast<std::uint32_t>(checkpoints.size()) -
          first_affected_checkpoint;
      if (complete_intervals > affected_checkpoint_count)
        complete_intervals = affected_checkpoint_count;
      if (complete_intervals != 0) {
        const auto first = checkpoints.begin() + first_affected_checkpoint;
        checkpoints.erase(first, first + complete_intervals);
      }
      if (remainder != 0)
        adjust_suffix(first_affected_checkpoint, remainder,
                      projector->left.data());
      return;
    }

    // Materialize complete inserted intervals before adjusting the old suffix.
    std::uint32_t position = checkpoints[first_affected_checkpoint];
    if (complete_intervals != 0) {
      checkpoints.insert(checkpoints.begin() + first_affected_checkpoint,
                         complete_intervals, position);
      for (std::uint32_t interval = 0; interval < complete_intervals;
           ++interval) {
        for (std::uint32_t step = 0; step < checkpoint_frequency; ++step)
          position = projector->right[position];
        checkpoints[first_affected_checkpoint + interval] = position;
      }
    }
    if (remainder != 0)
      adjust_suffix(first_affected_checkpoint + complete_intervals, remainder,
                    projector->right.data());
  }

  /**
   * @brief Return the nearest checkpoint and its visible Projection index.
   *
   * Positions with an interval offset from zero through 64 select the current
   * checkpoint. Offsets from 65 through 127 select the following checkpoint.
   * The checkpoint's visible index is derived once from its table index and
   * fixed frequency. Callers infer traversal direction by comparing that index
   * with their target.
   *
   * @param index Zero-based visible Projection position to resolve.
   * @return Pair containing the checkpoint's stable dense position and its
   * visible Projection index.
   * @pre The selected checkpoint exists in `checkpoints`.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] inline std::pair<std::uint32_t, std::uint32_t>
  nearest_chekpoint(std::uint32_t index) const noexcept {
    const std::uint32_t checkpoint_index =
        (index >> 7) + static_cast<std::uint32_t>((index & 127u) > 64u);
    return {checkpoints[checkpoint_index], checkpoint_index * 128u};
  }
};
