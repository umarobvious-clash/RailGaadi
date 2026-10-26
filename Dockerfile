# ─── Stage 1: Build Application ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configuration and subproject manifests
COPY package.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install all dependencies
RUN npm --prefix backend install
RUN npm --prefix frontend install

# Copy source code and pre-seeded database
COPY backend ./backend
COPY frontend ./frontend

# Build frontend and backend
RUN npm --prefix frontend run build
RUN npm --prefix backend run build

# ─── Stage 2: Production Runtime ─────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy package manifests for production install
COPY backend/package*.json ./backend/
RUN npm --prefix backend install --omit=dev

# Copy compiled backend, data files, and compiled frontend
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/data ./backend/data
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY package.json ./

EXPOSE 3001

CMD ["node", "backend/dist/index.js"]
