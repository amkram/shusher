#!/bin/bash
echo "installing UShER port..."
if [ "$1" == "latest" ]; then
	"downloading latest port."

	remote_file=$(curl -s https://api.github.com/repos/amkram/shusher/releases/latest \
	| grep "browser_download_url.*gz" \
	| cut -d : -f 2,3 \
	| tr -d \")

	local_file=$(basename $remote_file)


	echo $remote_file | tr -d \" | wget -qi -
	tar xvzf $local_file -C dist/
	rm $local_file

else
	"custom path to port provided: $1"
	cp $1/usher.* dist/
fi
echo "done installing port."
