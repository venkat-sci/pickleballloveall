# Production Environment Variables for pickleballloveall.com

## Frontend Environment Variables:

VITE_API_URL=http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/api
VITE_ENVIRONMENT=production
VITE_WS_URL=wss://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io

## Backend Environment Variables:

NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://pickleballloveall.com
JWT_SECRET=[your-jwt-secret]
DATABASE_URL=[your-database-url]

## Important Notes:

1. Frontend domain: https://pickleballloveall.com
2. Backend domain: http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io
3. CORS must allow the frontend domain
4. Environment variables must be set BEFORE building the frontend
