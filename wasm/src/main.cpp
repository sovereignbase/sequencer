
#include <cstdint>

#include "./types/type.hpp"

#include "./helpers/index.cpp"



extern "C" {
std::int32_t read(std::int32_t index, std::int32_t a, std::int32_t b, std::int32_t c, std::int32_t d ) {
  State* instance = find_instance_by_id(a, b, c, d);
   seek_current_to_target(index, instance);
   return instance->index;
}

std::int32_t size(std::int32_t a, std::int32_t b, std::int32_t c, std::int32_t d) {
  return find_instance_by_id(a,b,c,d)->size;
}
}
