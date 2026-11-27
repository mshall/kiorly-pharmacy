# Kiorly Pharmacy web (Vite SPA) image: static build served by nginx, which also proxies the API so the browser stays same-origin (no CORS, relative /api/v1).
# Build from the repository root; every VITE_* value is baked in at BUILD time (Vite), so pass them as build args:
#   docker build -f apps/web/Dockerfile -t kiorly-pharmacy-web \
#     --build-arg VITE_KIORLY_HOME_URL=https://home.example.com --build-arg VITE_SESSION_IDLE_MINUTES=30 .
# Run (API_UPSTREAM = where the API is reachable from this container; the Kiorex machine API /marketplace/v1 is proxied too):
#   docker run -p 8080:8080 -e API_UPSTREAM=http://api:3100 kiorly-pharmacy-web
# Without Docker: `VITE_KIORLY_HOME_URL=... npm run build -w web` writes apps/web/dist (serve it behind any proxy that forwards /api/ to the API).
FROM node:26-bookworm-slim AS build
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages ./packages
COPY vendor ./vendor
RUN npm ci
COPY apps/web ./apps/web
ARG VITE_KIORLY_HOME_URL=""
ARG VITE_SESSION_IDLE_MINUTES=""
ENV VITE_KIORLY_HOME_URL=$VITE_KIORLY_HOME_URL VITE_SESSION_IDLE_MINUTES=$VITE_SESSION_IDLE_MINUTES
RUN npm run build -w web

FROM nginx:1.29-alpine AS web
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --chmod=755 apps/web/nginx-resolver.sh /docker-entrypoint.d/15-resolver.sh
ENV API_UPSTREAM=http://api:3100 NGINX_PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
