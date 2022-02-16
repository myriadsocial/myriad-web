# Install dependencies only when needed
FROM node:14.17.5-buster-slim AS dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 100000

# Rebuild the source code only when needed
FROM node:14.17.5-buster-slim AS builder
ARG VCS_REF
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
ENV BUILD_ID=${VCS_REF}
RUN yarn build && \
  yarn install --production --prefer-offline --network-timeout 100000

# Production image, copy all the files and run
FROM node:14.17.5-buster-slim AS runner
ARG VCS_REF
LABEL social.myriad.image.authors="myriad.dev@blocksphere.id"
# Create user and set ownership and permissions as required
RUN useradd -m -u 1001 -U -s /bin/sh -d /home/myriad myriad
WORKDIR /app
# Copy from builder stage
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/plugins ./plugins
COPY --from=builder --chown=myriad /app/public ./public
COPY --from=builder --chown=myriad /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# Set to a non-root built-in user
USER myriad
# Set environment variable
ENV BUILD_ID=${VCS_REF} NODE_ENV=production HOST=0.0.0.0 PORT=3000
EXPOSE ${PORT}
ENTRYPOINT ["yarn", "start:docker"]
