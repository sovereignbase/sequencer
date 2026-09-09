#pragma once

#include "./runtime.hpp"
#include "./initialize.hpp"

namespace sequencer {

inline std::uint32_t initialize_projection() noexcept {
  std::uint32_t projection_id;
  if (available_projection_ids.empty()) {
    projection_id = static_cast<std::uint32_t>(projectors.size());
    projectors.emplace_back(std::in_place);
  } else {
    projection_id = available_projection_ids.back();
    available_projection_ids.pop_back();
    projectors[projection_id].emplace();
  }
  // CHECK IF A TRUSTED DELTA WAS PROVIDED
  const auto projection = projection_buffer.read_buffer();
  initialize_projector(*projectors[projection_id], projection,
                       insert_realm_crypto_random_bits,
                       mask_realm_crypto_random_bits,
                       shared_realm_unix_lower_bits);
  return projection_id;
}

inline void
clear_projection(const std::uint32_t projection_id) noexcept {
  // Ignore an already cleared registry slot.
  if (!projectors[projection_id])
    return;

  // Destroy the Projector and publish its reusable identifier.
  projectors[projection_id].reset();
  available_projection_ids.push_back(projection_id);
}

}
