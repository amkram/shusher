#!/bin/bash

reference_file_name='GCF_009858895.2_ASM985889v3_genomic.fna'

rm -rf build
rm -rf web-lib
mkdir -p web-lib && cd web-lib

# get Emscripten
wget https://github.com/emscripten-core/emsdk/archive/refs/tags/3.1.7.tar.gz
tar xzf 3.1.7.tar.gz
cd emsdk-3.1.7
./emsdk install 3.1.7
./emsdk activate 3.1.7
source emsdk_env.sh
cd ..

# Boost + zlib
wget https://boostorg.jfrog.io/artifactory/main/release/1.76.0/source/boost_1_76_0.tar.gz
wget https://zlib.net/fossils/zlib-1.2.11.tar.gz
tar xzf boost_1_76_0.tar.gz
tar xzf zlib-1.2.11.tar.gz
zlib_path=$(readlink -f zlib-1.2.11)
cd boost_1_76_0
boost_includes=$(readlink -f .)
./bootstrap.sh
printf '\nimport generators ;\ngenerators.override emscripten.searched-lib-generator : searched-lib-generator ;' \
	>> tools/build/src/tools/emscripten.jam # bug-fix
./b2 -a toolset=emscripten link=static threading=multi --with-filesystem \
	--with-program_options --with-iostreams -sZLIB_SOURCE=$zlib_path cflags="-DHAVE_UNISTD_H"
emar rc stage/lib/libboost_filesystem.a stage/lib/libboost_filesystem.bc
emar rc stage/lib/libboost_program_options.a stage/lib/libboost_program_options.bc
emar rc stage/lib/libboost_iostreams.a stage/lib/libboost_iostreams.bc
emar rc stage/lib/libboost_zlib.a stage/lib/libboost_zlib.bc
path_boost_fs=$(readlink -f stage/lib/libboost_filesystem.a)
path_boost_po=$(readlink -f stage/lib/libboost_program_options.a)
path_boost_io=$(readlink -f stage/lib/libboost_iostreams.a)
path_boost_zlib=$(readlink -f stage/lib/libboost_zlib.a)

cd ..

# TBB (ported)
wget https://github.com/amkram/oneTBB-2019-wasm/archive/refs/tags/v1.1.tar.gz
tar xzf v1.1.tar.gz
cd oneTBB-2019-wasm-1.1
tbb_includes=$(readlink -f include)
emmake make -j8
path_tbb=$(readlink -f build/linux_wasm32_gcc_emscripten_wasm32_release/libtbb.so.2)
path_tbbmalloc=$(readlink -f build/linux_wasm32_gcc_emscripten_wasm32_release/libtbbmalloc.so.2)
path_tbbmalloc_proxy=$(readlink -f build/linux_wasm32_gcc_emscripten_wasm32_release/libtbbmalloc_proxy.so.2)

cd ..

# Protocol Buffers
protoc_version=$(protoc --version | cut -d " " -f 2)
wget "https://github.com/protocolbuffers/protobuf/releases/download/v$protoc_version/protobuf-cpp-$protoc_version.tar.gz"
tar xzf "protobuf-cpp-$protoc_version.tar.gz"
cd "protobuf-$protoc_version"
protobuf_includes=$(readlink -f src)
./autogen.sh && emconfigure ./configure --disable-shared --enable-static --build=wasm32 --target=wasm32
emmake make -j8
protobuf_libraries=$(readlink -f src/.libs/libprotobuf.a)
cd ../..

pre_js=$(readlink -f src/js/prepend.js)

mkdir -p build
mkdir -p build/preload
cp test/preload/* build/preload


# build UShER
cd build

if [[ -z "$1" ]] ; then
	# compile normally
	echo "compiling..."
	emcmake cmake -DBoost_INCLUDE_DIR=$boost_includes -DTBB_INCLUDE_DIR=$tbb_includes \
		-DProtobuf_INCLUDE_DIR=$protobuf_includes -DBoost_LIB_FS=$path_boost_fs -DBoost_LIB_IO=$path_boost_io \
		-DBoost_LIB_PO=$path_boost_po -DBoost_LIB_ZLIB=$path_boost_zlib \
		-DTBB_LIB_TBB=$path_tbb -DTBB_LIB_TBBMALLOC=$path_tbbmalloc -DTBB_LIB_TBBMALLOC_PROXY=$path_tbbmalloc_proxy \
		-DProtobuf_LIBRARIES=$protobuf_libraries -DPre_JS=$pre_js -DPre_Reference=$reference_file_name ..
elif [[ $1 == "test" ]] ; then
	# compile for testing
	echo "compiling in test mode..."
	emcmake cmake -DTEST_MODE=TRUE -DBoost_INCLUDE_DIR=$boost_includes -DTBB_INCLUDE_DIR=$tbb_includes \
		-DProtobuf_INCLUDE_DIR=$protobuf_includes -DBoost_LIB_FS=$path_boost_fs -DBoost_LIB_IO=$path_boost_io \
		-DBoost_LIB_PO=$path_boost_po -DBoost_LIB_ZLIB=$path_boost_zlib \
		-DTBB_LIB_TBB=$path_tbb -DTBB_LIB_TBBMALLOC=$path_tbbmalloc -DTBB_LIB_TBBMALLOC_PROXY=$path_tbbmalloc_proxy \
		-DProtobuf_LIBRARIES=$protobuf_libraries -DPre_JS=$pre_js -DPre_Reference=$reference_file_name "-DCMAKE_EXE_LINKER_FLAGS=-s LLD_REPORT_UNDEFINED" ..
fi


emmake make -j8 VERBOSE=1
cd ..
