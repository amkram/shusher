
cmake_minimum_required (VERSION 3.8) 

project(usher VERSION 0.3.1)

configure_file(src/version.hpp.in version.hpp)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -Wall -g -Wno-unused-function")
set(CMAKE_INCLUDE_CURRENT_DIR ON) 

# file(GLOB MATUTIL_SRCS "src/matUtils/*.cpp" "src/matUtils/*.hpp")
# file(GLOB MATOPTIMIZE_SRCS "src/matOptimize/*.cpp" "src/matOptimize/*.hpp")

if(DEFINED Protobuf_PATH) 
    find_package(Protobuf REQUIRED HINTS ${Protobuf_PATH}) 
else()
    find_package(Protobuf REQUIRED) 
endif()

# Print version messages
if(Protobuf_FOUND)
    message(STATUS "Using Protocol Buffers ${Protobuf_VERSION}")
endif()

if(NOT DEFINED EMSCRIPTEN) # compile normally

    include_directories(${Protobuf_INCLUDE_DIR})

    include(${TBB_DIR}/cmake/TBBBuild.cmake)
    tbb_build(TBB_ROOT ${TBB_DIR} CONFIG_DIR TBB_DIR MAKE_ARGS tbb_cpf=1)
    find_package(TBB REQUIRED tbbmalloc tbbmalloc_proxy tbb_preview)

    FIND_PACKAGE(Boost COMPONENTS program_options iostreams filesystem REQUIRED)

    #find_package(OpenMP REQUIRED)

    INCLUDE_DIRECTORIES(${Boost_INCLUDE_DIR})


    if(DEFINED Protobuf_PATH)
        add_executable(usher
            src/mutation_annotated_tree.cpp
            src/usher_mapper.cpp
            src/usher.cpp
            )

        # add_executable(matUtils
        #     src/mutation_annotated_tree.cpp
        #     src/usher_mapper.cpp
        #     ${MATUTIL_SRCS}
        #     )

        # add_executable(matOptimize
        #     src/mutation_annotated_tree.cpp
        #     src/usher_mapper.cpp
        #     ${MATOPTIMIZE_SRCS}
        #     )

        protobuf_generate(
            LANGUAGE cpp
            TARGET usher 
            PROTOS parsimony.proto)

        # protobuf_generate(
        #     LANGUAGE cpp
        #     TARGET matUtils
        #     PROTOS parsimony.proto)
        
        # protobuf_generate(
        #     LANGUAGE cpp
        #     TARGET matOptimize
        #     PROTOS parsimony.proto)
    else()
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

        # add_executable(matUtils
        #     src/mutation_annotated_tree.cpp
        #     src/usher_mapper.cpp
        #     ${MATUTIL_SRCS}
        #     ${PROTO_SRCS}
        #     ${PROTO_HDRS}
        #     )

        # add_executable(matOptimize
        #     src/mutation_annotated_tree.cpp
        #     src/usher_mapper.cpp
        #     ${MATOPTIMIZE_SRCS}
        #     ${PROTO_SRCS}
        #     ${PROTO_HDRS}
            # )
    endif()

    if(SAVE_PROFILE)
        if(DEBUG)
            TARGET_COMPILE_OPTIONS(usher PRIVATE -DTBB_SUPPRESS_DEPRECATED_MESSAGES -DSAVE_PROFILE=1 -DDEBUG=1)
        else(DEBUG)
            TARGET_COMPILE_OPTIONS(usher PRIVATE -DTBB_SUPPRESS_DEPRECATED_MESSAGES -DSAVE_PROFILE=1)
        endif(DEBUG)
    else(SAVE_PROFILE)
        if(DEBUG)
            TARGET_COMPILE_OPTIONS(usher PRIVATE -DTBB_SUPPRESS_DEPRECATED_MESSAGES -DDEBUG=1)
        else(DEBUG)
            TARGET_COMPILE_OPTIONS(usher PRIVATE -DTBB_SUPPRESS_DEPRECATED_MESSAGES)
        endif(DEBUG)
    endif(SAVE_PROFILE)

    TARGET_LINK_LIBRARIES(usher PRIVATE stdc++  ${Boost_LIBRARIES} ${TBB_IMPORTED_TARGETS} ${Protobuf_LIBRARIES}) # OpenMP::OpenMP_CXX)

    # TARGET_COMPILE_OPTIONS(matUtils PRIVATE -DTBB_SUPPRESS_DEPRECATED_MESSAGES)
    # TARGET_LINK_LIBRARIES(matUtils PRIVATE stdc++  ${Boost_LIBRARIES} ${TBB_IMPORTED_TARGETS} ${Protobuf_LIBRARIES}) # OpenMP::OpenMP_CXX)

    # TARGET_COMPILE_OPTIONS(matOptimize PRIVATE -DTBB_SUPPRESS_DEPRECATED_MESSAGES)
    # TARGET_LINK_LIBRARIES(matOptimize PRIVATE stdc++  ${Boost_LIBRARIES} ${TBB_IMPORTED_TARGETS} ${Protobuf_LIBRARIES}) # OpenMP::OpenMP_CXX)
else() # compile to wasm

	set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3 --pre-js ${Pre_JS} -pthread -s PROXY_TO_PTHREAD=1 -s INITIAL_MEMORY=2147418112 -s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1 -s DISABLE_EXCEPTION_CATCHING=1  --preload-file preload/${Pre_Reference} --preload-file preload/filtered_6K.pb --preload-file preload/new_samples_preload.vcf --preload-file preload/zika.json --preload-file preload/filtered_7M.pb --preload-file preload/test_samples.vcf")
    set(CMAKE_EXE_LINKER_FLAGS  "${CMAKE_EXE_LINKER_FLAGS} -pthread -O3")
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

    # add_executable(matUtils
    #     src/mutation_annotated_tree.cpp
    #     src/usher_mapper.cpp
    #     ${MATUTIL_SRCS}
    #     ${PROTO_SRCS}
    #     ${PROTO_HDRS}
    #     )

    # add_executable(matOptimize
    #     src/mutation_annotated_tree.cpp
    #     src/usher_mapper.cpp
    #     ${MATOPTIMIZE_SRCS}
    #     ${PROTO_SRCS}
    #     ${PROTO_HDRS}
    #     )

    if(SAVE_PROFILE)
        if(DEBUG)
            TARGET_COMPILE_OPTIONS(usher PRIVATE  -DSAVE_PROFILE=1 -DDEBUG=1)
        else(DEBUG)
            TARGET_COMPILE_OPTIONS(usher PRIVATE  -DSAVE_PROFILE=1)
        endif(DEBUG)
    else(SAVE_PROFILE)
        if(DEBUG)
            TARGET_COMPILE_OPTIONS(usher PRIVATE  -DDEBUG=1)
        else(DEBUG)
            TARGET_COMPILE_OPTIONS(usher PRIVATE)
        endif(DEBUG)
    endif(SAVE_PROFILE)

    target_link_libraries(usher PRIVATE stdc++ ${Boost_LIB_IO} ${Boost_LIB_FS} ${Boost_LIB_ZLIB} ${Boost_LIB_PO} ${Protobuf_LIBRARIES} ${TBB_LIB_TBB} ${TBB_LIB_TBBMALLOC} ${TBB_LIB_TBBMALLOC_PROXY} )
endif()
