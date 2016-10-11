FROM node:argon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g grunt-cli

RUN addgroup --system --gid 1000 jbo && \
    adduser --system --uid 1000 --gid 1000 --home /home/jbo jbo

USER jbo
WORKDIR /home/jbo
