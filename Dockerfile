# Disney Paris Transfers — production image.
#
# Used by hosts that build from Git (Render, Railway, Coolify, CapRover,
# Dokploy, Fly.io…). Two things every such host must provide:
#
#   1. a PERSISTENT VOLUME mounted on /app/data — the SQLite file there is the
#      whole business; without a volume every deploy wipes the bookings;
#   2. the environment variables from .env.example (SESSION_SECRET, ADMIN_*,
#      SMTP_*, …) set in the host's dashboard.
#
# The server listens on $PORT (default 3000) on all interfaces.

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
# Dev dependencies are needed to build (astro, tailwind, typescript).
RUN npm ci --include=dev
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    DATABASE_PATH=/app/data/app.db
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/server.mjs ./server.mjs
COPY --from=build /app/scripts ./scripts
RUN mkdir -p /app/data && chown -R node:node /app
USER node
VOLUME ["/app/data"]
EXPOSE 3000
CMD ["node", "server.mjs"]
