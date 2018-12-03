@echo off

call env

if "%1" == "" (
	exit 0
) else (
	set MODE=-it
)

docker container run %RUN_OPTS% %CONTAINER_NAME% %MODE% %NETWORK% %PORT_MAP% %VOL_MAP% --rm %REGISTRY%%IMAGE%%TAG% powershell -Command "decrypt-file %1 %2"
