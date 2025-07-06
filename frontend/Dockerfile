FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL=https://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/api
ARG VITE_ENVIRONMENT=production
ARG VITE_WS_URL=wss://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT
ENV VITE_WS_URL=$VITE_WS_URL

# Build the app with environment variables
RUN npm run build

# Production stage
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]