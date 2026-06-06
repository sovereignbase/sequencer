
#include <cstdint>

#include "./types/type.hpp"

#include "./helpers/index.hpp"

#include <emscripten/emscripten.h>

extern "C" {
EMSCRIPTEN_KEEPALIVE
/**
 * @param thisA First part of uuidV7 presented as 32bit unsinged integer.
 * @param thisB Second part of uuidV7 presented as 32bit unsinged integer.
 * @param thisC Third part of uuidV7 presented as 32bit unsinged integer.
 * @param thisD Fourth part of uuidV7 presented as 32bit unsinged integer.
 * @returns Nothing after adding the instances state object to a map.
 */
void add_instance(std::uint32_t thisA, std::uint32_t thisB, std::uint32_t thisC,
                  std::uint32_t thisD) {
  instances.insert({Key{thisA, thisB, thisC, thisD},
                    State{
                        0,       // size
                        0,       // index
                        nullptr, // first
                        nullptr, // current
                        nullptr  // last
                    }});
}
void add_range(std::uint32_t thisA, std::uint32_t thisB, std::uint32_t thisC,
               std::uint32_t thisD, std::uint32_t rangeA, std::uint32_t rangeB,
               std::uint32_t rangeC, std::uint32_t rangeD,
               std::uint32_t previousA, std::uint32_t previousB,
               std::uint32_t previousC, std::uint32_t previousD,
               std::uint32_t length) {
  State *instance = find_instance_by_id(thisA, thisB, thisC, thisD);

  const Range range = {
    this_id : {a : rangeA, b : rangeB, c : rangeC, d : rangeD},
    previous_id : {a : previousA, b : previousB, c : previousC, d : previousD},
    range_length : length
  };

  if (!instance->current) {
  }
}

EMSCRIPTEN_KEEPALIVE
/**
 * @param thisA First part of uuidV7 presented as 32bit unsinged integer.
 * @param thisB Second part of uuidV7 presented as 32bit unsinged integer.
 * @param thisC Third part of uuidV7 presented as 32bit unsinged integer.
 * @param thisD Fourth part of uuidV7 presented as 32bit unsinged integer.
 * @returns Amount of non-deleted entries.
 */
std::uint32_t size(std::uint32_t thisA, std::uint32_t thisB,
                   std::uint32_t thisC, std::uint32_t thisD) {
  return find_instance_by_id(thisA, thisB, thisC, thisD)->size;
}

EMSCRIPTEN_KEEPALIVE
/**
 * @param thisA First part of uuidV7 presented as 32bit unsinged integer.
 * @param thisB Second part of uuidV7 presented as 32bit unsinged integer.
 * @param thisC Third part of uuidV7 presented as 32bit unsinged integer.
 * @param thisD Fourth part of uuidV7 presented as 32bit unsinged integer.
 * @returns Number correlating to a index of an array a consumer holds.
 */
std::uint32_t consumer_reference_of(std::uint32_t index, std::uint32_t a,
                                    std::uint32_t b, std::uint32_t c,
                                    std::uint32_t d) {
  State *instance = find_instance_by_id(a, b, c, d);
  walk_to_target_range(index, instance);
  return instance->current->consmer_reference +
         distance_of_numbers(instance->index, instance->current->range_length);
}
EMSCRIPTEN_KEEPALIVE
void insert(std::uint32_t index, std::uint32_t length, std::uint32_t thisA,
            std::uint32_t thisB, std::uint32_t thisC, std::uint32_t thisD) {
  State *instance = find_instance_by_id(thisA, thisB, thisC, thisD);
  walk_to_target_range(index, instance);
  return;
}
EMSCRIPTEN_KEEPALIVE
void remove(std::uint32_t index, std::uint32_t length, std::uint32_t thisA,
            std::uint32_t thisB, std::uint32_t thisC, std::uint32_t thisD) {
  State *instance = find_instance_by_id(thisA, thisB, thisC, thisD);
  walk_to_target_range(index, instance);
  return;
}
}
