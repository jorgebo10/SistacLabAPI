FROM node:latest

MAINTAINER jorgebo10@gmail.com

# set default workdir
WORKDIR /usr/src

# Add package.json to allow for caching
COPY Gruntfile.js /usr/src/sistacLabAPI/
COPY app /usr/src/sistacLabAPI/app/
COPY app.js /usr/src/sistacLabAPI/
COPY config /usr/src/sistacLabAPI/config/
COPY public /usr/src/sistacLabAPI/public/
COPY package.json /usr/src/sistacLabAPI/

RUN npm install

RUN npm install -g grunt-cli

# user to non-privileged user
USER nobody

# Expose the application port and run application
EXPOSE 9000

RUN cd /usr/src/sistacLabAPI;grunt jshint
