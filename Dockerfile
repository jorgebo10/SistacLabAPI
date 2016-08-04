FROM ubuntu:14.04.3

# make sure apt is up to date
RUN apt-get update --fix-missing
RUN apt-get install -y curl
RUN sudo apt-get install -y build-essential libssl-dev

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 4.2.4

# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN npm install -g grunt-cli

RUN git clone -b development https://github.com/jorgebo10/SistacLabAPI.git

RUN npm install