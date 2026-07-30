#pragma once

// 36 byte crdt meta for projection
alignas(36) static std::uint32_t strip_buffer[9];

inline void write_to_strip_buffer(SequenceStrip strip) noexcept {
  strip_buffer[0] = static_cast<std::uint32_t>(strip >> 96);
  strip_buffer[1] = static_cast<std::uint32_t>(strip >> 64);
  strip_buffer[2] = static_cast<std::uint32_t>(strip >> 32);
  strip_buffer[3] = static_cast<std::uint32_t>(strip);
}

[[nodiscard]] inline SequenceStrip read_from_strip_buffer() noexcept {
  return (static_cast<SequenceStrip>(strip_buffer[0]) << 96) |
         (static_cast<SequenceStrip>(strip_buffer[1]) << 64) |
         (static_cast<SequenceStrip>(strip_buffer[2]) << 32) |
         static_cast<SequenceStrip>(strip_buffer[3]);
}