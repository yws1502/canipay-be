FROM node:18 As builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

ENTRYPOINT ["yarn", "start:prod"]
