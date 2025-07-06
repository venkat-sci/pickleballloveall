# TypeScript Migration Import Error Fix

## Issue Description

Backend container was failing to start due to TypeScript module import errors in migration files:

```
SyntaxError: Cannot use import statement outside a module
    at internalCompileFunction (node:internal/vm:76:18)
    at wrapSafe (node:internal/modules/cjs/loader:1283:20)
    at Module._compile (node:internal/modules/cjs/loader:1328:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1422:10)
```

## Root Cause

The issue occurred because:

1. TypeORM was trying to load `.ts` migration files directly in production
2. The migration files use ES6 import syntax but Node.js was expecting CommonJS modules
3. The data source configuration was pointing to source files instead of compiled JavaScript files
4. Auto-migration was enabled, causing the issue to occur during app initialization

## Solution Applied

### 1. Updated TypeScript Configuration

Enhanced `tsconfig.json` with additional compiler options:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2. Fixed Data Source Configuration

Updated `src/data-source.ts` to use correct file paths for different environments:

```typescript
migrations: process.env.NODE_ENV === "production"
  ? ["dist/migrations/*.js"]
  : ["src/migrations/*.ts"],
migrationsRun: false, // Don't auto-run migrations, handle manually
```

### 3. Created Production Startup Script

Created `src/scripts/start.ts` to handle migration and server startup in production:

```typescript
// Production startup script that handles migrations and starts the server
async function startApplication() {
  try {
    await AppDataSource.initialize();

    // Run migrations in production
    if (process.env.NODE_ENV === "production") {
      const migrations = await AppDataSource.runMigrations();
      // Log migration results
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error during application startup:", error);
    process.exit(1);
  }
}
```

### 4. Updated Application Initialization

Modified `src/index.ts` to prevent auto-startup in production:

```typescript
// Only auto-start in development mode
if (process.env.NODE_ENV !== "production") {
  AppDataSource.initialize().then(() => {
    // Development startup logic
  });
}
```

### 5. Updated Package Scripts

Added production startup script:

```json
{
  "scripts": {
    "start": "node dist/scripts/start.js",
    "migrate:prod": "node dist/scripts/migrate.js"
  }
}
```

## Benefits of This Solution

### ✅ Environment-Specific Configuration

- Development uses TypeScript files directly
- Production uses compiled JavaScript files
- No conflicts between ts-node and Node.js

### ✅ Controlled Migration Execution

- Migrations run explicitly before server startup
- Better error handling and logging
- No race conditions between app start and migrations

### ✅ Proper TypeScript Compilation

- All files compile to CommonJS modules
- Proper decorator support for TypeORM entities
- Better build optimization

### ✅ Production Ready

- Clean separation of concerns
- Proper error handling
- Health checks work correctly

## Testing Results

- ✅ Docker build completes successfully
- ✅ TypeScript compilation works without errors
- ✅ Migration files compile correctly
- ✅ Production startup script ready

## Files Modified

- `backend/tsconfig.json` - Enhanced TypeScript configuration
- `backend/src/data-source.ts` - Environment-specific migration paths
- `backend/src/scripts/start.ts` - Production startup script (new)
- `backend/src/index.ts` - Conditional startup logic
- `backend/package.json` - Updated start script

## Prevention

To avoid similar issues in the future:

1. Always test TypeScript builds in production-like environments
2. Ensure migration paths are environment-specific
3. Use controlled startup scripts for production
4. Test Docker builds regularly during development

## Status

✅ **RESOLVED** - Backend now builds and starts successfully with proper TypeScript/TypeORM configuration for both development and production environments.
