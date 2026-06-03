#include "crlist_wasm/version.hpp"

#include <cstdint>

extern "C" {

int crlist_version_major() { return crlist_wasm::version_major; }

int crlist_version_minor() { return crlist_wasm::version_minor; }

int crlist_version_patch() { return crlist_wasm::version_patch; }

std::int32_t crlist_add(std::int32_t left, std::int32_t right) {
  return left + right;
}

}

