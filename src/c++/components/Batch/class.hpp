#pragma once
#include "words.hpp"

namespace sequencer {
/** Local operations retained until their replication packet is returned. */
class Batch {
public:
  /** Projection whose existing editing algorithms author these operations. */
  const Word projection;
  /** Author Sessions shared by all coordinates in this callback scope. */
  const std::array<Word, 2> sessions;
  /** Coordinate stream; Footage remains in JavaScript. */
  std::vector<std::uint8_t> bytes;

private:
  BatchWriter writer;
  Coordinates pending;
  bool has_pending{};
  Gossip acknowledgements;
  void flush();

public:
  Batch(Word projection, Word increasing, Word decreasing)
      : projection(projection), sessions{increasing, decreasing}, writer(bytes, sessions) {}
  /** Retains a canonical operation, joining only consecutive positive extensions. */
  void append(const Coordinates &coordinates);
  /** Retains authored operations and their ordered acknowledgement reports. */
  void append(const Gossip &gossip);
  /** Whether no operation or acknowledgement was authored. */
  bool empty() const { return !has_pending && !writer.count && acknowledgements.empty(); }
  /** Finishes coordinates and writes the independent packet prefix. */
  void finish(std::vector<std::uint8_t> &prefix);
};
} // namespace sequencer
