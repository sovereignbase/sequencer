cmake_minimum_required(VERSION 3.28)

project(
  sequencer_wasm
  VERSION 0.0.0
  DESCRIPTION "C++ WebAssembly scaffold for sequencer."
  LANGUAGES CXX
)

add_executable(sequencer_wasm src/c++/main.cpp)
target_compile_features(sequencer_wasm PRIVATE cxx_std_23)

if(MSVC)
  target_compile_options(sequencer_wasm PRIVATE /W4 /permissive-)
else()
  target_compile_options(sequencer_wasm PRIVATE -Wall -Wextra -Wpedantic)
endif()

if(EMSCRIPTEN)
  set_target_properties(
    sequencer_wasm
    PROPERTIES
      OUTPUT_NAME "sequencer_wasm"
      SUFFIX ".mjs"
  )

  target_compile_options(
    sequencer_wasm
    PRIVATE
      -msimd128
  )

  target_link_options(
    sequencer_wasm
    PRIVATE
      -msimd128
      "-sWASM=1"
      "-sMODULARIZE=1"
      "-sEXPORT_ES6=1"
      "-sENVIRONMENT=web,worker"
      "-sSINGLE_FILE=1"
      "-sWASM_ASYNC_COMPILATION=0"
      "-sALLOW_MEMORY_GROWTH=1"
      "-sFILESYSTEM=0"
      "-sDYNAMIC_EXECUTION=0"
      "-sEXPORTED_RUNTIME_METHODS=['ccall','cwrap','HEAPU32']"
      "--emit-tsd=${CMAKE_CURRENT_BINARY_DIR}/sequencer_wasm.d.mts"
  )
endif()

install(TARGETS sequencer_wasm RUNTIME DESTINATION .)

if(EMSCRIPTEN)
  install(
    FILES "${CMAKE_CURRENT_BINARY_DIR}/sequencer_wasm.d.mts"
    DESTINATION .
  )
endif()