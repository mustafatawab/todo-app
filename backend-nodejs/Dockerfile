FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

# COPY --from=builder ./app/dist ./dist
COPY --from=builder ./app/package*.json ./
COPY --from=builder ./app/node_modules  ./node_modules 
COPY --from=builder ./app ./


EXPOSE 4000

CMD ["node" , "server.js"]