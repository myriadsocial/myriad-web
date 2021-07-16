# Install dependencies only when needed
FROM node:14-buster-slim AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 100000

# Rebuild the source code only when needed
FROM node:14-buster-slim AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:14-buster-slim AS runner
# Change default user name
RUN usermod -d /home/myriad -l myriad node && \
  groupmod -n myriad node && \
  mkdir -p /home/myriad && \
  chown -R myriad:myriad /home/myriad

# Set to a non-root built-in user `myriad`
USER myriad

# Create app directory (with user `myriad`)
RUN mkdir -p /home/myriad/app

WORKDIR /home/myriad/app

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder --chown=myriad /app/.env ./.env
COPY --from=builder --chown=myriad /app/public ./public
COPY --from=builder --chown=myriad /app/.next ./.next
COPY --from=builder --chown=myriad /app/node_modules ./node_modules
COPY --from=builder --chown=myriad /app/package.json ./package.json

ENV NODE_ENV production
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1
# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000

EXPOSE ${PORT}
CMD ["yarn", "start"]
