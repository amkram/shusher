# UShER WebAssembly Port

This directory contains modifications and build scripts to compile UShER to WebAssembly. All of the below steps are performed in `installUbuntuWeb.sh`. See <a href="../README.md">here</a> for details on compiling UShER to WebAssembly.

## Source code changes
- TBB dependency removed from all files
- line `path = boost::filesystem::canonical(outdir);` removed from `usher.cpp`

## Library compilation
UShER has two dependencies (excluding TBB which is removed for ShUShER): Protocol Buffers and Boost.

### Boost
ShUShER uses Boost 1.76.0. Boost's build system `b2` ships with configuration support for Emscripten, yielding WebAssembly output. There is a bug in the build system that fails to recognize the correct generator for Emscripten. It is fixed by appending
    
    import generators ;
    generators.override emscripten.searched-lib-generator : searched-lib-generator ;
to the `tools/build/src/tools/emscripten.jam` file in the Boost source subdirectory.

ShUShER requires Boost's `filesystem`, `program_options`, `iostreams`, and `zlib` to compile. The following command compiles these libraries to WebAssembly:

    ./b2 -a toolset=emscripten link=static threading=multi --with-filesystem --with-program_options --with-iostreams -sZLIB_SOURCE=[zlib path] cflags="-DHAVE_UNISTD_H" 
 
 
The output of the above command is `bc` files for each library. These must be converted to `.a` files by running `emar rc` on each. `emar` is the Emscripten version of the GNU `ar` program. The resulting `.a`. files can be linked during compilation.

## Protocol Buffers
`installUbuntuWeb.sh` downloads the version of the `protoc` compiler matching that installed on the system (`protoc-compiler` must be installed before running the script).

Protocol Buffers doesn't require modifications to the source code before compiling. It is compiled to WebAssembly by calling:
       
    ./autogen.sh && emconfigure ./configure --disable-shared --enable-static --build=wasm32 --target=wasm32
    emmake make -j8
in the source directory.

# Compiling to WebAssembly
After the above steps are completed, the libraries are linked and UShER is compiled to WebAssembly with `emmake` and `make` (see `installUbuntuWeb.sh`).
