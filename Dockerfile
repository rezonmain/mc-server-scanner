FROM python:3.8-alpine
# install masscan
RUN set -ex; \
    apk --update add --no-cache \
        ca-certificates \
        clang \
        clang-dev \
        gcc \
        git \
        libc-dev \
        linux-headers \
        make \
        libpcap-dev && \
        cd /bin && \
        git clone https://github.com/robertdavidgraham/masscan && \
        cd masscan && \ 
        make -j4 && \
        make install && \
        cd .. &&\
        rm -rf masscan
WORKDIR /src
COPY ./src/requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY ./src .