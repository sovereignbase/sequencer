
#include <cstdint>

#include "./types/type.hpp"

#include "./helpers/index.cpp"



extern "C" {
std::int32_t size(std::int32_t a, std::int32_t b, std::int32_t c, std::int32_t d) {
  return find_instance_by_id(a,b,c,d)->size;
}

std::int32_t js_reference_of(std::int32_t index, std::int32_t a, std::int32_t b, std::int32_t c, std::int32_t d ) {
  State* instance = find_instance_by_id(a, b, c, d);
   seek_current_to_target(index, instance);
   return instance->current->js_reference;
}

void add_block_after(std::int32_t index, std::int32_t length, std::int32_t a, std::int32_t b, std::int32_t c, std::int32_t d) {
  State* instance = find_instance_by_id(a, b, c, d);
   seek_current_to_target(index, instance);

      const Block* current = instance->current;
   const Block* next = current->next;

   const Block target = {
    length,

   };


  

}

void add_block_after(std::int32_t index, std::int32_t length, std::int32_t a, std::int32_t b, std::int32_t c, std::int32_t d) {
  State* instance = find_instance_by_id(a, b, c, d);
   seek_current_to_target(index, instance);
return;
}
}


