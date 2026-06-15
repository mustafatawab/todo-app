FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

COPY generated prisma prisma.config.json ./

RUN npm install

