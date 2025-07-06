FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Accept build args and set them as environment variables
ARG VITE_API_URL
ARG VITE_ENVIRONMENT
ARG VITE_WS_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT
ENV VITE_WS_URL=$VITE_WS_URL

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