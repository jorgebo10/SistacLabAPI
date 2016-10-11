FROM node:argon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g grunt-cli

RUN addgroup --system --gid 1000 apps && \
    adduser --system --uid 1000 --gid 1000 --home /home/apps apps

USER apps
WORKDIR /home/apps
