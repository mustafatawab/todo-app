FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:24-alpine

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./package*.json
COPY --from=builder ./app ./


CMD ["npm","start"]
