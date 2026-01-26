# -----------------------------------------------------------------------------
# STAGE 1: BASE IMAGE
# -----------------------------------------------------------------------------
# This stage creates a foundation that other stages will build upon.
# Using "AS base" names this stage so we can reference it later with "FROM base"
# Similar concept to Python's base class that gets inherited.
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base

# We need to install libc6-compat because some npm packages require glibc
# Alpine uses musl libc by default, and this package provides compatibility
RUN apk add --no-cache libc6-compat

# Enable corepack - Node.js's built-in package manager
# This allows us to use pnpm without installing it globally via npm
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Set the working directory inside the container
# All subsequent commands will run from this directory
WORKDIR /app


# -----------------------------------------------------------------------------
# STAGE 2: DEPENDENCIES
# -----------------------------------------------------------------------------
# This stage installs all dependencies. We separate this from building because
# Docker caches layers - if package.json hasn't changed, Docker reuses this layer
# instead of reinstalling everything. Huge time saver during development!
# -----------------------------------------------------------------------------
FROM base AS deps

# Copy package manager configuration files first (for better caching)
# These files rarely change, so this layer gets cached most of the time
# 
# pnpm-workspace.yaml - Defines which folders are part of the monorepo
COPY pnpm-workspace.yaml ./

# Copy all package.json files from the monorepo
# We copy these BEFORE the source code so Docker can cache the dependency installation
# 
# The pattern here: copy the lockfile and package.jsons, install deps, THEN copy source
# This way, if only source code changes (not deps), Docker reuses the cached node_modules
COPY package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/core/package.json ./packages/core/
COPY packages/database/package.json ./packages/database/

# Install ALL dependencies (including devDependencies needed for building)
# 
# --frozen-lockfile: Fails if pnpm-lock.yaml is out of sync with package.json
# This ensures reproducible builds
RUN pnpm install --frozen-lockfile


# -----------------------------------------------------------------------------
# STAGE 3: BUILDER
# -----------------------------------------------------------------------------
# This stage compiles TypeScript and builds the Next.js application.
# The output will be a standalone build in apps/web/.next/standalone
# -----------------------------------------------------------------------------
FROM base AS builder

# Copy node_modules from the deps stage
# This is the magic of multi-stage builds - we grab artifacts from previous stages
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/core/node_modules ./packages/core/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules

# Copy all source code
# We do this AFTER installing deps so changing source doesn't invalidate the deps cache
COPY . .

# 👇 build-time envs
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_CONNECTION_NAME
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY

ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV DB_CONNECTION_NAME=$DB_CONNECTION_NAME
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# Build the workspace packages first
# These need to be compiled before the web app can import them
#
# Order matters! database depends on core, so we build core first
RUN pnpm --filter @finage/core build
RUN pnpm --filter @finage/database build

# Build the Next.js application
# This compiles TypeScript, bundles the app, and creates the standalone output
# 
# The standalone output includes:
#   - A minimal Node.js server (server.js)
#   - Only the node_modules actually used in production
#   - Your compiled application code
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @finage/web build


# -----------------------------------------------------------------------------
# STAGE 4: RUNNER (FINAL PRODUCTION IMAGE)
# -----------------------------------------------------------------------------
# This is the final image that will run in production.
# It only contains what's needed to RUN the app, not BUILD it.
# No TypeScript, no build tools, no devDependencies = tiny image!
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

# Set to production mode
# This tells Node.js and Next.js to optimize for production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app

# Create a non-root user for security
# Running as root in containers is a security risk - if someone exploits your app,
# they'd have root access to the container. This limits the damage.
# 
# addgroup: Creates a new group called "nodejs" with GID 1001
# adduser: Creates a new user called "nextjs" with UID 1001, in the nodejs group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone build from the builder stage
# The standalone folder contains everything needed to run the app
COPY --from=builder /app/apps/web/.next/standalone ./

# Copy the static files (JS, CSS, images that are pre-generated)
# These go to the public folder and .next/static
# We set ownership to the nextjs user we created above
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Switch to the non-root user
# All subsequent commands (and the running app) will use this user
USER nextjs

# Document which port the container will listen on
# This doesn't actually publish the port - it's just documentation
# You still need -p 3000:3000 when running the container
EXPOSE 3000

# The command to run when the container starts
# This runs the standalone Next.js server
# 
# Note: We use "node" directly, not "pnpm start" because:
#   1. The standalone build doesn't need pnpm
#   2. It's faster to start
#   3. Smaller attack surface (no package manager in prod)
CMD ["node", "apps/web/server.js"]
