# Production image.
FROM node:20.17 AS build

ENV NODE_ENV=production

# Build backend.
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --include dev
COPY . .
RUN npm run build
RUN npm prune

# Final build stage to pick only actually needed files into the image.
FROM node:20.17-alpine

USER node

WORKDIR /app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

# Run database migrations before booting server.
CMD ["node", "dist/main.js"]
