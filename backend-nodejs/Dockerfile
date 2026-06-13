FROM node:22-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./

COPY generated prisma ./

RUN npm install

