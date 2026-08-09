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
  /** @brief Exact dense and visible position of one checkpoint Strip. */
  struct Checkpoint {
    std::uint32_t stable_position;
    std::uint32_t projection_frame_index;
  };

  /** @brief Exact containing Strip for each 128-Frame boundary. */
  std::vector<Checkpoint> checkpoints;

  /** @brief Locate one target from an exact nearby Strip position. */
  template <typename ProjectorType>
  [[nodiscard]] static inline Checkpoint
  locate_checkpoint(std::uint32_t stable_position,
                    std::uint32_t projection_frame_index,
                    const std::uint32_t target_frame_index,
                    const ProjectorType *projector) noexcept {
    while (true) {
      const auto &strip = projector->strips[stable_position];
      if (strip.is_masked == 0 &&
          target_frame_index >= projection_frame_index &&
          target_frame_index - projection_frame_index < strip.frame_count)
        return {stable_position, projection_frame_index};

      if (projection_frame_index <= target_frame_index) {
        if (strip.is_masked == 0)
          projection_frame_index += strip.frame_count;
        stable_position = projector->right[stable_position];
        continue;
      }

      stable_position = projector->left[stable_position];
      const auto &left_strip = projector->strips[stable_position];
      if (left_strip.is_masked == 0)
        projection_frame_index -= left_strip.frame_count;
    }
  }

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
   * @pre Every traversed checkpoint and link is a valid dense Projector index.
   * @post Every affected entry contains its fixed Projection boundary and
   * reports its containing Strip's exact visible start.
   */
  template <typename ProjectorType>
  inline void adjust_chekpoints(bool remove, std::uint32_t after_index,
                                std::uint32_t length,
                                ProjectorType *projector) noexcept {
    if (length == 0 || checkpoints.empty())
      return;

    constexpr std::uint32_t checkpoint_frequency = 128u;
    const std::uint32_t first_affected_checkpoint =
        (after_index + checkpoint_frequency - 1u) / checkpoint_frequency;
    const std::uint32_t previous_frame_count =
        projector->projection_frame_count;
    const std::uint32_t next_frame_count =
        remove ? previous_frame_count - length : previous_frame_count + length;
    const std::vector<Checkpoint> previous = checkpoints;
    if (next_frame_count == 0) {
      checkpoints.resize(1);
      checkpoints[0] = {previous[0].stable_position, 0};
    } else {
      const std::uint32_t next_checkpoint_count =
          (next_frame_count + checkpoint_frequency - 1u) /
          checkpoint_frequency;
      checkpoints.resize(next_checkpoint_count);

      for (std::uint32_t checkpoint_index = first_affected_checkpoint;
           checkpoint_index < next_checkpoint_count; ++checkpoint_index) {
        const std::uint32_t checkpoint_frame_index =
            checkpoint_index * checkpoint_frequency;
        const std::uint32_t previous_target_frame_index =
            remove ? checkpoint_frame_index + length
            : checkpoint_frame_index < after_index + length
                ? after_index
                : checkpoint_frame_index - length;
        std::uint32_t previous_checkpoint_index =
            (previous_target_frame_index >> 7) +
            static_cast<std::uint32_t>((previous_target_frame_index & 127u) >
                                       64u);
        if (previous_checkpoint_index >= previous.size())
          previous_checkpoint_index =
              static_cast<std::uint32_t>(previous.size()) - 1u;

        Checkpoint origin = previous[previous_checkpoint_index];
        if (remove) {
          if (origin.projection_frame_index >= after_index + length)
            origin.projection_frame_index -= length;
          else if (origin.projection_frame_index >= after_index)
            origin.projection_frame_index = after_index;
        } else if (origin.projection_frame_index >= after_index) {
          origin.projection_frame_index += length;
        }

        checkpoints[checkpoint_index] = locate_checkpoint(
            origin.stable_position, origin.projection_frame_index,
            checkpoint_frame_index, projector);
      }
    }

    for (const Checkpoint &checkpoint : previous)
      projector->strips[checkpoint.stable_position]
          .checkpoint_projection_frame_index =
          no_checkpoint_projection_frame_index;
    for (const Checkpoint &checkpoint : checkpoints)
      projector->strips[checkpoint.stable_position]
          .checkpoint_projection_frame_index =
          checkpoint.projection_frame_index;
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
    std::uint32_t checkpoint_index =
        (index >> 7) + static_cast<std::uint32_t>((index & 127u) > 64u);
    if (checkpoint_index >= checkpoints.size())
      checkpoint_index = static_cast<std::uint32_t>(checkpoints.size()) - 1u;
    const Checkpoint &checkpoint = checkpoints[checkpoint_index];
    return {checkpoint.stable_position, checkpoint.projection_frame_index};
  }

  /**
   * @brief Derive the visible Projection start of one Stable Position.
   *
   * Traversal follows `right` until a Strip's direct checkpoint marker is set,
   * summing only visible Strip lengths. If the circular walk crosses Projection
   * origin, the total visible Projection length corrects the checkpoint index
   * before subtracting the walked distance.
   *
   * @tparam ProjectorType Type exposing `strips`, `right`, and
   * `projection_frame_count`.
   * @param stable_position Stable Position whose visible start is required.
   * @param projector Owning Projector.
   * @return Projection Index at which the Strip begins; a Mask may share the
   * returned index with an adjacent Strip.
   * @pre The Stable Position belongs to the materialized circular chain and at
   * least one checkpoint exists.
   * @complexity O(s) for the structural Strips between the position and first
   * encountered checkpoint.
   */
  template <typename ProjectorType>
  [[nodiscard]] inline std::uint32_t
  projection_frame_index(const std::uint32_t stable_position,
                         const ProjectorType *projector) const noexcept {
    std::uint32_t position = stable_position;
    std::uint32_t walked_frame_count = 0;

    while (true) {
      const auto &strip = projector->strips[position];
      if (strip.checkpoint_projection_frame_index !=
          no_checkpoint_projection_frame_index) {
        std::uint32_t checkpoint_projection_frame_index =
            strip.checkpoint_projection_frame_index;
        if (checkpoint_projection_frame_index < walked_frame_count)
          checkpoint_projection_frame_index +=
              projector->projection_frame_count;
        return checkpoint_projection_frame_index - walked_frame_count;
      }

      if (strip.is_masked == 0)
        walked_frame_count += strip.frame_count;
      position = projector->right[position];
    }
  }

  /**
   * @brief Rebuild all checkpoints from one Structural Order origin.
   *
   * The first Stable Position becomes checkpoint zero. One further entry is
   * emitted for every crossed 128-Frame visible boundary; Masks advance
   * Structural Order but not the visible counter.
   *
   * @tparam ProjectorType Type exposing `strips`, `right`, and
   * `projection_frame_count`.
   * @param first_position Stable Position representing Projection Index zero.
   * @param projector Owning Projector.
   * @pre `first_position` belongs to a valid circular Structural Order.
   * @post Existing checkpoint storage is replaced by the complete current
   * table.
   * @complexity O(s + p), where s is the structural Strip count and p the
   * checkpoint count.
   */
  template <typename ProjectorType>
  inline void initialize(const std::uint32_t first_position,
                         ProjectorType *projector) noexcept {
    checkpoints.clear();
    if (projector->projection_frame_count == 0) {
      checkpoints.push_back({first_position, 0});
      projector->strips[first_position].checkpoint_projection_frame_index = 0;
      return;
    }

    std::uint32_t position = first_position;
    std::uint32_t projection_frame_index = 0;
    std::uint32_t next_checkpoint = 0;
    do {
      auto &strip = projector->strips[position];
      strip.checkpoint_projection_frame_index =
          no_checkpoint_projection_frame_index;
      if (strip.is_masked == 0) {
        const std::uint32_t strip_end =
            projection_frame_index + strip.frame_count;
        while (next_checkpoint < projector->projection_frame_count &&
               next_checkpoint < strip_end) {
          checkpoints.push_back({position, projection_frame_index});
          strip.checkpoint_projection_frame_index = projection_frame_index;
          next_checkpoint += 128;
        }
        projection_frame_index = strip_end;
      }
      position = projector->right[position];
    } while (position != first_position);
  }

  /**
   * @brief Report whether Projection navigation has been initialized.
   * @return `true` when no checkpoint exists.
   * @complexity O(1).
   */
  [[nodiscard]] inline bool is_empty() const noexcept {
    return checkpoints.empty();
  }
};
