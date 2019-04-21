FROM node:9-alpine

# Set workdir
WORKDIR /home/angularapp

# Install global dependencies
RUN npm install -g npm@latest
RUN npm install -g @angular/cli
RUN npm install -g firebase-tools

# Install dependencies
COPY package.json ./
RUN npm install
COPY functions/package.json ./functions/
RUN cd ./functions && npm install && cd ../

# Bundle source
COPY . /home/angularapp

# Build
ENV commit = $commit
RUN node ./git.version.js
RUN ng build --prod

# Deploy
ARG firetoken
ENV firetoken = $firetoken
RUN firebase deploy --token $firetoken