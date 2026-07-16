# Multi-stage build for production deployment
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install production dependencies for the root and each sub-package
# (this repo is not an npm workspace, so each dir must be installed on its own)
RUN npm install --only=production \
  && cd client && npm install --only=production \
  && cd ../server && npm install --only=production

# Build the client
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install all dependencies (including dev deps needed to build the client)
RUN npm install \
  && cd client && npm install

# Copy source code
COPY client/ ./client/
COPY server/ ./server/

# Build the client
WORKDIR /app/client
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server/index.js"]
