# Frontend Environment Variables Documentation

This document outlines all required and optional environment variables for the PickleballLoveAll frontend application.

## Required Environment Variables

### Core API Configuration

- **`VITE_API_URL`** (Required)

  - **Description**: Base URL for the backend API
  - **Local Development**: `http://localhost:3001/api`
  - **Production**: `https://your-backend-domain.com/api`
  - **Example**: `VITE_API_URL=https://api.pickleballloveall.com/api`

- **`VITE_WS_URL`** (Required for WebSocket features)
  - **Description**: WebSocket URL for real-time features
  - **Local Development**: `ws://localhost:3001`
  - **Production**: `wss://your-backend-domain.com`
  - **Example**: `VITE_WS_URL=wss://api.pickleballloveall.com`

### Optional Environment Variables

- **`VITE_ENVIRONMENT`**
  - **Description**: Environment mode
  - **Default**: `development`
  - **Options**: `development`, `production`, `staging`
  - **Example**: `VITE_ENVIRONMENT=production`

### App Metadata (Optional)

- **`VITE_APP_NAME`**

  - **Description**: Application name displayed in the UI
  - **Default**: `Pickleball Planner`
  - **Example**: `VITE_APP_NAME=Pickleball Planner`

- **`VITE_APP_VERSION`**

  - **Description**: Application version
  - **Default**: `1.0.0`
  - **Example**: `VITE_APP_VERSION=1.2.0`

- **`VITE_APP_DESCRIPTION`**

  - **Description**: Application description
  - **Default**: `Your personal pickleball tournament planner`
  - **Example**: `VITE_APP_DESCRIPTION=Professional pickleball tournament management`

- **`VITE_APP_AUTHOR`**

  - **Description**: Application author/company name
  - **Example**: `VITE_APP_AUTHOR=YourCompany`

- **`VITE_APP_COPYRIGHT`**

  - **Description**: Copyright notice
  - **Example**: `VITE_APP_COPYRIGHT=© 2024 YourCompany`

- **`VITE_APP_LICENSE`**

  - **Description**: Application license
  - **Default**: `MIT`
  - **Example**: `VITE_APP_LICENSE=MIT`

- **`VITE_APP_THEME_COLOR`**

  - **Description**: Primary theme color for the application
  - **Example**: `VITE_APP_THEME_COLOR=#4CAF50`

- **`VITE_APP_LOGO_URL`**

  - **Description**: Path to application logo
  - **Default**: `/logo.png`
  - **Example**: `VITE_APP_LOGO_URL=/assets/custom-logo.png`

- **`VITE_APP_FAVICON_URL`**
  - **Description**: Path to favicon
  - **Default**: `/favicon.ico`
  - **Example**: `VITE_APP_FAVICON_URL=/assets/favicon.ico`

## Environment File Examples

### Development (.env)

```bash
# Core Configuration
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
VITE_ENVIRONMENT=development

# App Metadata
VITE_APP_NAME=Pickleball Planner
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Your personal pickleball tournament planner
VITE_APP_AUTHOR=Venkatagurrala
VITE_APP_COPYRIGHT=© 2023 Venkatagurrala
VITE_APP_LICENSE=MIT
VITE_APP_THEME_COLOR=#4CAF50
VITE_APP_LOGO_URL=/logo.png
VITE_APP_FAVICON_URL=/favicon.ico
```

### Production (.env.production)

```bash
# Core Configuration - UPDATE THESE FOR YOUR PRODUCTION ENVIRONMENT
VITE_API_URL=https://api.pickleballloveall.com/api
VITE_WS_URL=wss://api.pickleballloveall.com
VITE_ENVIRONMENT=production

# App Metadata
VITE_APP_NAME=Pickleball Planner
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Professional pickleball tournament management
VITE_APP_AUTHOR=YourCompany
VITE_APP_COPYRIGHT=© 2024 YourCompany
VITE_APP_LICENSE=MIT
VITE_APP_THEME_COLOR=#4CAF50
VITE_APP_LOGO_URL=/logo.png
VITE_APP_FAVICON_URL=/favicon.ico
```

### Coolify Environment Variables

When deploying to Coolify, set these environment variables in your frontend service:

**Required:**

- `VITE_API_URL`: Set to your backend service URL (e.g., `https://backend.yourdomain.com/api`)
- `VITE_WS_URL`: Set to your backend WebSocket URL (e.g., `wss://backend.yourdomain.com`)

**Optional (but recommended):**

- `VITE_ENVIRONMENT=production`
- All `VITE_APP_*` variables as needed for your branding

## Important Notes

1. **No Hardcoded URLs**: The frontend code has been updated to use environment variables consistently. No hardcoded `localhost` URLs should remain.

2. **Vite Prefix**: All custom environment variables must be prefixed with `VITE_` to be accessible in the frontend build.

3. **Build Time**: These variables are embedded at build time, so you need to rebuild the frontend when changing them.

4. **Security**: Don't put sensitive information in frontend environment variables as they are publicly accessible in the built application.

5. **Default Fallbacks**: The application has sensible defaults for most variables, but `VITE_API_URL` and `VITE_WS_URL` should always be set explicitly.

## Troubleshooting

- If you see `localhost:3000` connections in production, check that `VITE_API_URL` is set correctly
- If WebSocket connections fail, verify `VITE_WS_URL` is set with the correct protocol (`ws://` for HTTP, `wss://` for HTTPS)
- Remember to rebuild the frontend after changing environment variables
- Check browser developer tools network tab to see which URLs are being used
