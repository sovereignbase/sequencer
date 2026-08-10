/**
 * @file
 * @brief Defines the fixed-frequency index for bounded Projection traversal.
 *
 * LengthTable stores the containing dense Strip and its exact visible start
 * for every 128-Frame Projection boundary. Reads begin at the nearest
 * checkpoint and follow the Projector's compact `left` or `right` link vector.
 */
#pragma once
#include <cstdint>
#include <utility>
#include <vector>

/**
 * @brief Periodic dense-index entry points into one Projector Projection.
 *
 * Checkpoint `i` identifies the Strip containing Projection boundary `i *
 * 128`. Because a boundary may fall inside a multi-Frame Strip, each entry also
 * stores that Strip's exact Projection start. The table contains no independent
 * ordering information: stable positions remain indexes into Projector-owned
 * dense storage, and traversal follows the Projector's `left` and `right`
 * Structure-of-Arrays links.
 *
 * @invariant Checkpoints occur in ascending Projection order at a frequency of
 * 128 positions.
 * @invariant Every checkpoint is a valid index for the owning Projector's dense
 * Strip and traversal-link vectors.
 * @invariant Entry `i` contains Projection boundary `i * 128` within its Strip.
 * @invariant Every stored Projection index is the exact start of its Strip.
 */
class LengthTable {

private:
  std::vector<std::uint32_t> checkpoints{0};

public:
  /**
   * @brief Adjust checkpoints following one Projection insertion or removal.
   *
   * Unaffected entries before the edit remain in place. Every following fixed
   * boundary is relocated from the nearest old checkpoint through the new
   * dense links. Frame displacement and Strip traversal remain distinct, so a
   * multi-Frame Strip never becomes multiple link steps.
   *
   * @param remove `true` for removal and `false` for insertion.
   * @param after_index Projection position selecting the first affected
   * checkpoint interval.
   * @param length Number of Projection positions inserted or removed.
   * @param projector Owning Projector whose dense bidirectional links are
   * traversed.
   * @pre `projector` is non-null.
   * @pre Every traversed checkpoint and link is a valid dense Projector
   * index.
   * @post Every affected entry contains its fixed Projection boundary and
   * reports its containing Strip's exact visible start.
   */
  template <typename ProjectorType>
  inline void adjust_chekpoints(ProjectorType *projector, std::uint32_t index,
                                std::uint32_t length, bool remove) noexcept {
    const auto [stable_index, checkpoint_index] = nearest_checkpoint(index);
    void checkpoints.resize(remove ? checkpoints.size() - length
                                   : checkpoints.size() + length);
  }

  /**
   * @brief Return nearest checkpoint to .
   */
  [[nodiscard]] inline std::pair<std::uint32_t, std::uint32_t>
  nearest_checkpoint(std::uint32_t projection_frame_index) const noexcept {
    const std::uint32_t checkpoint_index =
        (projection_frame_index >> 8) +
        static_cast<std::uint32_t>((projection_frame_index & 255u) > 128u);

    return {checkpoints[checkpoint_index], checkpoint_index};
  }
};
