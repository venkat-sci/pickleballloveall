# Environment Variables Quick Reference

## Backend Environment Variables (Coolify)

### Required

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@pickleballloveall-db:5432/pickleballloveall
JWT_SECRET=ef56e9078badfd78b60ea70b9a3d521762dfb5889175b5280dcb704f670a123bd6f782d3a0244eb0db9bf6e2395f610d1d1b3fe50e00ce3f1ae91e5d5bee0b9f
NODE_ENV=production
```

### Optional

```env
PORT=3000
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

## Frontend Environment Variables (Coolify)

### Build-time Variables

```env
VITE_API_URL=https://api.yourdomain.com
VITE_ENVIRONMENT=production
```

## Local Development (docker-compose)

### Database

```env
POSTGRES_DB=pickleballloveall
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
```

### Backend

```env
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/pickleballloveall
JWT_SECRET=ef56e9078badfd78b60ea70b9a3d521762dfb5889175b5280dcb704f670a123bd6f782d3a0244eb0db9bf6e2395f610d1d1b3fe50e00ce3f1ae91e5d5bee0b9f
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:80
```

### Frontend

```env
VITE_API_URL=http://localhost:3000
VITE_ENVIRONMENT=development
```

## Security Notes

1. **JWT_SECRET**: Must be at least 32 characters long
2. **Database Password**: Use a strong, randomly generated password
3. **CORS_ORIGIN**: Only include your actual domains
4. **Never commit secrets**: Use environment variables only

## TypeORM Migration Environment

The following environment variables control TypeORM behavior:

- `migrationsRun: true` in production (auto-run migrations)
- `synchronize: false` in production (never use sync in prod)
- `synchronize: true` in development (for rapid development)

## Coolify Deployment Order

1. **Database First**: Deploy PostgreSQL database
2. **Backend Second**: Deploy with database connection
3. **Frontend Last**: Deploy with backend API URL
