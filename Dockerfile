FROM ubuntu:14.04

RUN apt-get -y install sudo

RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo

USER docker
RUN sudo apt-get update
RUN sudo apt-get install -y curl
RUN sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
RUN sudo npm install -g grunt-cli
