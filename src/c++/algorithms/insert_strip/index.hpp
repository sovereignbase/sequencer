/**
 * @file
 * @brief Integrates a visible Strip and resolves dependent pending Strips.
 *
 * Insertion preserves the source Strip's indexed start. Appending adds one
 * Strip; insertion between Frames also materializes the source suffix. Pending
 * Masks and inserts keyed by the inserted Strip start are consumed without
 * recursion or traversal storage. The visible update supplies its newly issued
 * Frame Span; this algorithm issues no Sequence Points and retains no ordering
 * metadata.
 */
#pragma once

#include "../../auxiliary/compare_sequence_points/index.hpp"
#include "../../auxiliary/strip_contains_sequence_point/index.hpp"
#include "../../declarations/projector/index.hpp"
#include "../mask_strip/index.hpp"
#include <cstdint>

/**
 * @brief Insert a visible Strip after the Root or one materialized Frame.
 *
 * @par Result shapes
 *
 * | Insertion boundary | Retained Strip order |
 * | --- | --- |
 * | Empty Sequence Root | `[ insert ]` |
 * | Occupied Sequence Root | Root successors in descending Strip-start order |
 * | End of source | `[ source ][ insert ]` |
 * | Inside source | `[ prefix ][ insert ][ suffix ]` |
 *
 * @par Invariants
 *
 * For a non-Root insertion, the source start remains indexed in every shape.
 * An end insertion retains the complete source Strip; otherwise that entry
 * becomes the prefix. The suffix begins at the existing source Sequence Point
 * at the insertion boundary and at the correspondingly advanced Footage frame
 * index. Runtime links supplied by `inserted_strip` are replaced by links
 * derived from the materialized Sequence. The suffix start is an existing
 * Frame point from the split source span, not a newly issued point.
 *
 * @par Processing
 *
 * A Root insertion establishes or reorders the beginning of the retained
 * Sequence. A non-Root source is preserved, the selected split shape is
 * materialized, and its tail is reconnected to the original successor. A
 * pending Mask whose `previous_strip_start` equals the inserted indexed start
 * is then located by its `this_strip_start`, the existing first masked Frame
 * point. It is applied before a pending visible Strip with the same dependency.
 * Further dependencies repeat the same process iteratively.
 *
 * StripIndex writes may invalidate stored pointers, so the replacement is
 * derived from a preserved source value and every pending Strip is copied
 * before removal from its pending index.
 *
 * @par Concurrent placement
 *
 * When multiple visible Strips follow the same point, their unique
 * `this_strip_start` values break the tie. Successors of a non-Root point are
 * ordered in ascending Sequence Point order. Successors of the Root are
 * ordered in descending Sequence Point order. The decision rewrites only
 * structural Strip links; no direction flag, auxiliary index, or other
 * ordering metadata is retained.
 *
 * @param projector Projector receiving the strip.
 * @param previous_strip Strip containing the Frame after which insertion
 * occurs, or `nullptr` when `inserted_strip` follows the Root.
 * @param previous_strip_frame_offset Zero-based offset of that Frame within
 * `previous_strip`; ignored for a Root insertion.
 * @param inserted_strip Visible Strip whose `this_strip_start` is the newly
 * issued first point of its Frame Span.
 * @pre `projector` is non-null.
 * @pre `previous_strip` is non-null and
 * `previous_strip_frame_offset < previous_strip->frame_count`, unless the
 * inserted coordinate follows the Root, in which case `previous_strip` may be
 * null.
 * @pre `inserted_strip.is_masked` is zero.
 * @return Number of already projected Frames crossed when the incoming Strip
 * is placed to the right of an existing successor.
 * @post Every inserted visible Frame is included in
 * `projector->projection_frame_count`.
 * @post The original successor follows the complete inserted Strip chain, or
 * `projector->last_strip_start` identifies its final Strip.
 * @complexity A constant number of StripIndex operations per resolved pending
 * Strip and O(1) auxiliary space.
 */
[[nodiscard]] inline std::uint32_t
insert_strip(Projector *projector, const Strip *previous_strip,
             std::uint32_t previous_strip_frame_offset,
             Strip inserted_strip) noexcept {
  // Track only the incoming Strip's consumer-visible displacement.
  std::uint32_t projection_frame_offset = 0;
  bool is_incoming_strip = true;

  while (true) {
    // Resolve the current Strip identity and whether its dependency is Root.
    const SequencePoint inserted_strip_start =
        inserted_strip.coordinate.this_strip_start;
    const bool follows_root =
        inserted_strip.coordinate.previous_strip_start == SequencePoint{};
    bool inserted_at_root = false;

    // Materialize a Root successor or select its comparison-determined
    // predecessor.
    if (follows_root) {
      // Establish the first retained Strip of an empty Sequence.
      if (projector->strip_index.is_empty()) {
        inserted_strip.next_strip_start = unlinked_strip_start;
        projector->strip_index.set(inserted_strip_start, inserted_strip);
        projector->projection_frame_count += inserted_strip.frame_count;
        projector->first_strip_start = inserted_strip_start;
        projector->gate_strip_start = inserted_strip_start;
        projector->last_strip_start = inserted_strip_start;
        projector->gate_projection_frame_index = 0;
        inserted_at_root = true;
      } else {
        const SequencePoint first_strip_start = projector->first_strip_start;
        Strip first_strip = *projector->strip_index.get(first_strip_start);

        // Place a larger Root successor before the current first Strip.
        if (compare_sequence_points(&inserted_strip_start, &first_strip_start) >
            0) {
          inserted_strip.next_strip_start = first_strip_start;
          first_strip.coordinate.previous_strip_start = inserted_strip_start;
          projector->strip_index.set(inserted_strip_start, inserted_strip);
          projector->strip_index.set(first_strip_start, first_strip);
          projector->projection_frame_count += inserted_strip.frame_count;
          projector->first_strip_start = inserted_strip_start;
          projector->gate_strip_start = inserted_strip_start;
          projector->gate_projection_frame_index = 0;
          inserted_at_root = true;
        } else {
          // Place a smaller Root successor after the current first Strip.
          if (is_incoming_strip && first_strip.is_masked == 0)
            projection_frame_offset += first_strip.frame_count;
          projector->gate_strip_start = first_strip_start;
          projector->gate_projection_frame_index = 0;
          previous_strip = projector->strip_index.get(first_strip_start);
          previous_strip_frame_offset = previous_strip->frame_count - 1;
        }
      }
      // Move a larger non-Root successor to the right of the current successor.
    } else if (previous_strip_frame_offset + 1 == previous_strip->frame_count &&
               !(previous_strip->next_strip_start == unlinked_strip_start)) {
      const Strip *next_strip =
          projector->strip_index.get(previous_strip->next_strip_start);
      if (compare_sequence_points(&inserted_strip_start,
                                  &next_strip->coordinate.this_strip_start) >
          0) {
        if (is_incoming_strip && next_strip->is_masked == 0)
          projection_frame_offset += next_strip->frame_count;
        previous_strip = next_strip;
        previous_strip_frame_offset = next_strip->frame_count - 1;
      }
    }

    // Materialize every placement that did not prepend directly at the Root.
    if (!inserted_at_root) {
      // Preserve the source before an index write can invalidate its pointer.
      const Strip original_strip = *previous_strip;
      const std::uint32_t insertion_frame_boundary =
          previous_strip_frame_offset + 1;
      const SequencePoint original_next_strip_start =
          original_strip.next_strip_start;

      // Retain the original indexed start as the prefix start.
      Strip prefix_strip = original_strip;
      prefix_strip.frame_count = insertion_frame_boundary;
      prefix_strip.next_strip_start = inserted_strip_start;

      inserted_strip.coordinate.previous_strip_start =
          prefix_strip.coordinate.this_strip_start;
      projector->projection_frame_count += inserted_strip.frame_count;

      SequencePoint replacement_tail_strip_start = inserted_strip_start;
      if (insertion_frame_boundary == original_strip.frame_count) {
        // Append the inserted Strip directly before the original successor.
        inserted_strip.next_strip_start = original_next_strip_start;
        projector->strip_index.set(prefix_strip.coordinate.this_strip_start,
                                   prefix_strip);
        projector->strip_index.set(inserted_strip_start, inserted_strip);
      } else {
        // Materialize the source suffix after an interior insertion.
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

      // Reconnect the original successor or publish the new retained tail.
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
    }

    // Apply the Mask waiting on this newly materialized Strip start.
    SequencePoint append_after_strip_start = inserted_strip_start;
    const Strip *pending_mask =
        projector->pending_masks.get(inserted_strip_start);
    if (pending_mask != nullptr) {
      const Strip pending_mask_copy = *pending_mask;
      projector->pending_masks.remove(inserted_strip_start);

      const Strip *materialized_inserted_strip =
          projector->strip_index.get(inserted_strip_start);
      const std::uint32_t mask_frame_offset = strip_contains_sequence_point(
          materialized_inserted_strip,
          &pending_mask_copy.coordinate.this_strip_start);
      if (mask_frame_offset != sequence_point_outside_strip &&
          pending_mask_copy.frame_count <=
              materialized_inserted_strip->frame_count - mask_frame_offset) {
        if (mask_frame_offset == 0 &&
            pending_mask_copy.frame_count <
                materialized_inserted_strip->frame_count)
          append_after_strip_start.counter_bits +=
              pending_mask_copy.frame_count;
        mask_strip(projector, materialized_inserted_strip, mask_frame_offset,
                   pending_mask_copy);
      }
    }

    // Resolve the next dependent insert without recursion or extra storage.
    const Strip *pending_insert =
        projector->pending_inserts.get(inserted_strip_start);
    if (pending_insert == nullptr)
      return projection_frame_offset;

    inserted_strip = *pending_insert;
    projector->pending_inserts.remove(inserted_strip_start);
    previous_strip = projector->strip_index.get(append_after_strip_start);
    previous_strip_frame_offset = previous_strip->frame_count - 1;
    is_incoming_strip = false;
  }
}
