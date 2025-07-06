# Frontend Environment Variable Fix Summary

## Problem Identified

The frontend was connecting to `http://localhost:3000` instead of the correct backend URL because:

1. **Wrong fallback URL**: `environment.ts` had fallback to `localhost:3000` instead of `localhost:3001`
2. **Hardcoded URLs**: Components had hardcoded `localhost:3001` URLs instead of using environment config
3. **Inconsistent WebSocket URL**: `.env` had `http://localhost:3001/ws` instead of `ws://localhost:3001`
4. **Missing documentation**: No clear documentation of required environment variables

## Changes Made

### 1. Fixed Environment Configuration (`frontend/src/config/environment.ts`)

- ✅ Changed fallback from `localhost:3000` to `localhost:3001/api`
- ✅ Fixed WebSocket URL fallback from `ws://localhost:3000` to `ws://localhost:3001`

### 2. Updated Components to Use Environment Config

- ✅ **Avatar.tsx**: Replaced hardcoded `localhost:3001/api` with `config.apiUrl`
- ✅ **ProfilePictureUpload.tsx**: Replaced hardcoded `localhost:3001/api` with `config.apiUrl`
- ✅ **useSocket.ts**: Updated to use `config.wsUrl` (when socket code is enabled)

### 3. Fixed Local Development Environment

- ✅ **frontend/.env**: Changed `VITE_WS_URL` from `http://localhost:3001/ws` to `ws://localhost:3001`

### 4. Documentation Created

- ✅ **FRONTEND_ENVIRONMENT_VARIABLES.md**: Comprehensive documentation of all frontend environment variables
- ✅ **ENVIRONMENT_VARIABLES.md**: Updated with correct frontend environment variable examples

### 5. Clean Build Verification

- ✅ Removed old `dist/` directory containing hardcoded URLs
- ✅ Built fresh frontend with correct environment variables
- ✅ Verified no hardcoded `localhost` URLs remain in built assets

## Required Environment Variables for Production

### Frontend (Coolify)

```env
# Required
VITE_API_URL=https://your-backend-domain.com/api
VITE_WS_URL=wss://your-backend-domain.com
VITE_ENVIRONMENT=production

# Optional (branding)
VITE_APP_NAME=Pickleball Planner
VITE_APP_VERSION=1.0.0
```

### Backend CORS Configuration

Make sure your backend includes the frontend domain in `CORS_ORIGIN`:

```env
CORS_ORIGIN=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

## Verification Steps

1. **Local Development**:

   - Frontend should connect to `http://localhost:3001/api`
   - WebSocket should connect to `ws://localhost:3001` (when enabled)

2. **Production**:

   - Set `VITE_API_URL` to your backend domain with `/api` suffix
   - Set `VITE_WS_URL` to your backend domain with `wss://` protocol
   - Rebuild frontend after changing environment variables

3. **Browser Network Tab**:
   - Check that API calls go to the correct domain
   - No requests should go to `localhost` in production

## Important Notes

- ✅ **No hardcoded URLs**: All URLs now use environment variables
- ✅ **Consistent API structure**: All API calls use `/api` suffix consistently
- ✅ **Proper fallbacks**: Development fallbacks point to correct ports
- ✅ **Clean build**: Removed old build artifacts with hardcoded URLs
- ⚠️ **Rebuild required**: Frontend must be rebuilt when environment variables change
- ⚠️ **Socket.io**: WebSocket code is currently commented out in `useSocket.ts`

## Troubleshooting

If you still see `localhost:3000` connections:

1. Check that `VITE_API_URL` is set correctly in your environment
2. Rebuild the frontend (`npm run build`)
3. Clear browser cache
4. Check browser Network tab to see actual URLs being used

The frontend is now properly configured to use environment variables for all backend connections.
