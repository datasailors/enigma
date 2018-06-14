#!/bin/bash

# Helper functions
## Detect current operating system
function os
{
        UNAME=$(uname -a)
        if [ $(echo $UNAME | awk '{print $1}') == "Darwin" ]; then
                export OPERATING_SYSTEM="MacOS"
        elif [ $(echo $UNAME | awk '{print $1}') == "Linux" ]; then
                export OPERATING_SYSTEM="Linux"
        elif [ ${UNAME:0:5} == "MINGW" ]; then
                export OPERATING_SYSTEM="Windows"
                export MSYS_NO_PATHCONV=1 # turn off path conversion
        else
                export OPERATING_SYSTEM="Other"
        fi
}
## End os function
os

## Determine current host IP address
function hostip
{
	case "${OPERATING_SYSTEM}" in
        "Linux")
                export HOST_IP=$(hostname -I | tr " " "\n" | head -1) # Linux
                ;;
        "MacOS")
                export HOST_IP=$(ifconfig | grep -v 127.0.0.1 | grep -v inet6 | grep inet | head -n 1 | awk '{print $2}') # Mac OS
                ;;
        "Windows")
                export HOST_IP=$( ((ipconfig | grep IPv4 | grep 10. | tail -1) | tail -1 | awk '{print $14}' ) # Git bash
                ;;
        *)
                export HOST_IP=$(hostname)
                ;;
	esac
}
## End hostip function 
hostip

## encryptUsage
function encryptUsage
{
	echo ""
	echo "Usage:"
	echo "       ./encrypt.sh [Plain text]"
	echo ""
	echo "       or"
	echo ""
	echo "       ./encrypt.sh -i <unencrypted-filepath-within-container> -o <encrypted-filepath-within-container>"
	echo ""
	echo "       Note: For filepaths within container see volumen mapping in your .env file"
	echo ""
}

## decryptUsage
function decryptUsage
{
	echo ""
	echo "Usage:"
	echo "       ./decrypt.sh [Plain text]"
	echo ""
	echo "       or"
	echo ""
	echo "       ./dectypr.sh -i <encrypted-filepath-within-container> -o <decrypted-filepath-within-container>"
	echo ""
	echo "       Note: For filepaths within container see volumen mapping in your .env file"
	echo ""
}
