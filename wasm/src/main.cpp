#include "crlist_wasm/version.hpp"

#include <cstdint>

#include "unordered_map"

extern "C" {

int crlist_version_major() { return crlist_wasm::version_major; }

int crlist_version_minor() { return crlist_wasm::version_minor; }

int crlist_version_patch() { return crlist_wasm::version_patch; }

std::int32_t crlist_add(std::int32_t left, std::int32_t right) {
  return left + right;
}

void overwrite(){
  return;
}

void merge(std::int32_t a,std::int32_t b,std::int32_t c,std::int32_t d,std::int32_t length) {

return;
}
}


