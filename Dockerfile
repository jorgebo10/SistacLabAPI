FROM    ubuntu:14.04

RUN sudo apt-get update
RUN sudo apt-get install -y curl
RUN sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
RUN sudo npm install -g grunt-cli
RUN sudo npm install 
