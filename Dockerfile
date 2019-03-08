FROM node:9-alpine

# Take arguments
ARG firetoken

# Set workdir
WORKDIR /home/angularapp

# Install global dependencies
RUN npm install -g npm@latest
RUN npm install -g firebase-tools

# Install dependencies
COPY package.json ./
RUN npm install

# Bundle source
COPY . /home/angularapp

RUN npm build
RUN firebase deploy --token firetoken
