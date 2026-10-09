# ===================================================================
# Build
# ===================================================================
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci

COPY --exclude=package*.json . .
RUN npm run build

# ===================================================================
# Nginx
# ===================================================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/join/browser .
EXPOSE 80