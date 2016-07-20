FROM node:latest

MAINTAINER jorgebo10@gmail.com

# set default workdir
WORKDIR /usr/src

# Add package.json to allow for caching
COPY * /usr/src/


RUN npm install -g grunt-cli

RUN npm install

# user to non-privileged user
USER nobody

# Expose the application port and run application
EXPOSE 9000

RUN grunt jshint
