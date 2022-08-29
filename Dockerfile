FROM python:3-alpine
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
        build-base \
        libpcap-dev && \
        cd /bin && \
        git clone https://github.com/robertdavidgraham/masscan.git && \
        cd masscan && \ 
        make -j4 && \
        make install && \
        cd .. &&\
        rm -rf masscan
# Install python dependencies
WORKDIR /src
COPY ./src/requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
# Copy source code
COPY ./src .