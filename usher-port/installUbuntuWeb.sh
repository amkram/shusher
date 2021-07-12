#!/bin/bash

reference_file_name='GCF_009858895.2_ASM985889v3_genomic.fna'

#sudo -E apt update 
#sudo -E apt-get --yes install build-essential \
#wget cmake libprotoc-dev protobuf-compiler \
#mafft rsync dh-autoreconf

rm -rf build
mkdir -p web-lib && cd web-lib

# get Emscripten
wget https://github.com/emscripten-core/emsdk/archive/refs/tags/2.0.21.tar.gz
tar xzf 2.0.21.tar.gz
cd emsdk-2.0.21
./emsdk install 2.0.21
./emsdk activate 2.0.21
source emsdk_env.sh
cd ..

# Boost + zlib
wget https://boostorg.jfrog.io/artifactory/main/release/1.76.0/source/boost_1_76_0.tar.gz
wget https://zlib.net/zlib-1.2.11.tar.gz
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

emcmake cmake -DBoost_INCLUDE_DIR=$boost_includes -DTBB_INCLUDE_DIR=$tbb_includes \
	-DProtobuf_INCLUDE_DIR=$protobuf_includes -DBoost_LIB_FS=$path_boost_fs -DBoost_LIB_IO=$path_boost_io \
	-DBoost_LIB_PO=$path_boost_po -DBoost_LIB_ZLIB=$path_boost_zlib \
	-DTBB_LIB_TBB=$path_tbb -DTBB_LIB_TBBMALLOC=$path_tbbmalloc -DTBB_LIB_TBBMALLOC_PROXY=$path_tbbmalloc_proxy \
	-DProtobuf_LIBRARIES=$protobuf_libraries -DPre_JS=$pre_js -DPre_Reference=$reference_file_name ..

emmake make -j8 VERBOSE=1
cd ..
