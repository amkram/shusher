#!/bin/bash
version=v$(grep -Eo '"version":.*?[^\\]",' package.json | sed -e 's/[\"\,\: ]*//g' | sed -e 's/version//g')
rm dist/usher*
wget https://github.com/amkram/shusher/releases/download/$version/usher-port-bundle-$version.tar.gz -P dist
tar xvzf dist/usher-port-bundle-$version.tar.gz -C dist
mv dist/usher-port-bundle-$version/* dist
