#pragma once

#include <algorithm>
#include <cstddef>
#include <cstdint>

namespace sovereignbase::uuid_map {

namespace detail {

struct actor_slot {
  std::uint32_t key_0;
  std::uint32_t key_1;
  std::uint32_t key_2;
  std::uint32_t *values;
};

struct actor_meta {
  std::size_t capacity;
  std::size_t live;
  std::size_t extent;
};

static_assert(sizeof(actor_slot) == 24);

inline actor_slot *actors = nullptr;
inline actor_meta *metadata = nullptr;
inline std::uint32_t actor_mask = 0;
inline std::uint32_t actor_count = 0;

[[nodiscard]] inline std::uint32_t
hash(std::uint32_t key_0, std::uint32_t key_1, std::uint32_t key_2) noexcept {
  return key_0 ^ key_1 ^ key_2;
}

inline void resize_actors(std::uint32_t capacity) {
  actor_slot *old_actors = actors;
  actor_meta *old_metadata = metadata;
  const std::uint32_t old_capacity = old_actors ? actor_mask + 1 : 0;
  const std::uint32_t next_mask = capacity ? capacity - 1 : 0;

  actor_slot *next_actors = capacity ? new actor_slot[capacity]{} : nullptr;
  actor_meta *next_metadata = nullptr;
  try {
    next_metadata = capacity ? new actor_meta[capacity]{} : nullptr;
  } catch (...) {
    delete[] next_actors;
    throw;
  }

  for (std::uint32_t old = 0; old_actors && old < old_capacity; ++old) {
    if (!old_actors[old].values)
      continue;
    std::uint32_t slot = hash(old_actors[old].key_0, old_actors[old].key_1,
                              old_actors[old].key_2) &
                         next_mask;
    while (next_actors[slot].values)
      slot = (slot + 1) & next_mask;
    next_actors[slot] = old_actors[old];
    next_metadata[slot] = old_metadata[old];
  }

  delete[] old_actors;
  delete[] old_metadata;
  actors = next_actors;
  metadata = next_metadata;
  actor_mask = next_mask;
}

inline void resize_values(actor_slot &actor, actor_meta &meta,
                          std::size_t capacity) {
  const std::size_t words = capacity / 32;
  auto *values = new std::uint32_t[capacity + words]{};
  auto *present = values + capacity;

  if (actor.values) {
    const std::size_t copied = std::min(meta.capacity, capacity);
    std::copy_n(actor.values, copied, values);
    std::copy_n(actor.values + meta.capacity, copied / 32, present);
    delete[] actor.values;
  }

  actor.values = values;
  meta.capacity = capacity;
}

[[nodiscard]] inline std::size_t find(std::uint32_t key_0, std::uint32_t key_1,
                                      std::uint32_t key_2) noexcept {
  const std::size_t mask = actor_mask;
  std::size_t slot = hash(key_0, key_1, key_2) & mask;
  while (actors[slot].values &&
         (actors[slot].key_0 != key_0 || actors[slot].key_1 != key_1 ||
          actors[slot].key_2 != key_2))
    slot = (slot + 1) & mask;
  return slot;
}

inline void erase_actor(std::size_t hole) {
  delete[] actors[hole].values;
  actors[hole] = {};
  metadata[hole] = {};
  --actor_count;

  for (std::size_t slot = (hole + 1) & actor_mask; actors[slot].values;
       slot = (slot + 1) & actor_mask) {
    const std::size_t home =
        hash(actors[slot].key_0, actors[slot].key_1, actors[slot].key_2) &
        actor_mask;
    if (((slot - home) & actor_mask) < ((slot - hole) & actor_mask))
      continue;
    actors[hole] = actors[slot];
    metadata[hole] = metadata[slot];
    actors[slot] = {};
    metadata[slot] = {};
    hole = slot;
  }

  const std::uint32_t capacity = actor_mask + 1;
  if (actor_count == 0)
    resize_actors(0);
  else if (capacity > 16 && actor_count <= capacity / 8)
    resize_actors(capacity / 2);
}

} // namespace detail

// Reading requires a sequence point that has been written and not removed.
[[nodiscard]] inline std::uint32_t read(std::uint32_t actor_0,
                                        std::uint32_t actor_1,
                                        std::uint32_t actor_2,
                                        std::uint32_t local_index) noexcept {
  detail::actor_slot *const actors = detail::actors;
  const std::size_t mask = detail::actor_mask;
  std::size_t slot = detail::hash(actor_0, actor_1, actor_2) & mask;

  while (actors[slot].key_0 != actor_0 || actors[slot].key_1 != actor_1 ||
         actors[slot].key_2 != actor_2)
    slot = (slot + 1) & mask;
  return actors[slot].values[local_index];
}

inline void write(std::uint32_t actor_0, std::uint32_t actor_1,
                  std::uint32_t actor_2, std::uint32_t local_index,
                  std::uint32_t value) {
  const std::size_t index = local_index;

  if (!detail::actors)
    detail::resize_actors(16);
  std::size_t slot = detail::find(actor_0, actor_1, actor_2);
  const bool inserting = !detail::actors[slot].values;

  if (inserting) {
    const std::uint32_t capacity = detail::actor_mask + 1;
    if (detail::actor_count == capacity / 2) {
      detail::resize_actors(capacity * 2);
      slot = detail::find(actor_0, actor_1, actor_2);
    }
    detail::actors[slot].key_0 = actor_0;
    detail::actors[slot].key_1 = actor_1;
    detail::actors[slot].key_2 = actor_2;
  }

  detail::actor_slot &actor = detail::actors[slot];
  detail::actor_meta &meta = detail::metadata[slot];
  if (index < meta.extent && meta.live == meta.extent) {
    actor.values[index] = value;
    return;
  }
  if (index >= meta.capacity) {
    std::size_t capacity = meta.capacity ? meta.capacity : 32;
    while (capacity <= index)
      capacity += std::max<std::size_t>(32, capacity / 2);
    capacity = (capacity + 31) & ~std::size_t{31};
    detail::resize_values(actor, meta, capacity);
  }

  if (inserting)
    ++detail::actor_count;

  std::uint32_t &present = actor.values[meta.capacity + index / 32];
  const std::uint32_t bit = std::uint32_t{1} << (index & 31);
  if (!(present & bit)) {
    present |= bit;
    ++meta.live;
    meta.extent = std::max(meta.extent, index + 1);
  }
  actor.values[index] = value;
}

inline void remove(std::uint32_t actor_0, std::uint32_t actor_1,
                   std::uint32_t actor_2, std::uint32_t local_index) {
  if (!detail::actors)
    return;

  const std::size_t index = local_index;
  const std::size_t slot = detail::find(actor_0, actor_1, actor_2);
  detail::actor_slot &actor = detail::actors[slot];
  detail::actor_meta &meta = detail::metadata[slot];
  if (!actor.values || index >= meta.capacity)
    return;

  std::uint32_t &present = actor.values[meta.capacity + index / 32];
  const std::uint32_t bit = std::uint32_t{1} << (index & 31);
  if (!(present & bit))
    return;
  present &= ~bit;

  if (--meta.live == 0) {
    detail::erase_actor(slot);
    return;
  }

  if (index + 1 == meta.extent) {
    auto *bits = actor.values + meta.capacity;
    std::size_t word = index / 32;
    while (word && bits[word] == 0)
      --word;
    meta.extent = word * 32;
    for (std::uint32_t remaining = bits[word]; remaining; remaining >>= 1)
      ++meta.extent;

    if (meta.capacity > 32 && meta.extent <= meta.capacity / 4) {
      const std::size_t capacity =
          (std::max<std::size_t>(32, meta.extent * 2) + 31) & ~std::size_t{31};
      detail::resize_values(actor, meta, capacity);
    }
  }
}

} // namespace sovereignbase::uuid_map
