# syntax = docker/dockerfile:experimental
#--------------------------------------------------------------------------------
# Stage 1: Compile Typescript and Next.js
#--------------------------------------------------------------------------------
    FROM node:lts-alpine as builder
    LABEL stage=intermediate
    ENV NEXT_TELEMETRY_DISABLED 1
    
    WORKDIR /app
    COPY package.json yarn.lock ./
    RUN --mount=type=cache,target=/app/.cache/yarn \
        yarn config set cache-folder /app/.cache/yarn && \
        yarn install --frozen-lockfile
    
    COPY . .
    RUN yarn build
    
    #--------------------------------------------------------------------------------
    # Stage 2: Prepare running environment for Next.js container
    #--------------------------------------------------------------------------------
    FROM node:lts-alpine
    
    WORKDIR /app
    ENV NODE_ENV production
    COPY --from=builder /app/next.config.mjs .
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    
    EXPOSE 3000
    CMD ["yarn", "start"]