FROM ubuntu:14.04

RUN apt-get -y install sudo
RUN apt-get update
RUN apt-get install -y curl
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
RUN nvm install v4.2.1
RUN npm install -g grunt-cli
