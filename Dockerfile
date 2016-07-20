FROM node:latest

MAINTAINER jorgebo10@gmail.com

# set default workdir
WORKDIR /usr/src

# Add package.json to allow for caching
COPY app /usr/src/
COPY app.js /usr/src/
COPY config /usr/src/
COPY public /usr/src/
COPY coverage /usr/src/
COPY logs /usr/src/
COPY package.json /usr/src


RUN npm install -g grunt-cli

RUN npm install

# user to non-privileged user
USER nobody

# Expose the application port and run application
EXPOSE 9000

#RUN grunt jshint
