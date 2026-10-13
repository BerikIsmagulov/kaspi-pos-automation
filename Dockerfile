FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY src ./src
COPY public ./public

ENV NODE_ENV=production \
    PORT=8090 \
    DATA_DIR=/data

RUN mkdir -p /data && chown -R node:node /app /data

USER node

EXPOSE 8090
VOLUME ["/data"]

CMD ["node", "server.js"]
