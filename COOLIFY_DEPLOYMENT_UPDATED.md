# Coolify Deployment Guide - Updated

## Issues Fixed

### 1. Frontend Environment Variables Issue

**Problem**: Vite environment variables were being set at runtime, but Vite needs them during build time.

**Solution**:

- Updated `frontend/Dockerfile` to accept build arguments
- Updated `docker-compose.app.yml` to pass environment variables as build args
- Environment variables are now baked into the build, not set at runtime

### 2. Backend Port Mismatch

**Problem**: Backend was defaulting to port 3001 instead of 3000.

**Solution**:

- Updated `backend/src/index.ts` and `backend/src/scripts/start.ts` to default to port 3000

### 3. CORS Configuration

**Problem**: CORS origins need to include the production domain.

**Solution**:

- Backend CORS configuration reads from `CORS_ORIGIN` environment variable
- Should be set to your production frontend URL

## Coolify Environment Variables Setup

### Backend Service Environment Variables:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://[your-db-config]
JWT_SECRET=[your-32-char-secret]
CORS_ORIGIN=https://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io
```

### Frontend Service Environment Variables:

```
VITE_API_URL=http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/api
VITE_ENVIRONMENT=production
VITE_WS_URL=wss://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io
```

## Deployment Steps

1. **Set Environment Variables in Coolify:**

   - Go to your application in Coolify
   - Set the environment variables listed above for each service
   - Make sure VITE\_\* variables are set for the frontend service

2. **Rebuild and Deploy:**

   ```bash
   # Force rebuild to pick up new environment variables
   docker-compose -f docker-compose.app.yml build --no-cache
   docker-compose -f docker-compose.app.yml up -d
   ```

3. **Verify Configuration:**
   - Check frontend is using production API URL (not localhost:3001)
   - Check backend CORS allows your frontend domain
   - Test API calls from frontend

## Verification Commands

### Check if frontend is using correct API URL:

```bash
# In browser console, check the config
console.log(window.location.origin);
# Should not see any localhost:3001 in network requests
```

### Check backend CORS configuration:

```bash
curl -H "Origin: https://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/api/auth/register
```

## Common Issues and Solutions

### Issue: Still seeing localhost:3001 in network requests

**Solution**: The frontend build wasn't updated with new environment variables. Force rebuild:

```bash
docker-compose -f docker-compose.app.yml build --no-cache frontend
```

### Issue: CORS errors

**Solution**: Ensure CORS_ORIGIN environment variable includes your frontend domain:

```
CORS_ORIGIN=https://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io
```

### Issue: Environment variables not taking effect

**Solution**: Vite requires build-time variables. Make sure:

1. Variables are set in Coolify before building
2. Docker build uses `--no-cache` to force fresh build
3. Variables start with `VITE_` prefix

## Key Changes Made

1. **frontend/Dockerfile**: Added ARG and ENV for build-time variables
2. **docker-compose.app.yml**: Added build args for frontend
3. **backend ports**: Changed default from 3001 to 3000
4. **Environment setup**: Proper production configuration

After following these steps, your frontend should connect to the production API instead of localhost:3001.
