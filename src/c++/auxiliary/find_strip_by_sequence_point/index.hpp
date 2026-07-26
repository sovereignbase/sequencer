#pragma once

#include "../../types/type.hpp"
#include "./index.hpp"
#include <cstdint>
#include <tuple>

// consider narrowing search trough bucketeering by `realm_tag` hash and then
// linear searching trough `realm_count` as here is done for entire sequence
// points.

// Maybe an AoS stored by the realm_tag hash to a table and then binary search
// so structs ordered by realm_count at their point and then another field
// containing the start position in the reel storing the actual strips
std::tuple<std::uint32_t, std::uint32_t>
find_strip_by_sequence_point(ProjectorState *projector,
                             const Uint128 *sequence_point) noexcept {

  const SequenceReel &reel = projector->reel;
  const size_t reel_size = reel.size();
  std::uint32_t index = 0;

  while (index < reel_size) {
    const std::uint32_t result =
        strip_contains_sequence_point(&reel[index], sequence_point);

    if (result != max_uint32) {
      return { result, index }
    }
  }

  return {max_uint32, max_uint32};
}