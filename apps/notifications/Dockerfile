FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./


COPY --chown=node:node tsconfig.json tsconfig.json
COPY --chown=node:node nest-cli.json nest-cli.json

COPY --chown=node:node apps/notifications apps/notifications
COPY --chown=node:node libs libs

RUN npm ci

FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node apps/notifications apps/notifications
COPY --chown=node:node libs libs

RUN npm run build

RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:22-alpine AS production

COPY --chown=node:node --from=build /usr/src/app/apps/notifications/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/entrypoint.sh ./

USER node