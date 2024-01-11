FROM node:20-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache python3 py3-pip make g++
RUN yarn
RUN npm install --force
RUN yarn build


ENTRYPOINT yarn start-server
