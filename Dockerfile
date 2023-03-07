# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN npm ci

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

# Auth0 data
ENV AUTH0_SECRET=
ENV AUTH0_BASE_URL=
ENV AUTH0_ISSUER_BASE_URL=
ENV AUTH0_CLIENT_ID=
ENV AUTH0_CLIENT_SECRET=
ENV AUTH0_MANAGEMENT_CLIENT_ID=
ENV AUTH0_MANAGEMENT_CLIENT_SECRET=
ENV AUTH0_DOMAIN=

# Application ENVs
ENV APP_VERSION=
ENV DATABASE_URL=

# AWS data for uploads
ENV AWS_ACCOUNT=
ENV AWS_REGION=
ENV S3_UPLOAD_KEY=
ENV S3_UPLOAD_SECRET=
ENV S3_UPLOAD_BUCKET=
ENV S3_UPLOAD_REGION=


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public


COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# RUN mkdir -p /app/data
# RUN chown nextjs:nodejs -R /app/data

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]