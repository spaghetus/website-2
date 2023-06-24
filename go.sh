#!/bin/bash

docker build -t website2-wwebs:latest .
echo "Ready"

docker run --init --rm -it \
	--env "TZ=$TZ" \
	--volume $(realpath ./wwebs-root):/wsrc:rw \
	--volume $(realpath ./public.pem):/public.pem:ro \
	--volume $(realpath ./private.pem):/private.pem:ro \
	--user 0 \
	-p 8000:8000 \
	-p 1965:1965 \
	website2-wwebs:latest