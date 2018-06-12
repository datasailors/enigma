#!/bin/bash

source .env

docker container run ${RUN_OPTS} ${MODE} ${VOL_MAP} --rm ${REGISTRY}${IMAGE}${TAG} decrypt $@
