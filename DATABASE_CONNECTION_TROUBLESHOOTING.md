# Database Connection Troubleshooting Guide

## Problem: Backend Cannot Connect to Database

**Error**: `Error: getaddrinfo EAI_AGAIN asco0sowgcog8c040k0gsw4c`

This error indicates that your backend service cannot resolve the database hostname. Here are the solutions:

## Solution 1: Verify Database Connection String

### Check Your DATABASE_URL Format

The DATABASE_URL should follow this format:

```
postgresql://username:password@hostname:port/database_name
```

### In Coolify Environment Variables

Make sure your `DATABASE_URL` is set correctly in Coolify:

```
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@YOUR_DB_SERVICE_NAME:5432/pickleballloveall
```

### Find Your Database Service Name

1. Go to your database service in Coolify
2. Look for the internal hostname/service name
3. It might be something like: `pickleballloveall-db` or the auto-generated name

## Solution 2: Network Configuration

### Updated Backend Docker Compose

The backend now connects to Coolify's network:

```yaml
networks:
  - app-network
  - coolify  # Added for Coolify inter-service communication

networks:
  coolify:
    external: true  # Coolify's network
```

## Solution 3: Deployment Strategy Options

### Option A: Separate Services (Current Setup)

- Deploy database as separate service
- Deploy backend as separate service
- Ensure they're on the same network
- Use internal hostnames in DATABASE_URL

### Option B: Combined Service

Use `docker-compose.app.yml` which includes everything in one stack

## Solution 4: Debug Database Connection

### Check Health Endpoint

Visit your backend health endpoint: `https://your-backend-domain/health`

It will show debug information:

```json
{
  "status": "unhealthy",
  "services": {
    "database": "disconnected"
  },
  "debug": {
    "database_url": "set",
    "error_code": "EAI_AGAIN",
    "hostname": "asco0sowgcog8c040k0gsw4c"
  }
}
```

## Solution 5: Step-by-Step Fix Process

### 1. Verify Database Service

```bash
# In Coolify, check if database service is running
# Note the service name and internal hostname
```

### 2. Update DATABASE_URL

```env
# Replace with your actual database service name
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_ACTUAL_DB_SERVICE_NAME:5432/pickleballloveall
```

### 3. Redeploy Backend

- Push updated code
- Redeploy backend service in Coolify
- Monitor logs for connection success

### 4. Verify Connection

- Check health endpoint: `/health`
- Should show `"database": "connected"`

## Solution 6: Alternative Database URLs

### If Using External Database

```env
DATABASE_URL=postgresql://postgres:password@your-external-db.com:5432/pickleballloveall
```

### If Using Coolify Internal Database

```env
# Pattern: postgresql://username:password@service-name:5432/database
DATABASE_URL=postgresql://postgres:yourpassword@pickleballloveall-db:5432/pickleballloveall
```

## Common Issues and Fixes

### Issue: Wrong Hostname

**Error**: `getaddrinfo EAI_AGAIN hostname`
**Fix**: Update DATABASE_URL with correct service name

### Issue: Network Isolation

**Error**: Services can't reach each other
**Fix**: Ensure both services are on Coolify network

### Issue: Database Not Ready

**Error**: Connection refused
**Fix**: Increase health check start_period to 60s

### Issue: Wrong Credentials

**Error**: Authentication failed
**Fix**: Verify username/password in DATABASE_URL

## Testing Connection

### Manual Test (if you have shell access)

```bash
# Inside backend container
nslookup your-db-service-name
pg_isready -h your-db-service-name -p 5432
```

### Health Check Test

```bash
curl https://your-backend-domain/health
```

## Final Deployment Checklist

- [ ] Database service is running
- [ ] Backend has correct DATABASE_URL
- [ ] Both services on same network
- [ ] Health check shows database connected
- [ ] No EAI_AGAIN errors in logs

## Need More Help?

1. Check Coolify logs for both services
2. Verify network configuration
3. Test DATABASE_URL format
4. Check service names and hostnames
5. Ensure database is accessible

The key is getting the correct hostname for your database service in the DATABASE_URL!
