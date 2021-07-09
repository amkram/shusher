#!/bin/bash

# e.g. ./make-bundle v0.1

mkdir -p bundle/$1
mkdir -p bundle/$1/usher-port-bundle-$1
cp usher-port/build/usher.* bundle/$1/usher-port-bundle-$1
tar cvzf bundle/$1/usher-port-bundle-$1.tar.gz bundle/$1/usher-port-bundle-$1
