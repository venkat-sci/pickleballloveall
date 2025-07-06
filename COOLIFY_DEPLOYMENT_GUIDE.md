# Coolify Deployment Guide for PickleballLoveAll

## Overview

This guide will help you deploy the PickleballLoveAll application to Coolify with separate instances for frontend, backend, and database using TypeORM migrations.

## Prerequisites

- Coolify instance running
- Git repository with the application code
- Domain names configured (optional but recommended)

## Step 1: Database Setup

### 1.1 Create PostgreSQL Database Service

1. Login to Coolify Dashboard
2. Navigate to your project
3. Click "Add Service" → "Database"
4. Select "PostgreSQL"
5. Configure:
   - **Name**: `pickleballloveall-db`
   - **Database Name**: `pickleballloveall`
   - **Username**: `postgres`
   - **Password**: Generate a strong password (save this!)
   - **Version**: `15-alpine`
6. Click "Deploy"
7. Wait for deployment to complete

### 1.2 Note Database Connection Details

After deployment, note the internal connection string:

```
postgresql://postgres:YOUR_PASSWORD@pickleballloveall-db:5432/pickleballloveall
```

## Step 2: Backend Setup

### 2.1 Create Backend Application

1. Click "Add Service" → "Application"
2. Choose "Git Repository"
3. Configure:
   - **Name**: `pickleballloveall-backend`
   - **Repository**: Your git repository URL
   - **Branch**: `main`
   - **Auto Deploy**: Enable
   - **Build Pack**: `dockerfile`
   - **Dockerfile Location**: `backend/Dockerfile`
   - **Build Context**: `backend`
   - **Port**: `3000`

### 2.2 Set Environment Variables

Add these environment variables in Coolify:

```env
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@pickleballloveall-db:5432/pickleballloveall
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
```

### 2.3 Deploy Backend

1. Click "Deploy"
2. Monitor build logs for any errors
3. Wait for deployment to complete
4. Verify health check at `/health` endpoint

**Important**: TypeORM migrations will run automatically on startup!

## Step 3: Frontend Setup

### 3.1 Create Frontend Application

1. Click "Add Service" → "Application"
2. Choose "Git Repository"
3. Configure:
   - **Name**: `pickleballloveall-frontend`
   - **Repository**: Your git repository URL
   - **Branch**: `main`
   - **Auto Deploy**: Enable
   - **Build Pack**: `dockerfile`
   - **Dockerfile Location**: `frontend/Dockerfile`
   - **Build Context**: `frontend`
   - **Port**: `80`

### 3.2 Set Build Environment Variables

Add these environment variables:

```env
VITE_API_URL=https://your-backend-domain.com
VITE_ENVIRONMENT=production
```

### 3.3 Deploy Frontend

1. Click "Deploy"
2. Monitor build logs
3. Wait for deployment to complete

## Step 4: Domain Configuration

### 4.1 Setup Backend Domain

1. Go to backend service settings
2. Under "Domains" section
3. Add custom domain: `api.yourdomain.com`
4. Enable SSL certificate
5. Wait for certificate generation

### 4.2 Setup Frontend Domain

1. Go to frontend service settings
2. Under "Domains" section
3. Add custom domain: `yourdomain.com`
4. Add www redirect: `www.yourdomain.com`
5. Enable SSL certificate

### 4.3 Update Environment Variables

After domains are set, update backend CORS:

```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

And update frontend API URL if needed:

```env
VITE_API_URL=https://api.yourdomain.com
```

## Step 5: Verification

### 5.1 Test Database Migrations

Check backend logs to confirm migrations ran:

```
✅ Database connected successfully
🔄 Running in production mode
✅ Successfully ran X migrations
🚀 Server running on port 3000
```

### 5.2 Test API Health

Visit: `https://api.yourdomain.com/health`
Should return:

```json
{
  "status": "healthy",
  "timestamp": "...",
  "services": {
    "database": "connected",
    "server": "running"
  }
}
```

### 5.3 Test Frontend

1. Visit: `https://yourdomain.com`
2. Verify all pages load
3. Test user registration/login
4. Create test tournament
5. Verify API integration works

## Migration Management

### Running Migrations Manually (if needed)

1. Connect to backend container terminal in Coolify
2. Run: `npm run migration:run`

### Creating New Migrations

1. Locally: `npm run migration:generate -- src/migrations/NewFeature`
2. Commit and push to trigger auto-deployment

### Rolling Back Migrations

1. Connect to backend container terminal
2. Run: `npm run migration:revert`

## Monitoring and Maintenance

### Health Checks

- Backend: Coolify monitors `/health` endpoint
- Frontend: Coolify monitors root `/` endpoint
- Database: Coolify monitors PostgreSQL connection

### Logs

- Check application logs in Coolify dashboard
- Monitor for migration errors
- Watch for CORS or connection issues

### Backups

Set up automated database backups in Coolify:

1. Go to database service
2. Enable automated backups
3. Set retention period

## Troubleshooting

### Common Issues

1. **Migration Failures**

   - Check database connection
   - Verify DATABASE_URL format
   - Review migration logs

2. **CORS Errors**

   - Verify CORS_ORIGIN environment variable
   - Check frontend domain matches

3. **Build Failures**

   - Check Dockerfile syntax
   - Verify all dependencies in package.json
   - Review build logs in Coolify

4. **Database Connection Issues**
   - Confirm database service is running
   - Verify connection string format
   - Check network connectivity between services

### Debug Commands

```bash
# Check migration status
npm run migration:show

# Test database connection
npm run typeorm -- query "SELECT 1"

# View TypeORM logs
NODE_ENV=development npm start
```

## Environment Variables Reference

### Backend Environment Variables

```env
DATABASE_URL=postgresql://postgres:PASSWORD@pickleballloveall-db:5432/pickleballloveall
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend Environment Variables

```env
VITE_API_URL=https://api.yourdomain.com
VITE_ENVIRONMENT=production
```

## Security Considerations

1. **Strong Database Password**: Use a randomly generated password
2. **JWT Secret**: Use a cryptographically secure random string (32+ chars)
3. **HTTPS**: Always use SSL certificates for production
4. **CORS**: Restrict to your actual domain names
5. **Environment Variables**: Never commit secrets to git

## Production Checklist

- [ ] Database deployed and accessible
- [ ] Backend deployed with health checks passing
- [ ] Frontend deployed and accessible
- [ ] Domains configured with SSL
- [ ] Environment variables set correctly
- [ ] Migrations completed successfully
- [ ] CORS configured properly
- [ ] Health checks monitoring enabled
- [ ] Backups configured
- [ ] Logs monitoring set up

Your PickleballLoveAll application should now be fully deployed and running on Coolify!
