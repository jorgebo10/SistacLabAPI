FROM node:latest

MAINTAINER jorgebo10@gmail.com

# set default workdir
WORKDIR /usr/src/sistacLabAPI

COPY app ./app/
COPY app.js .
COPY config ./config/
COPY public ./public/
COPY package.json .
COPY Gruntfile.js .

RUN npm install

RUN npm install -g grunt-cli

# user to non-privileged user
USER nobody

CMD ["grunt", "jshint"]


