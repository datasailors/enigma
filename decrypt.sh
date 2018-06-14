#!/bin/bash

source .env

if [ -z "$1" ]; then
	decryptUsage
	exit 0
fi

docker container run ${RUN_OPTS} ${MODE} ${VOL_MAP} --rm ${REGISTRY}${IMAGE}${TAG} decrypt "$@"
