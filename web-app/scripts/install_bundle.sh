#!/bin/bash
echo "installing UShER port..."
if [[ "$1" == "latest" ]]; then
	echo "downloading latest port."

	remote_file=$(curl -s https://api.github.com/repos/amkram/shusher/releases/latest \
	| grep "browser_download_url.*gz" \
	| cut -d : -f 2,3 \
	| tr -d \")

	local_file=$(basename $remote_file)


	echo $remote_file | tr -d \" | wget -qi -
	tar xvzf $local_file -C dist/js
	rm $local_file

else
	echo "custom path to port provided: $1"
	if [[ -f $1/usher.wasm && -f $1/usher.js && -f $1/usher.data &&  -f $1/usher.worker.js ]]; then
		cp $1/usher.* dist/js
		echo "done installing port."
	else
		echo "ERROR: usher files not found in $1. Please check your path"

	fi
fi
