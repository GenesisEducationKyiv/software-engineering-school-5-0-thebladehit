FROM node:latest AS build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node /apps/subscriptions/package.json ./apps/subscriptions/package.json
RUN npm ci

COPY --chown=node:node apps/subscriptions apps/subscriptions
COPY --chown=node:node libs libs

COPY --chown=node:node tsconfig.json tsconfig.json
COPY --chown=node:node nest-cli.json nest-cli.json

RUN npx prisma generate --schema=apps/subscriptions/src/prisma

RUN npm run build subscriptions
RUN npm run copy:proto

FROM node:22.17-bullseye-slim

ENV NODE_ENV=production
COPY --chown=node:node --from=build /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node /apps/subscriptions/package.json ./apps/subscriptions/package.json
RUN npm ci --omit=dev
COPY --chown=node:node --from=build /usr/src/app/dist/apps/subscriptions /usr/src/app/dist/apps/subscriptions
COPY --chown=node:node --from=build /usr/src/app/dist/libs /usr/src/app/dist/libs
COPY --chown=node:node /apps/subscriptions/src/prisma/schema.prisma ./

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/apps/subscriptions/main.js"]