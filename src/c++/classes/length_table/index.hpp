/**
 * @file
 * @brief Defines the fixed-frequency index for bounded Projection traversal.
 *
 * LengthTable stores the containing dense Strip and its visible checkpoint
 * index for every 256-Frame Projection boundary. Reads begin at the nearest
 * checkpoint and follow the Projector's compact `left` or `right` link vector.
 */
#pragma once
#include "../../declarations/sentinels/index.hpp"
#include "../../declarations/strip/index.hpp"
#include <cstdint>
#include <utility>
#include <vector>
#include <wasm_simd128.h>

/**
 * @brief Periodic dense-index entry points into one Projector Projection.
 *
 * Checkpoint `i` identifies the Strip containing Projection boundary `i *
 * 256`. Because a boundary may fall inside a multi-Frame Strip, each entry
 * stores that Strip's stable dense position. The table contains no independent
 * ordering information: stable positions remain indexes into Projector-owned
 * dense storage, and traversal follows the Projector's `left` and `right`
 * Structure-of-Arrays links.
 *
 * @invariant Checkpoints occur in ascending Projection order at a frequency of
 * 256 positions.
 * @invariant Every checkpoint is a valid index for the owning Projector's dense
 * Strip and traversal-link vectors.
 * @invariant Entry `i` contains Projection boundary `i * 256` within its Strip.
 * @invariant Every checkpoint position is stable within dense Projector
 * storage.
 */
class LengthTable {

private:
  std::vector<std::uint32_t> checkpoints;

public:
  inline void initialize(const std::uint32_t stable_position) noexcept {
    checkpoints.push_back(stable_position);
  }

  inline void set_first(const std::uint32_t stable_position) noexcept {
    checkpoints[0] = stable_position;
  }

  [[nodiscard]] inline bool is_empty() const noexcept {
    return checkpoints.empty();
  }

  /**
   * @brief Adjust checkpoints following one Projection insertion or removal.
   *
   * Unaffected entries before the edit remain in place. Every following fixed
   * boundary is relocated from the nearest old checkpoint through the new
   * dense links. Frame displacement and Strip traversal remain distinct, so a
   * multi-Frame Strip never becomes multiple link steps.
   *
   * @param projector Owning Projector whose dense bidirectional links are
   * traversed.
   * @param projection_frame_index Projection position selecting the first
   * affected checkpoint interval.
   * @param strip_steps Number of strips to move.
   * @param remove `true` for removal and `false` for insertion determines
   * direction to move.
   * @pre `projector` is non-null.
   * @pre Every traversed checkpoint and link is a valid dense Projector
   * index.
   * @post Every affected entry contains its fixed Projection boundary and
   * reports its containing Strip's stable dense position.
   */
  template <typename ProjectorType>
  inline void adjust_checkpoints(ProjectorType *projector,
                                 std::uint32_t projection_frame_index,
                                 std::uint32_t strip_steps,
                                 bool remove) noexcept {
    std::uint32_t checkpoint_index = (projection_frame_index >> 8) + 1u;

    const std::uint32_t checkpoint_count =
        static_cast<std::uint32_t>(checkpoints.size());

    if (checkpoint_index >= checkpoint_count)
      return;

    const std::uint32_t block_end =
        checkpoint_index + ((checkpoint_count - checkpoint_index) & ~15u);

    const std::uint32_t *links =
        remove ? projector->left.data() : projector->right.data();

    std::uint32_t *checkpoint_data = checkpoints.data();

    while (checkpoint_index < block_end) {
      alignas(32) std::uint32_t strip_indices[16];

      // Explicit SIMD load of 16 checkpoint Strip indices.
      const v128_t v0 = *reinterpret_cast<volatile const v128_t *>(
          checkpoint_data + checkpoint_index + 0u);
      const v128_t v1 = *reinterpret_cast<volatile const v128_t *>(
          checkpoint_data + checkpoint_index + 4u);
      const v128_t v2 = *reinterpret_cast<volatile const v128_t *>(
          checkpoint_data + checkpoint_index + 8u);
      const v128_t v3 = *reinterpret_cast<volatile const v128_t *>(
          checkpoint_data + checkpoint_index + 12u);

      strip_indices[0] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v0, 0));
      strip_indices[1] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v0, 1));
      strip_indices[2] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v0, 2));
      strip_indices[3] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v0, 3));

      strip_indices[4] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v1, 0));
      strip_indices[5] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v1, 1));
      strip_indices[6] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v1, 2));
      strip_indices[7] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v1, 3));

      strip_indices[8] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v2, 0));
      strip_indices[9] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v2, 1));
      strip_indices[10] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v2, 2));
      strip_indices[11] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v2, 3));

      strip_indices[12] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v3, 0));
      strip_indices[13] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v3, 1));
      strip_indices[14] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v3, 2));
      strip_indices[15] =
          static_cast<std::uint32_t>(wasm_i32x4_extract_lane(v3, 3));

      // Clear old checkpoint markers.
      for (std::uint32_t lane = 0; lane < 16u; ++lane)
        projector->strips[strip_indices[lane]]
            .checkpoint_projection_frame_index = u32_max;

      // 16 independent scalar gather chains.
      for (std::uint32_t step = 0; step < strip_steps; ++step) {
        strip_indices[0] = links[strip_indices[0]];
        strip_indices[1] = links[strip_indices[1]];
        strip_indices[2] = links[strip_indices[2]];
        strip_indices[3] = links[strip_indices[3]];
        strip_indices[4] = links[strip_indices[4]];
        strip_indices[5] = links[strip_indices[5]];
        strip_indices[6] = links[strip_indices[6]];
        strip_indices[7] = links[strip_indices[7]];
        strip_indices[8] = links[strip_indices[8]];
        strip_indices[9] = links[strip_indices[9]];
        strip_indices[10] = links[strip_indices[10]];
        strip_indices[11] = links[strip_indices[11]];
        strip_indices[12] = links[strip_indices[12]];
        strip_indices[13] = links[strip_indices[13]];
        strip_indices[14] = links[strip_indices[14]];
        strip_indices[15] = links[strip_indices[15]];
      }

      // Explicit SIMD store of the 16 new checkpoint Strip indices.
      const v128_t o0 =
          wasm_i32x4_make(static_cast<std::int32_t>(strip_indices[0]),
                          static_cast<std::int32_t>(strip_indices[1]),
                          static_cast<std::int32_t>(strip_indices[2]),
                          static_cast<std::int32_t>(strip_indices[3]));

      const v128_t o1 =
          wasm_i32x4_make(static_cast<std::int32_t>(strip_indices[4]),
                          static_cast<std::int32_t>(strip_indices[5]),
                          static_cast<std::int32_t>(strip_indices[6]),
                          static_cast<std::int32_t>(strip_indices[7]));

      const v128_t o2 =
          wasm_i32x4_make(static_cast<std::int32_t>(strip_indices[8]),
                          static_cast<std::int32_t>(strip_indices[9]),
                          static_cast<std::int32_t>(strip_indices[10]),
                          static_cast<std::int32_t>(strip_indices[11]));

      const v128_t o3 =
          wasm_i32x4_make(static_cast<std::int32_t>(strip_indices[12]),
                          static_cast<std::int32_t>(strip_indices[13]),
                          static_cast<std::int32_t>(strip_indices[14]),
                          static_cast<std::int32_t>(strip_indices[15]));

      *reinterpret_cast<volatile v128_t *>(checkpoint_data + checkpoint_index +
                                           0u) = o0;
      *reinterpret_cast<volatile v128_t *>(checkpoint_data + checkpoint_index +
                                           4u) = o1;
      *reinterpret_cast<volatile v128_t *>(checkpoint_data + checkpoint_index +
                                           8u) = o2;
      *reinterpret_cast<volatile v128_t *>(checkpoint_data + checkpoint_index +
                                           12u) = o3;

      // Mark the new checkpoint Strips.
      for (std::uint32_t lane = 0; lane < 16u; ++lane)
        projector->strips[strip_indices[lane]]
            .checkpoint_projection_frame_index = (checkpoint_index + lane) << 8;

      checkpoint_index += 16u;
    }

    // Scalar tail.
    while (checkpoint_index < checkpoint_count) {
      std::uint32_t strip_index = checkpoint_data[checkpoint_index];

      projector->strips[strip_index].checkpoint_projection_frame_index =
          u32_max;

      for (std::uint32_t step = 0; step < strip_steps; ++step)
        strip_index = links[strip_index];

      checkpoint_data[checkpoint_index] = strip_index;

      projector->strips[strip_index].checkpoint_projection_frame_index =
          checkpoint_index << 8;

      ++checkpoint_index;
    }
  }
  /**
   * @brief Return the nearest checkpoint and its visible Projection index.
   *
   * Positions with an interval offset from zero through 128 select the current
   * checkpoint. Offsets from 129 through 255 select the following checkpoint.
   * The checkpoint's visible index is derived once from its table index and
   * fixed frequency. Callers infer traversal direction by comparing that index
   * with their target.
   *
   * @param projection_frame_index Zero-based visible Projection position to
   * resolve.
   * @return Pair containing the checkpoint's stable dense position and its
   * visible Projection index.
   * @pre The selected checkpoint exists in `checkpoints`.
   * @complexity O(1) time and O(1) space.
   */
  [[nodiscard]] inline std::pair<std::uint32_t, std::uint32_t>
  nearest_checkpoint(std::uint32_t projection_frame_index) const noexcept {
    std::uint32_t checkpoint_index =
        (projection_frame_index >> 8) +
        static_cast<std::uint32_t>((projection_frame_index & 255u) > 128u);
    if (checkpoint_index >= checkpoints.size())
      checkpoint_index = static_cast<std::uint32_t>(checkpoints.size()) - 1u;

    return {checkpoints[checkpoint_index], checkpoint_index * 256u};
  }
};
