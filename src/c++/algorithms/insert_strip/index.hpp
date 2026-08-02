/**
 * @file
 * @brief Integrates one visible Strip into deterministic retained order.
 *
 * The immutable Sequence Coordinate supplies logical parentage and sibling
 * order. Separate runtime links materialize the resulting depth-first order.
 */
#pragma once

#include "../../auxiliary/compare_sequence_points/index.hpp"
#include "../../auxiliary/run_projector_to_sequence_point/index.hpp"
#include "../../auxiliary/strip_contains_sequence_point/index.hpp"
#include "../../declarations/projector/index.hpp"
#include "../mask_strip/index.hpp"
#include <cstdint>
#include <utility>
#include <variant>

/**
 * @brief Insert a visible Strip after its logical parent Frame.
 *
 * Root siblings are ordered by descending start point; non-Root siblings by
 * ascending start point. An existing sibling's complete descendant subtree is
 * crossed as one unit.
 *
 * Interior insertion retains the source prefix and materializes its suffix.
 * Every material fragment keeps a logical coordinate; mutable retained order
 * is represented only by `previous_structural_strip_start` and
 * `next_strip_start`.
 *
 * Once the Strip is materialized, pending inserts depending on any point in
 * its Frame Span are integrated recursively. Pending Masks over those points
 * are applied only after the inserts, so masking follows the logical Frame axis
 * across any newly created structural splits.
 *
 * @param projector Projector receiving the Strip.
 * @param previous_strip Strip containing the non-Root logical parent, or null
 * for Root.
 * @param previous_strip_frame_offset Parent Frame offset; ignored for Root.
 * @param inserted_strip Visible Strip with an immutable logical coordinate.
 * @return Visible Frames crossed before the incoming Strip's placement.
 * @pre `projector` is non-null and `inserted_strip.is_masked == 0`.
 * @complexity O(s^2 + f log p) worst-case time and O(1) auxiliary space, where
 * s is retained Strip count, f is the inserted Frame count, and p is pending
 * Realm size. Typical append placement is O(1).
 */
[[nodiscard]] inline std::uint32_t
insert_strip(Projector *projector, const Strip *previous_strip,
             std::uint32_t previous_strip_frame_offset,
             Strip inserted_strip) noexcept {
  const SequencePoint root{};
  const SequencePoint inserted_strip_start =
      inserted_strip.coordinate.this_strip_start;
  const SequencePoint logical_parent =
      inserted_strip.coordinate.previous_strip_start;
  const std::uint32_t inserted_frame_count = inserted_strip.frame_count;
  const std::uint32_t insertion_projection_frame_index =
      logical_parent == root
          ? 0
          : projector->gate_projection_frame_index +
                (previous_strip->is_masked == 0
                     ? previous_strip_frame_offset + 1
                     : 0);
  std::uint32_t projection_frame_offset = 0;

  // Preserve direct counter-to-Projection mapping only for a contiguous tail.
  const bool was_empty = projector->strip_index.is_empty();
  projector->is_projection_linear =
      was_empty ||
      (projector->is_projection_linear && previous_strip != nullptr &&
       previous_strip->is_masked == 0 &&
       previous_strip_frame_offset + 1 == previous_strip->frame_count &&
       previous_strip->next_strip_start == unlinked_strip_start &&
       inserted_strip_start.unix_lower_bits ==
           projector->first_strip_start.unix_lower_bits &&
       inserted_strip_start.random_bits ==
           projector->first_strip_start.random_bits &&
       inserted_strip_start.counter_bits ==
           projector->first_strip_start.counter_bits +
               projector->projection_frame_count);

  const auto immediately_follows = [](const SequencePoint &point,
                                      const SequencePoint &previous) noexcept {
    return point.unix_lower_bits == previous.unix_lower_bits &&
           point.random_bits == previous.random_bits &&
           point.counter_bits > previous.counter_bits &&
           point.counter_bits - previous.counter_bits == 1;
  };

  // Test ancestry by following immutable logical parents while locating each
  // parent through the already materialized structural chain.
  const auto descends_from =
      [projector, &root](const Strip *strip,
                         const SequencePoint &ancestor) noexcept {
        SequencePoint parent = strip->coordinate.previous_strip_start;
        SequencePoint structural_start =
            strip->previous_structural_strip_start;

        while (!(parent == root)) {
          if (parent == ancestor)
            return true;

          const Strip *containing_strip = nullptr;
          while (!(structural_start == root)) {
            const Strip *candidate =
                projector->strip_index.get(structural_start);
            if (strip_contains_sequence_point(candidate, &parent) !=
                sequence_point_outside_strip) {
              containing_strip = candidate;
              break;
            }
            structural_start = candidate->previous_structural_strip_start;
          }
          if (containing_strip == nullptr)
            return false;

          const SequencePoint &containing_start =
              containing_strip->coordinate.this_strip_start;
          if (ancestor.unix_lower_bits == containing_start.unix_lower_bits &&
              ancestor.random_bits == containing_start.random_bits &&
              ancestor.counter_bits >= containing_start.counter_bits &&
              ancestor.counter_bits <= parent.counter_bits &&
              ancestor.counter_bits - containing_start.counter_bits <
                  containing_strip->frame_count)
            return true;

          parent = containing_strip->coordinate.previous_strip_start;
          structural_start =
              containing_strip->previous_structural_strip_start;
        }
        return false;
      };

  // Select the structural predecessor while comparing only logical siblings.
  const bool follows_root = logical_parent == root;
  const Strip *placement_strip = previous_strip;
  std::uint32_t placement_frame_offset = previous_strip_frame_offset;

  if (follows_root) {
    if (projector->strip_index.is_empty()) {
      inserted_strip.previous_structural_strip_start = root;
      inserted_strip.next_strip_start = unlinked_strip_start;
      projector->strip_index.set(inserted_strip_start, inserted_strip);
      projector->first_strip_start = inserted_strip_start;
      projector->gate_strip_start = inserted_strip_start;
      projector->last_strip_start = inserted_strip_start;
      projector->gate_projection_frame_index = 0;
      projector->projection_frame_count += inserted_frame_count;
      placement_strip = nullptr;
    } else {
      const Strip *current_strip =
          projector->strip_index.get(projector->first_strip_start);
      const Strip *structural_predecessor = nullptr;

      // Compare only Root siblings; their children are already to their right.
      while (current_strip != nullptr) {
        if (current_strip->coordinate.previous_strip_start == root &&
            compare_sequence_points(
                &inserted_strip_start,
                &current_strip->coordinate.this_strip_start) > 0)
          break;

        structural_predecessor = current_strip;
        if (current_strip->is_masked == 0)
          projection_frame_offset += current_strip->frame_count;
        current_strip =
            current_strip->next_strip_start == unlinked_strip_start
                ? nullptr
                : projector->strip_index.get(current_strip->next_strip_start);
      }

      if (structural_predecessor == nullptr) {
        Strip first_strip =
            *projector->strip_index.get(projector->first_strip_start);
        inserted_strip.previous_structural_strip_start = root;
        inserted_strip.next_strip_start =
            first_strip.coordinate.this_strip_start;
        first_strip.previous_structural_strip_start = inserted_strip_start;
        projector->strip_index.set(inserted_strip_start, inserted_strip);
        projector->strip_index.set(first_strip.coordinate.this_strip_start,
                                   first_strip);
        projector->first_strip_start = inserted_strip_start;
        projector->gate_strip_start = inserted_strip_start;
        projector->gate_projection_frame_index = 0;
        projector->projection_frame_count += inserted_frame_count;
        placement_strip = nullptr;
      } else {
        placement_strip = structural_predecessor;
        placement_frame_offset = placement_strip->frame_count - 1;
      }
    }
  } else if (previous_strip_frame_offset + 1 ==
             previous_strip->frame_count) {
    const Strip *sibling =
        previous_strip->next_strip_start == unlinked_strip_start
            ? nullptr
            : projector->strip_index.get(previous_strip->next_strip_start);

    while (sibling != nullptr) {
      const SequencePoint &sibling_start =
          sibling->coordinate.this_strip_start;
      SequencePoint masked_source_successor =
          previous_strip->coordinate.this_strip_start;
      masked_source_successor.counter_bits += previous_strip->frame_count;
      const bool is_fragment_boundary =
          (sibling->is_masked & mask_is_source_continuation) != 0 ||
          ((previous_strip->is_masked & mask_has_source_successor) != 0 &&
           sibling_start == masked_source_successor) ||
          (immediately_follows(sibling_start, logical_parent) &&
           !(sibling->previous_structural_strip_start ==
             previous_strip->coordinate.this_strip_start));
      if (is_fragment_boundary ||
          !(sibling->coordinate.previous_strip_start == logical_parent) ||
          compare_sequence_points(&inserted_strip_start, &sibling_start) <= 0)
        break;

      const SequencePoint sibling_subtree_start = sibling_start;
      const Strip *subtree_tail = sibling;
      if (subtree_tail->is_masked == 0)
        projection_frame_offset += subtree_tail->frame_count;

      while (!(subtree_tail->next_strip_start == unlinked_strip_start)) {
        const Strip *next_strip =
            projector->strip_index.get(subtree_tail->next_strip_start);
        if (!descends_from(next_strip, sibling_subtree_start))
          break;
        subtree_tail = next_strip;
        if (subtree_tail->is_masked == 0)
          projection_frame_offset += subtree_tail->frame_count;
      }

      placement_strip = subtree_tail;
      placement_frame_offset = subtree_tail->frame_count - 1;
      sibling = subtree_tail->next_strip_start == unlinked_strip_start
                    ? nullptr
                    : projector->strip_index.get(
                          subtree_tail->next_strip_start);
    }
  }

  // Materialize every placement not already written as a Root prepend.
  if (placement_strip != nullptr) {
    const Strip original_strip = *placement_strip;
    const std::uint32_t insertion_boundary = placement_frame_offset + 1;
    const SequencePoint original_next_strip_start =
        original_strip.next_strip_start;

    Strip prefix_strip = original_strip;
    prefix_strip.frame_count = insertion_boundary;
    prefix_strip.next_strip_start = inserted_strip_start;
    prefix_strip.is_masked &= ~mask_has_source_successor;

    inserted_strip.previous_structural_strip_start =
        prefix_strip.coordinate.this_strip_start;
    SequencePoint replacement_tail_strip_start = inserted_strip_start;

    if (insertion_boundary == original_strip.frame_count) {
      inserted_strip.next_strip_start = original_next_strip_start;
      projector->strip_index.set(prefix_strip.coordinate.this_strip_start,
                                 prefix_strip);
      projector->strip_index.set(inserted_strip_start, inserted_strip);
    } else {
      SequencePoint suffix_strip_start =
          original_strip.coordinate.this_strip_start;
      suffix_strip_start.counter_bits += insertion_boundary;
      Strip suffix_strip = original_strip;
      if (suffix_strip.is_masked != 0)
        suffix_strip.is_masked |= mask_is_source_continuation;
      suffix_strip.frame_count -= insertion_boundary;
      suffix_strip.footage_frame_index += insertion_boundary;
      suffix_strip.coordinate = {
          .this_strip_start = suffix_strip_start,
          .previous_strip_start =
              original_strip.is_masked != 0
                  ? original_strip.coordinate.previous_strip_start
                  : logical_parent,
      };
      suffix_strip.previous_structural_strip_start = inserted_strip_start;

      inserted_strip.next_strip_start = suffix_strip_start;
      replacement_tail_strip_start = suffix_strip_start;
      projector->strip_index.set(prefix_strip.coordinate.this_strip_start,
                                 prefix_strip);
      projector->strip_index.set(inserted_strip_start, inserted_strip);
      projector->strip_index.set(suffix_strip_start, suffix_strip);
    }

    if (!(original_next_strip_start == unlinked_strip_start)) {
      Strip next_strip =
          *projector->strip_index.get(original_next_strip_start);
      next_strip.previous_structural_strip_start =
          replacement_tail_strip_start;
      projector->strip_index.set(original_next_strip_start, next_strip);
    } else {
      projector->last_strip_start = replacement_tail_strip_start;
    }
    projector->projection_frame_count += inserted_frame_count;
  }

  // Keep the locality Gate exact before resolving dependent operations.
  projector->gate_strip_start = inserted_strip_start;
  projector->gate_projection_frame_index =
      insertion_projection_frame_index + projection_frame_offset;

  // Resolve every pending visible dependency in the new logical Frame Span.
  SequencePoint dependency = inserted_strip_start;
  for (std::uint32_t frame_offset = 0; frame_offset < inserted_frame_count;
       ++frame_offset, ++dependency.counter_bits) {
    while (const Strip *pending_insert =
               projector->pending_inserts.get(dependency)) {
      const Strip pending_insert_copy = *pending_insert;
      projector->pending_inserts.remove(dependency);
      if (projector->strip_index.get(
              pending_insert_copy.coordinate.this_strip_start) != nullptr)
        continue;

      const auto parent_result =
          run_projector_to_sequence_point(projector, &dependency);
      if (std::holds_alternative<bool>(parent_result))
        continue;
      const auto [parent_strip, parent_frame_offset] =
          std::get<0>(parent_result);
      static_cast<void>(insert_strip(projector, parent_strip,
                                     parent_frame_offset,
                                     pending_insert_copy));
    }
  }

  // Apply pending Masks only after all visible descendants have materialized.
  dependency = inserted_strip_start;
  for (std::uint32_t frame_offset = 0; frame_offset < inserted_frame_count;
       ++frame_offset, ++dependency.counter_bits) {
    while (const Strip *pending_mask =
               projector->pending_masks.get(dependency)) {
      const Strip pending_mask_copy = *pending_mask;
      projector->pending_masks.remove(dependency);
      const auto mask_start_result = run_projector_to_sequence_point(
          projector, &pending_mask_copy.coordinate.this_strip_start);
      if (std::holds_alternative<bool>(mask_start_result))
        continue;
      const auto [containing_strip, mask_frame_offset] =
          std::get<0>(mask_start_result);
      mask_strip(projector, containing_strip, mask_frame_offset,
                 pending_mask_copy);
    }
  }

  return projection_frame_offset;
}
