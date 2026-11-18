# syntax=docker/dockerfile:1.7
# Xiris update server (SvelteKit + adapter-node, quick.db/better-sqlite3 cache)

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-bookworm-slim AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    CI=true
# pnpm-workspace.yaml uses pnpm 10 syntax (allowBuilds, no packages field)
RUN npm install -g pnpm@10.34.9 && pnpm config set store-dir /pnpm/store
WORKDIR /app

FROM base AS build
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --config.package-import-method=copy
COPY . .
# $env/static/private (GITHUB_REPO, GITHUB_TOKEN...) is inlined at build time. .env comes in
# with `COPY . .` so editing it invalidates the build cache (a BuildKit secret mount does not);
# it stays in this build stage only.
RUN if [ ! -f .env ]; then cp .env.example .env; fi \
    && pnpm build \
    && rm -f .env

FROM base AS runtime
RUN apt-get update \
    && apt-get install -y --no-install-recommends tini ca-certificates \
    && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
# better-sqlite3 (native, devDependency) is loaded at runtime by quick.db, so keep full node_modules.
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/build ./build
# quick.db writes ./cache.sqlite relative to cwd -> keep it on a volume.
RUN mkdir -p /app/data && chown node:node /app/data
WORKDIR /app/data
USER node
EXPOSE 3000
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "/app/build"]
