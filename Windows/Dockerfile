FROM microsoft/windowsservercore

MAINTAINER Yekta Yazdani <yekta.yazdani@bhge.com>

ARG http_proxy
ARG https_proxy
ARG no_proxy

ADD Container-Root /

ADD scripts /
RUN installChocolatey.cmd

RUN set http_proxy=%http_proxy%; set https_proxy=%https_proxy%; set no_proxy=%no_proxy%;

#RUN choco install -y wget
ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 6.8.1
ENV NODE_SHA256 4600ed0e30a2497b6add2f53cdfccc727cf1cf9c5de6f90e89037085f489e5f4

RUN powershell -Command \
    wget -Uri https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-x64.msi -OutFile node.msi -UseBasicParsing ; \
    if ((Get-FileHash node.msi -Algorithm sha256).Hash -ne $env:NODE_SHA256) {exit 1} ; \
    Start-Process -FilePath msiexec -ArgumentList /q, /i, node.msi -Wait ; \
    Remove-Item -Path node.msi

RUN setup.bat; del setup.bat
ADD Container-Root/scripts C:/Windows/system32

#CMD startup.bat

