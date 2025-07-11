FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN npm run build

RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:22-alpine AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/entrypoint.sh ./
COPY --chown=node:node --from=build /usr/src/app/src/prisma ./src/prisma
COPY --chown=node:node --from=build /usr/src/app/client ./client

USER node