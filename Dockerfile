FROM node:latest

MAINTAINER jorgebo10@gmail.com

# set default workdir
WORKDIR /usr/src

# Add package.json to allow for caching
COPY app /usr/src/app
COPY app.js /usr/src/
COPY config /usr/src/config
COPY public /usr/src/public
COPY coverage /usr/src/coverage
COPY logs /usr/src/logs
COPY package.json /usr/src


RUN npm install -g grunt-cli

RUN npm install

# user to non-privileged user
USER nobody

# Expose the application port and run application
EXPOSE 9000

#RUN grunt jshint
