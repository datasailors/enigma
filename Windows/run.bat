@echo off

call env

if "%1" == "" (
	set MODE=-d
	set REMOVE=
) else (
	set MODE=-it
	set REMOVE=--rm
) 

docker container run %REMOVE% %RUN_OPTS% %CONTAINER_NAME% %MODE% %NETWORK% %PORT_MAP% %VOL_MAP% %REGISTRY%%IMAGE%%TAG% %*

