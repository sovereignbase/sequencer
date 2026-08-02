/**
 * @file
 * @brief Inserts a strip and resolves operations waiting on its start point.
 *
 * Insertions preserve the existing strip's indexed start. Appending creates one
 * new strip; insertion between frames also materializes the existing strip's
 * suffix. Pending masks and inserts are consumed from the newly established
 * start point without recursion or additional traversal storage.
 */
#pragma once

#include "../mask_strip/index.hpp"
#include "../../declarations/projector/index.hpp"
#include <cstdint>

/**
 * @brief Insert a visible strip after one frame of a materialized strip.
 *
 * @code
 * At end:    [ source ] -> [ source ][ insert ]
 * In middle: [ source ] -> [ prefix ][ insert ][ suffix ]
 * @endcode
 *
 * The original start key always remains indexed. An end insertion retains the
 * complete source strip; otherwise that entry becomes the source prefix. The
 * suffix begins at the source point advanced by the insertion boundary and at
 * the corresponding footage frame index.
 *
 * Processing is divided into four phases:
 *
 * 1. Preserve the source strip and resolve the insertion boundary.
 * 2. Materialize the applicable shape shown above.
 * 3. Reconnect the replacement tail to the original successor.
 * 4. Consume the mask and insert waiting on the inserted start point.
 *
 * A pending mask is applied before a pending insert. The pending insert is
 * appended after the complete inserted frame span, including any suffix
 * created by that mask. Further dependent inserts repeat the same processing
 * iteratively.
 *
 * StripIndex writes may invalidate stored pointers, so the replacement is
 * derived from the preserved source value and each pending value is copied
 * before its index entry is removed.
 *
 * @param projector Projector receiving the strip.
 * @param previous_strip Strip containing the frame after which insertion occurs.
 * @param previous_strip_frame_offset Zero-based offset of that frame within
 * `previous_strip`.
 * @param inserted_strip Visible strip to insert.
 * @pre `projector` and `previous_strip` are non-null.
 * @pre `previous_strip_frame_offset < previous_strip->frame_count`.
 * @pre `inserted_strip.is_masked` is zero.
 * @post Every inserted visible frame is included in
 * `projector->projection_frame_count`.
 * @post The original successor is linked after the complete inserted chain.
 * @complexity A constant number of StripIndex operations per resolved pending
 * insert and O(1) local space.
 */
inline void insert_strip(Projector *projector, const Strip *previous_strip,
                         std::uint32_t previous_strip_frame_offset,
                         Strip inserted_strip) noexcept {
  while (true) {
    // Preserve the source before any StripIndex write can invalidate its pointer.
    const Strip original_strip = *previous_strip;
    const std::uint32_t insertion_frame_boundary =
        previous_strip_frame_offset + 1;
    const SequencePoint inserted_strip_start =
        inserted_strip.coordinate.this_strip_start;
    const SequencePoint original_next_strip_start =
        original_strip.next_strip_start;

    // The original indexed start is always retained as the prefix start.
    Strip prefix_strip = original_strip;
    prefix_strip.frame_count = insertion_frame_boundary;
    prefix_strip.next_strip_start = inserted_strip_start;

    inserted_strip.coordinate.previous_strip_start =
        prefix_strip.coordinate.this_strip_start;
    projector->projection_frame_count += inserted_strip.frame_count;

    SequencePoint replacement_tail_strip_start = inserted_strip_start;
    if (insertion_frame_boundary == original_strip.frame_count) {
      // Append: the inserted strip directly inherits the original successor.
      inserted_strip.next_strip_start = original_next_strip_start;
      projector->strip_index.set(prefix_strip.coordinate.this_strip_start,
                                 prefix_strip);
      projector->strip_index.set(inserted_strip_start, inserted_strip);
    } else {
      // Interior insertion: derive and materialize the original strip's suffix.
      SequencePoint suffix_strip_start =
          original_strip.coordinate.this_strip_start;
      suffix_strip_start.counter_bits += insertion_frame_boundary;

      Strip suffix_strip = original_strip;
      suffix_strip.frame_count -= insertion_frame_boundary;
      suffix_strip.footage_frame_index += insertion_frame_boundary;
      suffix_strip.coordinate.this_strip_start = suffix_strip_start;
      suffix_strip.coordinate.previous_strip_start = inserted_strip_start;

      inserted_strip.next_strip_start = suffix_strip_start;
      replacement_tail_strip_start = suffix_strip_start;

      projector->strip_index.set(prefix_strip.coordinate.this_strip_start,
                                 prefix_strip);
      projector->strip_index.set(inserted_strip_start, inserted_strip);
      projector->strip_index.set(suffix_strip_start, suffix_strip);
    }

    // Reconnect the original successor, or publish the new structural tail.
    if (!(original_next_strip_start == unlinked_strip_start)) {
      Strip next_strip =
          *projector->strip_index.get(original_next_strip_start);
      next_strip.coordinate.previous_strip_start =
          replacement_tail_strip_start;
      projector->strip_index.set(next_strip.coordinate.this_strip_start,
                                 next_strip);
    } else {
      projector->last_strip_start = replacement_tail_strip_start;
    }

    // Apply the mask waiting specifically on this newly materialized start.
    // A partial leading mask creates the suffix after which a pending insert
    // must be appended; an oversized mask is removed and discarded.
    SequencePoint append_after_strip_start = inserted_strip_start;
    const Strip *pending_mask =
        projector->pending_masks.get(inserted_strip_start);
    if (pending_mask != nullptr) {
      const Strip pending_mask_copy = *pending_mask;
      projector->pending_masks.remove(inserted_strip_start);

      const Strip *materialized_inserted_strip =
          projector->strip_index.get(inserted_strip_start);
      if (pending_mask_copy.frame_count <=
          materialized_inserted_strip->frame_count) {
        if (pending_mask_copy.frame_count <
            materialized_inserted_strip->frame_count)
          append_after_strip_start.counter_bits +=
              pending_mask_copy.frame_count;
        mask_strip(projector, materialized_inserted_strip, 0,
                   pending_mask_copy);
      }
    }

    // Append the next dependent insert after the complete current insertion.
    // Reassigning the loop inputs resolves an arbitrary pending chain without
    // recursion or an auxiliary container.
    const Strip *pending_insert =
        projector->pending_inserts.get(inserted_strip_start);
    if (pending_insert == nullptr)
      return;

    inserted_strip = *pending_insert;
    projector->pending_inserts.remove(inserted_strip_start);
    previous_strip =
        projector->strip_index.get(append_after_strip_start);
    previous_strip_frame_offset = previous_strip->frame_count - 1;
  }
}
