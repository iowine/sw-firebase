FROM node:9-alpine

# Take arguments
ARG firetoken
ARG commit

# Set arguments
ENV commit $commit

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

# Build & deploy
RUN node ./git.version.js
RUN ng build --prod
RUN firebase deploy --token $firetoken
