cmake_minimum_required(VERSION 3.28)

project(
  crlist_wasm
  VERSION 0.1.0
  DESCRIPTION "C++ WebAssembly scaffold for convergent-replicated-list"
  LANGUAGES CXX
)

include(FetchContent)

FetchContent_Declare(
  unordered_dense
  GIT_REPOSITORY https://github.com/martinus/unordered_dense.git
  GIT_TAG v4.8.1
)
FetchContent_MakeAvailable(unordered_dense)

add_executable(crlist_wasm src/main.cpp)

target_compile_features(crlist_wasm PRIVATE cxx_std_23)
target_include_directories(crlist_wasm PRIVATE include src)
target_link_libraries(crlist_wasm PRIVATE unordered_dense::unordered_dense)

if(MSVC)
  target_compile_options(crlist_wasm PRIVATE /W4 /permissive-)
else()
  target_compile_options(crlist_wasm PRIVATE -Wall -Wextra -Wpedantic)
endif()

if(EMSCRIPTEN)
  set_target_properties(crlist_wasm PROPERTIES SUFFIX ".mjs")

  target_link_options(
    crlist_wasm
    PRIVATE
      "-sWASM=1"
      "-sMODULARIZE=1"
      "-sEXPORT_ES6=1"
      "-sENVIRONMENT=web,worker"
      "-sSINGLE_FILE=1"
      "-sWASM_ASYNC_COMPILATION=0"
      "-sALLOW_MEMORY_GROWTH=1"
      "-sFILESYSTEM=0"
      "-sDYNAMIC_EXECUTION=0"
      "-sEXPORTED_RUNTIME_METHODS=['ccall','cwrap']"
      "--emit-tsd=${CMAKE_CURRENT_BINARY_DIR}/crlist_wasm.d.mts"
  )

  install(FILES "${CMAKE_CURRENT_BINARY_DIR}/crlist_wasm.d.mts" DESTINATION .)
endif()

install(TARGETS crlist_wasm RUNTIME DESTINATION .)
