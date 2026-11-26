# Kiorly Pharmacy API runtime image (host-agnostic: AWS App Runner, ECS, a single Docker host). Build from the repository root:
#   docker build -f apps/api/Dockerfile -t kiorly-pharmacy-api .
#   docker buildx build --platform linux/amd64,linux/arm64 -f apps/api/Dockerfile -t kiorly-pharmacy-api .   (multi-arch: no arch-specific steps)
# Run: see Docs/DEPLOYMENT.md (env, health probes, volume). `vendor/` holds the file: tarballs the workspace depends on (@kiorex/contracts);
# it is copied BEFORE `npm ci` because package-lock resolves them from there.
# The container starts apps/api/docker-entrypoint.mjs: DATABASE_URL (or DB_*), `prisma migrate deploy` with bounded retries (exit non-zero if it fails), then the server.
FROM node:26-bookworm-slim AS deps
WORKDIR /repo
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages ./packages
COPY vendor ./vendor
RUN npm ci

FROM deps AS build
COPY apps/api ./apps/api
# `prisma generate` does not connect; the placeholder only satisfies prisma.config.ts
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"
RUN npm run build -w api

# Prisma CLI for `migrate deploy`, kept apart from the app's node_modules (the app image ships production dependencies only)
FROM node:26-bookworm-slim AS prisma-cli
WORKDIR /opt/prisma
RUN printf '%s' '{"name":"prisma-cli","private":true,"dependencies":{"prisma":"7.10.1","dotenv":"18.0.10"},"overrides":{"@prisma/config":{"effect":"3.22.5"}}}' > package.json \
 && npm install --omit=dev --no-audit --no-fund
RUN printf '%s\n' \
  'import { defineConfig, env } from "prisma/config";' \
  'export default defineConfig({ schema: "/repo/apps/api/prisma/schema.prisma", migrations: { path: "/repo/apps/api/prisma/migrations" }, datasource: { url: env("DATABASE_URL") } });' > prisma.config.mjs

FROM node:26-bookworm-slim AS runner
WORKDIR /repo
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages ./packages
COPY vendor ./vendor
RUN npm ci --omit=dev --workspace apps/api --include-workspace-root=false && npm cache clean --force
COPY --from=prisma-cli --chown=node:node /opt/prisma /opt/prisma
COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/docker-entrypoint.mjs ./apps/api/docker-entrypoint.mjs
COPY --from=build /repo/apps/api/dist ./apps/api/dist
ENV PATH="/opt/prisma/node_modules/.bin:${PATH}" NODE_ENV=production PORT=3100 LISTEN_HOST=0.0.0.0
WORKDIR /repo/apps/api
RUN mkdir -p /data/storage && chown -R node:node /data /repo/apps/api
USER node
EXPOSE 3100
# Liveness only (process up). Readiness (database) is /ready: point the orchestrator's readiness/health check at it.
HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3100)+'/'+(process.env.API_PREFIX||'api/v1').replace(/^\\/+|\\/+$/g,'')+'/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["node", "docker-entrypoint.mjs"]
