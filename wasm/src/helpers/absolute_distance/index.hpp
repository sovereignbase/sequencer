#include <cstdint>

/**
 * @brief Return the absolute distance between two uint32 indexes.
 *
 * @param left First index.
 * @param right Second index.
 * @return Absolute difference between left and right.
 */
std::uint32_t absolute_distance(std::uint32_t left, std::uint32_t right) {
  // Avoid signed arithmetic; all wasm ABI values are uint32.
  return left > right ? left - right : right - left;
}