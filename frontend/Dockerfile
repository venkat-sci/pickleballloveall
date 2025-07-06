FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

ENV VITE_API_URL=https://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/api
ENV VITE_ENVIRONMENT=production
ENV VITE_WS_URL=wss://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io

# Build the app with environment variables
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]