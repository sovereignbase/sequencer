#pragma once

#include "../.buffers/footage_span_buffer/index.hpp"
#include "../.buffers/projection_buffer/index.hpp"
#include "../.buffers/sequence_point_buffer/index.hpp"
#include "../.declarations/projector/index.hpp"
#include <cstdint>
#include <optional>
#include <vector>

namespace sequencer {

/** @brief Registry slots containing the Projector of each active Replica. */
inline std::vector<std::optional<Projector>> projectors;

/** @brief Cleared registry identifiers available for immediate reuse. */
inline std::vector<std::uint32_t> available_projection_ids;

/** @brief Shared result buffer for ordered or released Footage spans. */
inline FootageSpanBuffer footage_span_buffer;

/** @brief Shared dense snapshot in resolved projection order. */
inline ProjectionBuffer projection_buffer;

/** @brief Shared variable-width transfer buffer for one Frontier. */
inline SequencePointBuffer sequence_point_buffer;
} // namespace sequencer
