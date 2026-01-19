FROM node:20-alpine AS base

# Установка dumb-init для graceful shutdown
RUN apk add --no-cache dumb-init

WORKDIR /app

FROM base AS deps-prod
COPY package*.json package-lock.json* ./
RUN npm ci --ignore-scripts && npm cache clean --force

FROM base AS deps-dev
COPY package*.json package-lock.json* ./
RUN npm ci && npm cache clean --force

FROM base AS build
COPY package*.json package-lock.json* ./
COPY tsconfig*.json ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM base AS development
ENV NODE_ENV=development
COPY --from=deps-dev --chown=node:node /app/node_modules ./node_modules
COPY . .
COPY src/scripts ./scripts
RUN chmod +x scripts/init-db.sh
EXPOSE 3000
CMD ["npm", "run", "start"]

FROM node:20-alpine AS production
ENV NODE_ENV=production
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY --from=deps-prod --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package*.json ./
COPY src/scripts ./scripts
RUN chmod +x scripts/init-db.sh
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1
