#pragma once
#include "../../.declarations/projector/index.hpp"
#include <boost/endian/arithmetic.hpp>
#include <cmath>
#include <cstdint>

[[nodiscard]] inline boost::endian::little_uint24_t
find_projection_frame_index_of(
    Projector &projector,
    boost::endian::little_uint24_t &strip_index) noexcept {
  // CACHE
  const boost::endian::little_uint24_t projection_frame_count =
      projector.projection_frame_count;
  // ITER
  boost::endian::little_uint24_t left_cursor =
      projector.left_strip_index_of[strip_index];
  boost::endian::little_uint24_t right_cursor =
      projector.right_strip_index_of[strip_index];
  boost::endian::little_uint24_t left_distance =
      projector.strip_length_of[left_cursor];
  boost::endian::little_uint24_t right_distance =
      strip_length + projector.strip_length_of[right_cursor];
  // OPTIMIZER
  const boost::endian::little_uint24_t optimal_jump_distance =
      static_cast<boost::endian::little_uint24_t>(
          std::sqrt(projection_frame_count) + 0.5);
  boost::endian::little_uint24_t left_jump_interval_distance = 0;
  boost::endian::little_uint24_t right_jump_interval_distance = 0;
  // RUN
  while (true) {
    // CHECK IF LEFT IS AT HEAD
    const boost::endian::little_uint24_t next_left_cursor =
        projector.left_strip_index_of[strip_index];
    if (next_left_cursor == u24_max)
      return left_distance;

    // CHECK IF RIGHT IS AT TAIL
    const boost::endian::little_uint24_t next_right_cursor =
        projector.right_strip_index_of[strip_index];
    if (next_right_cursor == u24_max)
      return projection_frame_count - right_distance - 1;

    // USE LEFT JUMP IF AVAILABLE
    const boost::endian::little_uint24_t left_jump_strip_index =
        projector.left_jump_strip_index_of[left_cursor];
    if (left_jump_strip_index != u24_max) {
      left_cursor = left_jump_strip_index;
      const boost::endian::little_uint24_t left_jump_length =
          projector.left_jump_length_of[left_cursor];
      left_distance += left_jump_length;
      left_jump_interval_distance += left_jump_interval_distance;
      // REMOVE A JUMP INDEX FROM BETWEEN TO INCREASE DISTANCE TOWARDS OPTIMAL
      if (optimal_jump_distance > left_jump_interval_distance) {
        projector.left_jump_strip_index_of[left_cursor] = u24_max;
        projector.right_jump_strip_index_of[left_cursor] =
            left_jump_strip_index;
      } else {
        // START NEW INTERVAL
        left_jump_interval_distance =
            left_jump_interval_distance - optimal_jump_distance;
      }
    } else {
      left_cursor = next_left_cursor;
    }

    // USE RIGHT JUMP IF AVAILABLE
    const boost::endian::little_uint24_t right_jump_strip_index =
        projector.right_jump_strip_index_of[right_cursor];
    if (right_jump_strip_index != u24_max) {
      right_cursor = right_jump_strip_index;
      const boost::endian::little_uint24_t right_jump_length =
          projector.right_jump_length_of[right_cursor];
      right_distance += right_jump_length;
      right_jump_interval_distance += right_jump_interval_distance;
      // REMOVE A JUMP INDEX FROM BETWEEN TO INCREASE DISTANCE TOWARDS OPTIMAL
      if (optimal_jump_distance > right_jump_interval_distance) {
        projector.right_jump_strip_index_of[right_cursor] = u24_max;
        projector.right_jump_strip_index_of[right_cursor] =
            right_jump_strip_index;
      } else {
        // START NEW INTERVAL
        right_jump_interval_distance =
            right_jump_interval_distance - optimal_jump_distance;
      }
    } else {
      right_cursor = next_right_cursor;
    }
  }
}