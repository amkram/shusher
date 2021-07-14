cmake_minimum_required (VERSION 3.8) 

project(shusher)

configure_file(src/version.hpp.in version.hpp)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -Wall -g -Wno-unused-function")
set(CMAKE_INCLUDE_CURRENT_DIR ON) 

if(DEFINED Protobuf_PATH) 
    find_package(Protobuf REQUIRED HINTS ${Protobuf_PATH}) 
else()
    find_package(Protobuf REQUIRED) 
endif()

if(Protobuf_FOUND)
    message(STATUS "Using Protocol Buffers ${Protobuf_VERSION}")
endif()

if(DEFINED TEST_MODE) # don't preload files, allows testing with node
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3 -pthread -s PROXY_TO_PTHREAD=1 -s INITIAL_MEMORY=2147418112 -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1 -s DISABLE_EXCEPTION_CATCHING=1")
    set(CMAKE_EXE_LINKER_FLAGS  "${CMAKE_EXE_LINKER_FLAGS} -pthread -O3 --emrun")
else() # compile for web app
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3 --pre-js ${Pre_JS} -pthread -s PROXY_TO_PTHREAD=1 -s INITIAL_MEMORY=2147418112 -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1 -s DISABLE_EXCEPTION_CATCHING=1  --preload-file preload/${Pre_Reference} --preload-file preload/test_samples.vcf")
    set(CMAKE_EXE_LINKER_FLAGS  "${CMAKE_EXE_LINKER_FLAGS} -pthread -O3")
endif()

set(Boost_USE_STATIC_LIBS ON)
set(Boost_USE_MULTITHREADED OFF)
set(Boost_USE_STATIC_RUNTIME OFF) 

# Include directories for pre-combiled libraries
include_directories(${Boost_INCLUDE_DIR})
include_directories(${TBB_INCLUDE_DIR})
include_directories(${Protobuf_INCLUDE_DIR})

protobuf_generate_cpp(
    PROTO_SRCS PROTO_HDRS
    parsimony.proto)

add_executable(usher
    src/mutation_annotated_tree.cpp
    src/usher_mapper.cpp
    src/usher.cpp
    ${PROTO_SRCS}
    ${PROTO_HDRS}
    )

target_link_libraries(usher PRIVATE stdc++ ${Boost_LIB_IO} ${Boost_LIB_FS} ${Boost_LIB_ZLIB} ${Boost_LIB_PO} ${Protobuf_LIBRARIES} ${TBB_LIB_TBB} ${TBB_LIB_TBBMALLOC} ${TBB_LIB_TBBMALLOC_PROXY} )
