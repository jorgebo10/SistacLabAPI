FROM node:latest

MAINTAINER jorgebo10@gmail.com

# set default workdir
WORKDIR /usr/src/sistacLabAPI

COPY Gruntfile.js /usr/src/
COPY app /usr/src/app/
COPY app.js /usr/src/
COPY config /usr/src/config/
COPY public /usr/src/public/
COPY package.json /usr/src/

RUN npm install

RUN npm install -g grunt-cli

# user to non-privileged user
USER nobody

# Expose the application port and run application
EXPOSE 9000

RUN cd /usr/src/sistacLabAPI;grunt jshint
