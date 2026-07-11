cmake_minimum_required(VERSION 3.28)

project(
  crsequence_wasm
  VERSION 0.1.0
  DESCRIPTION "C++ WebAssembly scaffold for convergent-replicated-sequence"
  LANGUAGES CXX
)

include(FetchContent) 

FetchContent_Declare(
  unordered_dense
  GIT_REPOSITORY https://github.com/martinus/unordered_dense.git
  GIT_TAG v4.8.1
)
FetchContent_MakeAvailable(unordered_dense)

add_executable(crsequence_wasm src/c++/main.cpp)
target_compile_features(crsequence_wasm PRIVATE cxx_std_23)
target_include_directories(crsequence_wasm PRIVATE include src/c++)
target_link_libraries(crsequence_wasm PRIVATE unordered_dense::unordered_dense)

if(MSVC)
  target_compile_options(crsequence_wasm PRIVATE /W4 /permissive-)
else()
  target_compile_options(crsequence_wasm PRIVATE -Wall -Wextra -Wpedantic)
endif()

if(EMSCRIPTEN)
  set_target_properties(
    crsequence_wasm
    PROPERTIES OUTPUT_NAME "crlist_wasm" SUFFIX ".mjs"
  )

  target_link_options(
    crsequence_wasm
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
      "-sEXPORTED_RUNTIME_METHODS=['ccall','cwrap','HEAPU32']"
  )
endif()

install(TARGETS crsequence_wasm RUNTIME DESTINATION .)
