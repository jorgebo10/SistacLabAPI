FROM node:latest

MAINTAINER jorgebo10@gmail.com

RUN npm install

RUN npm install -g grunt-cli

# user to non-privileged user
USER nobody

CMD ["grunt", "jshint"]


