FROM node:latest

MAINTAINER jorgebo10@gmail.com

# set default workdir
WORKDIR /var/lib/jenkins/workspace/Testgithub

# Add package.json to allow for caching
COPY * /usr/src/SistacLabAPI

# Install app dependencies
RUN npm install

RUN npm install -g grunt-cli

# user to non-privileged user
USER nobody

# Expose the application port and run application
EXPOSE 9000

