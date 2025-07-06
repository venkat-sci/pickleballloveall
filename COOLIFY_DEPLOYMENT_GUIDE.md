# Coolify Deployment Guide for PickleballLoveAll

## Quick Fix for Current Deployment Error

If you're seeing the error: `cat: can't open '/artifacts/.../Dockerfile': No such file or directory`

**🎯 Recommended Solution: Use Docker Compose (Easiest)**

If you see a "Docker Compose" option in Coolify, this is the easiest approach:

1. **Create Backend Service:**

   - Click "Add Service" → "Docker Compose"
   - **Name**: `pickleballloveall-backend`
   - **Docker Compose File**: Use `docker-compose.backend.yml`
   - Set environment variables (see below)

2. **Create Frontend Service:**
   - Click "Add Service" → "Docker Compose"
   - **Name**: `pickleballloveall-frontend`
   - **Docker Compose File**: Use `docker-compose.frontend.yml`
   - Set environment variables (see below)

**Alternative: Single Combined Service**

- Use `docker-compose.app.yml` to deploy both frontend and backend together

---

**Other Solutions (if Docker Compose not available):**

**The Solution**: You need to tell Coolify where to find your Dockerfile. Depending on your Coolify version, look for one of these fields:

1. **For Backend Application**:

   - **Dockerfile Location**: `backend/Dockerfile` (or `./backend/Dockerfile`)
   - **Build Context**: `backend` (if this field exists)
   - **Working Directory**: `backend` (alternative name)
   - **Source Directory**: `backend` (alternative name)

2. **For Frontend Application**:
   - **Dockerfile Location**: `frontend/Dockerfile` (or `./frontend/Dockerfile`)
   - **Build Context**: `frontend` (if this field exists)
   - **Working Directory**: `frontend` (alternative name)
   - **Source Directory**: `frontend` (alternative name)

**If you don't see "Build Context"**, try these alternatives:

- Look for "Working Directory", "Source Directory", or "Base Directory"
- Some versions use "Docker Build Context" in advanced settings
- Try setting Dockerfile Location to the full path: `./backend/Dockerfile`

**Alternative Solution: Create Root-Level Dockerfiles**

If Coolify doesn't have any build context options, you can create Dockerfiles in your project root that build the subdirectories:

1. Create `/pickleballloveall/Dockerfile.backend`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ .

# Build TypeScript
RUN npm run build

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
```

2. Create `/pickleballloveall/Dockerfile.frontend`:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source code
COPY frontend/ .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Then in Coolify, set:

- Backend: Dockerfile Location to `Dockerfile.backend`
- Frontend: Dockerfile Location to `Dockerfile.frontend`

---

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

## Docker Compose Deployment (Recommended)

### Step 2A: Backend Setup (Using Docker Compose)

1. **Create Backend Service:**

   - Click "Add Service" → "Docker Compose"
   - Choose "Git Repository"
   - Configure:
     - **Name**: `pickleballloveall-backend`
     - **Repository**: Your git repository URL
     - **Branch**: `master`
     - **Auto Deploy**: Enable
     - **Docker Compose File**: `docker-compose.backend.yml`

2. **Set Environment Variables:**

   ```env
   DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@pickleballloveall-db:5432/pickleballloveall
   JWT_SECRET=ef56e9078badfd78b60ea70b9a3d521762dfb5889175b5280dcb704f670a123bd6f782d3a0244eb0db9bf6e2395f610d1d1b3fe50e00ce3f1ae91e5d5bee0b9f
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

3. **Deploy**: Click "Deploy" and monitor logs

### Step 3A: Frontend Setup (Using Docker Compose)

1. **Create Frontend Service:**

   - Click "Add Service" → "Docker Compose"
   - Choose "Git Repository"
   - Configure:
     - **Name**: `pickleballloveall-frontend`
     - **Repository**: Your git repository URL
     - **Branch**: `master`
     - **Auto Deploy**: Enable
     - **Docker Compose File**: `docker-compose.frontend.yml`

2. **Set Environment Variables:**

   ```env
   VITE_API_URL=https://your-backend-domain.com
   ```

3. **Deploy**: Click "Deploy" and monitor logs

### Alternative: Combined Service

Use `docker-compose.app.yml` to deploy both services together:

- **Docker Compose File**: `docker-compose.app.yml`
- Set all environment variables from both backend and frontend

---

## Traditional Application Deployment

### 2.1 Create Backend Application

1. Click "Add Service" → "Application"
2. Choose "Git Repository"
3. Configure:
   - **Name**: `pickleballloveall-backend`
   - **Repository**: Your git repository URL
   - **Branch**: `main` (or `master` if that's your default branch)
   - **Auto Deploy**: Enable
   - **Build Pack**: `dockerfile`
   - **Dockerfile Location**: `backend/Dockerfile` (or `./backend/Dockerfile`)
   - **Build Context**: `backend` (if this field exists)
   - **Working Directory**: `backend` (alternative field name)
   - **Port**: `3000`

**Important**: Look for ANY field that lets you specify the build directory - it might be called "Build Context", "Working Directory", "Source Directory", or "Base Directory". Set it to `backend`.

### 2.2 Set Environment Variables

Add these environment variables in Coolify:

```env
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@pickleballloveall-db:5432/pickleballloveall
JWT_SECRET=ef56e9078badfd78b60ea70b9a3d521762dfb5889175b5280dcb704f670a123bd6f782d3a0244eb0db9bf6e2395f610d1d1b3fe50e00ce3f1ae91e5d5bee0b9f
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
   - **Branch**: `main` (or `master` if that's your default branch)
   - **Auto Deploy**: Enable
   - **Build Pack**: `dockerfile`
   - **Dockerfile Location**: `frontend/Dockerfile` (or `./frontend/Dockerfile`)
   - **Build Context**: `frontend` (if this field exists)
   - **Working Directory**: `frontend` (alternative field name)
   - **Port**: `80`

**Important**: Look for ANY field that lets you specify the build directory - it might be called "Build Context", "Working Directory", "Source Directory", or "Base Directory". Set it to `frontend`.

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

1. **"Dockerfile not found" Error (Docker Compose)**

   - **Error**: `cat: can't open '/artifacts/.../Dockerfile': No such file or directory`
   - **Solution**: Use Docker Compose instead:
     1. Create service with "Docker Compose" option
     2. Set Docker Compose File to `docker-compose.backend.yml` or `docker-compose.frontend.yml`
     3. The compose file handles the build context automatically

2. **"Dockerfile not found" Error (Traditional App)**

   - **Error**: `cat: can't open '/artifacts/.../Dockerfile': No such file or directory`
   - **Solutions**:
     1. Look for build directory fields: "Build Context", "Working Directory", "Source Directory"
     2. Set Dockerfile Location to `backend/Dockerfile` and directory field to `backend`
     3. If no directory field exists, use the root-level Dockerfiles:
        - Set Dockerfile Location to `Dockerfile.backend` for backend
        - Set Dockerfile Location to `Dockerfile.frontend` for frontend
   - This tells Coolify to look for the Dockerfile in the correct location

3. **Migration Failures**

   - Check database connection
   - Verify DATABASE_URL format
   - Review migration logs

4. **CORS Errors**

   - Verify CORS_ORIGIN environment variable
   - Check frontend domain matches

5. **Build Failures**

   - Check Dockerfile syntax
   - Verify all dependencies in package.json
   - Review build logs in Coolify

6. **Database Connection Issues**
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
JWT_SECRET=ef56e9078badfd78b60ea70b9a3d521762dfb5889175b5280dcb704f670a123bd6f782d3a0244eb0db9bf6e2395f610d1d1b3fe50e00ce3f1ae91e5d5bee0b9f
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
