This branch contains modifications and build scripts to compile usher to WebAssembly.

The key modifications are:
    - compile libraries to WebAssembly prior to linking
    - remove TBB calls to parallel_for
    - remove line `path = boost::filesystem::canonical(outdir);` from `usher.cpp`