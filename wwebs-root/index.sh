#!/bin/bash

if [ $PROTO == "Http" ]; then
	>&2 echo status 301
	>&2 echo header Location /html/index.html
elif [ $PROTO == "Gemini" ]; then
	>&2 echo status 30
	echo /gem/index.gem
fi