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
   * @param length Number of Projection positions inserted or removed.
   * @param remove `true` for removal and `false` for insertion.
   * @pre `projector` is non-null.
   * @pre Every traversed checkpoint and link is a valid dense Projector
   * index.
   * @post Every affected entry contains its fixed Projection boundary and
   * reports its containing Strip's stable dense position.
   */
  template <typename ProjectorType>
  inline void adjust_checkpoints(ProjectorType *projector,
                                 std::uint32_t projection_frame_index,
                                 std::uint32_t length, bool remove) noexcept {

    // The next checkpoint after the edit area.
    std::uint32_t checkpoint_index = projection_frame_index / 256u + 1u;

    if (!remove)
      checkpoints.resize(checkpoints.size() + length);

    const std::uint32_t checkpoint_count =
        static_cast<std::uint32_t>(checkpoints.size());

    const std::uint32_t block_end =
        checkpoint_index + ((checkpoint_count - checkpoint_index) & ~15u);

    while (checkpoint_index < block_end) {

      // MLP/ILP.
      std::uint32_t checkpoint_index1 = checkpoint_index;
      std::uint32_t checkpoint_index2 = checkpoint_index + 1u;
      std::uint32_t checkpoint_index3 = checkpoint_index + 2u;
      std::uint32_t checkpoint_index4 = checkpoint_index + 3u;
      std::uint32_t checkpoint_index5 = checkpoint_index + 4u;
      std::uint32_t checkpoint_index6 = checkpoint_index + 5u;
      std::uint32_t checkpoint_index7 = checkpoint_index + 6u;
      std::uint32_t checkpoint_index8 = checkpoint_index + 7u;
      std::uint32_t checkpoint_index9 = checkpoint_index + 8u;
      std::uint32_t checkpoint_index10 = checkpoint_index + 9u;
      std::uint32_t checkpoint_index11 = checkpoint_index + 10u;
      std::uint32_t checkpoint_index12 = checkpoint_index + 11u;
      std::uint32_t checkpoint_index13 = checkpoint_index + 12u;
      std::uint32_t checkpoint_index14 = checkpoint_index + 13u;
      std::uint32_t checkpoint_index15 = checkpoint_index + 14u;
      std::uint32_t checkpoint_index16 = checkpoint_index + 15u;

      // Load checkpoint strips by stable position.
      std::uint32_t strip_index1 = checkpoints[checkpoint_index1];
      std::uint32_t strip_index2 = checkpoints[checkpoint_index2];
      std::uint32_t strip_index3 = checkpoints[checkpoint_index3];
      std::uint32_t strip_index4 = checkpoints[checkpoint_index4];
      std::uint32_t strip_index5 = checkpoints[checkpoint_index5];
      std::uint32_t strip_index6 = checkpoints[checkpoint_index6];
      std::uint32_t strip_index7 = checkpoints[checkpoint_index7];
      std::uint32_t strip_index8 = checkpoints[checkpoint_index8];
      std::uint32_t strip_index9 = checkpoints[checkpoint_index9];
      std::uint32_t strip_index10 = checkpoints[checkpoint_index10];
      std::uint32_t strip_index11 = checkpoints[checkpoint_index11];
      std::uint32_t strip_index12 = checkpoints[checkpoint_index12];
      std::uint32_t strip_index13 = checkpoints[checkpoint_index13];
      std::uint32_t strip_index14 = checkpoints[checkpoint_index14];
      std::uint32_t strip_index15 = checkpoints[checkpoint_index15];
      std::uint32_t strip_index16 = checkpoints[checkpoint_index16];

      // Mark old checkpoint strips as not checkpoints.
      projector->strips[strip_index1].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index2].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index3].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index4].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index5].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index6].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index7].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index8].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index9].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index10].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index11].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index12].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index13].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index14].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index15].checkpoint_projection_frame_index =
          u32_max;
      projector->strips[strip_index16].checkpoint_projection_frame_index =
          u32_max;

      if (remove) {
        for (std::uint32_t i = 0; i < length; ++i) {
          strip_index1 = projector->left[strip_index1];
          strip_index2 = projector->left[strip_index2];
          strip_index3 = projector->left[strip_index3];
          strip_index4 = projector->left[strip_index4];
          strip_index5 = projector->left[strip_index5];
          strip_index6 = projector->left[strip_index6];
          strip_index7 = projector->left[strip_index7];
          strip_index8 = projector->left[strip_index8];
          strip_index9 = projector->left[strip_index9];
          strip_index10 = projector->left[strip_index10];
          strip_index11 = projector->left[strip_index11];
          strip_index12 = projector->left[strip_index12];
          strip_index13 = projector->left[strip_index13];
          strip_index14 = projector->left[strip_index14];
          strip_index15 = projector->left[strip_index15];
          strip_index16 = projector->left[strip_index16];
        }
      } else {
        for (std::uint32_t i = 0; i < length; ++i) {
          strip_index1 = projector->right[strip_index1];
          strip_index2 = projector->right[strip_index2];
          strip_index3 = projector->right[strip_index3];
          strip_index4 = projector->right[strip_index4];
          strip_index5 = projector->right[strip_index5];
          strip_index6 = projector->right[strip_index6];
          strip_index7 = projector->right[strip_index7];
          strip_index8 = projector->right[strip_index8];
          strip_index9 = projector->right[strip_index9];
          strip_index10 = projector->right[strip_index10];
          strip_index11 = projector->right[strip_index11];
          strip_index12 = projector->right[strip_index12];
          strip_index13 = projector->right[strip_index13];
          strip_index14 = projector->right[strip_index14];
          strip_index15 = projector->right[strip_index15];
          strip_index16 = projector->right[strip_index16];
        }
      }

      // Store new checkpoint strips by stable position.
      checkpoints[checkpoint_index1] = strip_index1;
      checkpoints[checkpoint_index2] = strip_index2;
      checkpoints[checkpoint_index3] = strip_index3;
      checkpoints[checkpoint_index4] = strip_index4;
      checkpoints[checkpoint_index5] = strip_index5;
      checkpoints[checkpoint_index6] = strip_index6;
      checkpoints[checkpoint_index7] = strip_index7;
      checkpoints[checkpoint_index8] = strip_index8;
      checkpoints[checkpoint_index9] = strip_index9;
      checkpoints[checkpoint_index10] = strip_index10;
      checkpoints[checkpoint_index11] = strip_index11;
      checkpoints[checkpoint_index12] = strip_index12;
      checkpoints[checkpoint_index13] = strip_index13;
      checkpoints[checkpoint_index14] = strip_index14;
      checkpoints[checkpoint_index15] = strip_index15;
      checkpoints[checkpoint_index16] = strip_index16;

      // Set indices of new checkpoints multiplied at requester.
      projector->strips[strip_index1].checkpoint_projection_frame_index =
          checkpoint_index1;
      projector->strips[strip_index2].checkpoint_projection_frame_index =
          checkpoint_index2;
      projector->strips[strip_index3].checkpoint_projection_frame_index =
          checkpoint_index3;
      projector->strips[strip_index4].checkpoint_projection_frame_index =
          checkpoint_index4;
      projector->strips[strip_index5].checkpoint_projection_frame_index =
          checkpoint_index5;
      projector->strips[strip_index6].checkpoint_projection_frame_index =
          checkpoint_index6;
      projector->strips[strip_index7].checkpoint_projection_frame_index =
          checkpoint_index7;
      projector->strips[strip_index8].checkpoint_projection_frame_index =
          checkpoint_index8;
      projector->strips[strip_index9].checkpoint_projection_frame_index =
          checkpoint_index9;
      projector->strips[strip_index10].checkpoint_projection_frame_index =
          checkpoint_index10;
      projector->strips[strip_index11].checkpoint_projection_frame_index =
          checkpoint_index11;
      projector->strips[strip_index12].checkpoint_projection_frame_index =
          checkpoint_index12;
      projector->strips[strip_index13].checkpoint_projection_frame_index =
          checkpoint_index13;
      projector->strips[strip_index14].checkpoint_projection_frame_index =
          checkpoint_index14;
      projector->strips[strip_index15].checkpoint_projection_frame_index =
          checkpoint_index15;
      projector->strips[strip_index16].checkpoint_projection_frame_index =
          checkpoint_index16;

      checkpoint_index += 16u;
    }

    // Process the remaining checkpoints that do not fill one 16-walker block.
    while (checkpoint_index < checkpoint_count) {

      // Load checkpoint Strip by stable position.
      std::uint32_t strip_index = checkpoints[checkpoint_index];

      // Mark old checkpoint Strip as not a checkpoint.
      projector->strips[strip_index].checkpoint_projection_frame_index =
          u32_max;

      if (remove) {
        for (std::uint32_t i = 0; i < length; ++i)
          strip_index = projector->left[strip_index];
      } else {
        for (std::uint32_t i = 0; i < length; ++i)
          strip_index = projector->right[strip_index];
      }

      // Store new checkpoint Strip by stable position.
      checkpoints[checkpoint_index] = strip_index;

      // Set index of the new checkpoint multiplied at requester.
      projector->strips[strip_index].checkpoint_projection_frame_index =
          checkpoint_index;

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
    const std::uint32_t checkpoint_index =
        (projection_frame_index >> 8) +
        static_cast<std::uint32_t>((projection_frame_index & 255u) > 128u);

    return {checkpoints[checkpoint_index], checkpoint_index * 256u};
  }
};
