cmake_minimum_required(VERSION 3.28)

project(
  sequencer_wasm
  VERSION 0.0.0
  DESCRIPTION "Sequencer WebAssembly runtime."
  LANGUAGES CXX
)

set(SEQUENCER_SOURCES
  src/c++/algorithms/apply.cpp
  src/c++/algorithms/create.cpp
  src/c++/algorithms/insert.cpp
  src/c++/algorithms/merge.cpp
  src/c++/algorithms/remove.cpp
  src/c++/algorithms/replace.cpp
  src/c++/algorithms/sequence.cpp
  src/c++/algorithms/values.cpp
  src/c++/auxiliary/anchorStrip.cpp
  src/c++/auxiliary/extendInsertion.cpp
  src/c++/auxiliary/ownContent.cpp
  src/c++/auxiliary/findContainingFragment.cpp
  src/c++/auxiliary/findFramePositionByProjectionPosition.cpp
  src/c++/auxiliary/findProjectionPositionOfStrip.cpp
  src/c++/auxiliary/insertFirst.cpp
  src/c++/auxiliary/linkJumps.cpp
  src/c++/auxiliary/patchJumps.cpp
  src/c++/auxiliary/selectAnchor.cpp
  src/c++/auxiliary/splitStrip.cpp
  src/c++/auxiliary/subtreeEnd.cpp
)
add_library(sequencer_runtime OBJECT ${SEQUENCER_SOURCES})
target_compile_features(sequencer_runtime PRIVATE cxx_std_23)
add_executable(sequencer_wasm src/c++/bindings.cpp $<TARGET_OBJECTS:sequencer_runtime>)

target_compile_features(sequencer_wasm PRIVATE cxx_std_23)

if(MSVC)
  target_compile_options(sequencer_wasm PRIVATE /W4 /permissive-)
else()
  target_compile_options(sequencer_wasm PRIVATE -Wall -Wextra -Wpedantic)
endif()

if(EMSCRIPTEN)
  target_compile_options(sequencer_runtime PRIVATE -flto -msimd128 -mbulk-memory -fwasm-exceptions -Wall -Wextra -Wpedantic)
  set_target_properties(
    sequencer_wasm
    PROPERTIES
      OUTPUT_NAME "sequencer_wasm"
      SUFFIX ".mjs"
  )

  target_compile_options(
    sequencer_wasm
    PRIVATE
      -flto
      -msimd128
      -mbulk-memory
      -fwasm-exceptions
  )

  target_link_options(
    sequencer_wasm
    PRIVATE
      -flto
      --emit-symbol-map
      -msimd128
      -mbulk-memory
      -fwasm-exceptions
      "-sWASM=1"
      "-sMODULARIZE=1"
      "-sEXPORT_ES6=1"
      "-sENVIRONMENT=web,worker"
      "-sSINGLE_FILE=1"
      "-sWASM_ASYNC_COMPILATION=0"
      "-sALLOW_MEMORY_GROWTH=1"
      "-sINITIAL_MEMORY=1048576"
      "-sFILESYSTEM=0"
      "-sDYNAMIC_EXECUTION=0"
      "-sINCOMING_MODULE_JS_API=[]"
      "-sEXPORTED_RUNTIME_METHODS=['HEAPU32']"
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
