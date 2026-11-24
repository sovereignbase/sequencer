#include "class.hpp"

namespace sequencer {
void Batch::flush() {
  if (!has_pending)
    return;
  writer.append(pending);
  has_pending = false;
}
void Batch::append(const Coordinates &c) {
  if (has_pending && c.extension() && pending.session == c.session &&
      c.start == pending.start + Word(pending.diff) &&
      std::int64_t(pending.diff) + c.diff <= INT32_MAX &&
      (pending.extension()
           ? c.anchor_session == pending.anchor_session && c.anchor_start == pending.anchor_start &&
                 c.anchor_diff == pending.anchor_diff + Word(pending.diff)
           : c.anchor_session == pending.session && c.anchor_start == pending.start &&
                 c.anchor_diff == Word(pending.diff))) {
    pending.diff += c.diff;
    return;
  }
  flush();
  if (c.diff > 0) {
    pending = c;
    has_pending = true;
  } else
    writer.append(c);
}
void Batch::append(const Gossip &gossip) {
  for (const auto &entry : gossip) {
    if (!entry.acknowledgement_count) {
      append(entry.insertion.coordinates);
      continue;
    }
    if (entry.acknowledgement_count == 3 && !acknowledgements.empty()) {
      auto &last = acknowledgements.back();
      if (last.acknowledgement_count == 3 && last.frontier[0] == entry.frontier[0] &&
          last.frontier[1] == entry.frontier[1] && last.frontier[2] && entry.frontier[2]) {
        last.frontier[2] = entry.frontier[2];
        continue;
      }
    }
    acknowledgements.push_back(entry);
  }
}
void Batch::finish(std::vector<std::uint8_t> &prefix) {
  flush();
  writer.finish();
  prefix.clear();
  WordsWriter<> header(prefix);
  header.byte(255);
  header.byte(writer.single_frames ? 5 : 4);
  if (writer.positives > UINT32_MAX / 4)
    throw std::bad_alloc();
  header.uint(writer.positives * 4 + writer.used);
  for (Word sign = 0; sign < 2; ++sign)
    if (writer.used & (Word(1) << sign))
      header.session(sessions[sign]);
  header.uint(Word(acknowledgements.size()));
  for (const auto &entry : acknowledgements) {
    header.uint(entry.acknowledgement_count);
    header.uint(entry.frontier[0]);
    for (Word at = 1; at < entry.acknowledgement_count; at += 2) {
      header.session(entry.frontier[at]);
      header.uint(entry.frontier[at + 1]);
    }
  }
}
} // namespace sequencer
