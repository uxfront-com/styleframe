# syntax=docker/dockerfile:1

# Build from the monorepo root:
#   docker build -f apps/storybook/Dockerfile -t styleframe-storybook .
# Dokploy: Build Type "Dockerfile", Docker File "apps/storybook/Dockerfile",
# Docker Context Path ".", container port 80.

FROM node:24-slim AS build

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    CI=true \
    HUSKY=0 \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN corepack enable

WORKDIR /app
COPY . .

# Storybook imports the built @styleframe/* workspace packages (core, plugin,
# runtime, theme), so a full install + turbo build resolves the dependency
# graph and builds those packages before Storybook itself.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

RUN pnpm turbo run build --filter=@styleframe/storybook

FROM nginx:alpine AS runtime

# Storybook builds to a fully static site; nginx serves it directly.
COPY --from=build /app/apps/storybook/storybook-static /usr/share/nginx/html

EXPOSE 80
