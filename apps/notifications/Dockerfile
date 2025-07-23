FROM node:latest AS build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node /apps/notifications/package.json ./apps/notifications/package.json
RUN npm ci

COPY --chown=node:node apps/notifications apps/notifications
COPY --chown=node:node libs libs

COPY --chown=node:node tsconfig.json tsconfig.json
COPY --chown=node:node nest-cli.json nest-cli.json

RUN npm run build notifications
RUN npm run copy:proto

FROM node:22.17-bullseye-slim

ENV NODE_ENV=production
COPY --chown=node:node --from=build /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node /apps/notifications/package.json ./apps/notifications/package.json
RUN npm ci --omit=dev
COPY --chown=node:node --from=build /usr/src/app/dist/apps/notifications /usr/src/app/dist/apps/notifications
COPY --chown=node:node --from=build /usr/src/app/dist/libs /usr/src/app/dist/libs

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/apps/notifications/main.js"]