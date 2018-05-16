source .env

MODE=-it

docker container run ${RUN_OPTS} ${CONTAINER_NAME} ${MODE} ${NETWORK} ${PORT_MAP} ${VOL_MAP} --rm  ${REGISTRY}${IMAGE}${TAG} node /enigma/index.js encrypt $@
