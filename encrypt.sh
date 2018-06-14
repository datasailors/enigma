#!/bin/bash

source .env

if [ -z "$1" ]; then
	encryptUsage
	exit 0
fi

docker container run ${RUN_OPTS} ${MODE} ${VOL_MAP} --rm  ${REGISTRY}${IMAGE}${TAG} encrypt "$@"
