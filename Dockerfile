FROM node:latest

MAINTAINER jorgebo10@gmail.com

# set default workdir
WORKDIR /usr/src/sistacLabAPI

COPY app .
COPY app.js .
COPY config .
COPY public .
COPY package.json .
COPY Gruntfile.js .

RUN npm install

RUN npm install -g grunt-cli

RUN npm install

# user to non-privileged user
USER nobody

# Expose the application port and run application
EXPOSE 9000

