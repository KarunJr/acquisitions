# -----------------------------
# Base Dependencies
# -----------------------------
FROM node:18-alpine AS deps

RUN addgroup -S nodegroup && adduser -S developer -G nodegroup

WORKDIR /home/developer/app

COPY package*.json ./

RUN npm ci

# -----------------------------
# Build Stage
# -----------------------------
FROM node:18-alpine AS builder

WORKDIR /home/developer/app

COPY --from=deps /home/developer/app/node_modules ./node_modules

COPY . .

RUN npm run build

# -----------------------------
# Development Stage
# -----------------------------
FROM node:18-alpine AS development

RUN addgroup -S nodegroup && adduser -S developer -G nodegroup

WORKDIR /home/developer/app

COPY --from=deps /home/developer/app/node_modules ./node_modules

COPY --chown=developer:nodegroup . .

USER developer

EXPOSE 3000

CMD ["npm", "run", "dev"]

# -----------------------------
# Production Stage
# -----------------------------
FROM node:18-alpine AS production

RUN addgroup -S nodegroup && adduser -S developer -G nodegroup

WORKDIR /home/developer/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /home/developer/app/dist ./dist

USER developer

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
CMD node -e "require('http').get('http://localhost:3000/health',(res)=>{process.exit(res.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

CMD ["node", "dist/index.js"]