FROM node:20.19.0-bookworm AS base

ARG NEXT_PUBLIC_REST_URL
ARG NODE_ENV
ARG NEXT_PUBLIC_ACCESS_TOKEN_KEY
ARG NEXT_PUBLIC_REFRESH_TOKEN_KEY

ENV NEXT_PUBLIC_REST_URL=${NEXT_PUBLIC_REST_URL}
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_ACCESS_TOKEN_KEY=${NEXT_PUBLIC_ACCESS_TOKEN_KEY}
ENV NEXT_PUBLIC_REFRESH_TOKEN_KEY=${NEXT_PUBLIC_REFRESH_TOKEN_KEY}
# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files for dependency installation
COPY package*.json ./

# Development target
FROM base AS development
RUN pnpm install
COPY . .
EXPOSE 3000
CMD ["pnpm", "run", "dev"]

# Production build target
FROM base AS build
# Declare all ARGs at the beginning of the build stage

COPY . .
RUN rm -rf /app/node_modules /app/.env* 
RUN pnpm install --frozen-lockfile

RUN pnpm run build

# Production target - serves the built application
FROM node:20.19.0-bookworm-slim AS production

# Set environment variable for REST API URL
WORKDIR /app
# Install pnpm in production image
RUN npm install -g pnpm
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "start"]
