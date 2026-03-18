# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependency manifests first (layer cache friendly)
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDeps needed for build)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Inject build-time env vars (Cloud Run will pass them via --build-arg or .env)
ARG VITE_CANISTER_ID_BACKEND
ARG VITE_BACKEND_HOST
ARG VITE_GEMINI_API_KEY

ENV VITE_CANISTER_ID_BACKEND=$VITE_CANISTER_ID_BACKEND
ENV VITE_BACKEND_HOST=$VITE_BACKEND_HOST
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Build the production bundle
RUN pnpm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run listens on 8080 by default
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
