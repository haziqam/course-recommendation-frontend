FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json /usr/src/app/
RUN npm install

COPY next.config.js /usr/src/app/
COPY tsconfig.json /usr/src/app/