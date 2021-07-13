#!/bin/bash
# used for creating new bundles for github release
# e.g. ./make-bundle v0.1.0

mkdir -p bundle
mkdir -p bundle/$1
mkdir -p bundle/$1/usher-port-bundle-$1
cp usher-port/build/usher.* bundle/$1/usher-port-bundle-$1
cd bundle/$1/usher-port-bundle-$1
tar cvzf ../usher-port-bundle-$1.tar.gz *

