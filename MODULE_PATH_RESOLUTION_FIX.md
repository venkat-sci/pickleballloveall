# Module Path Resolution Fix

## Issue Description

Backend container was failing to start with a module resolution error:

```
Error: Cannot find module './data-source'
Require stack:
- /app/dist/scripts/start.js
```

## Root Cause

The production startup script (`src/scripts/start.ts`) was using incorrect relative paths when requiring modules. When compiled to `/app/dist/scripts/start.js`, the script was looking for:

- `./data-source` (which would be `/app/dist/scripts/data-source.js`)
- `./index` (which would be `/app/dist/scripts/index.js`)

But the actual compiled files are located at:

- `/app/dist/data-source.js`
- `/app/dist/index.js`

## Solution Applied

### Fixed Relative Paths

Updated `src/scripts/start.ts` to use correct relative paths:

**Before:**

```typescript
const { AppDataSource } = require("./data-source");
const app = require("./index").default;
```

**After:**

```typescript
const { AppDataSource } = require("../data-source");
const app = require("../index").default;
```

### Why This Works

When the TypeScript is compiled:

- Source: `src/scripts/start.ts` → Compiled: `dist/scripts/start.js`
- Source: `src/data-source.ts` → Compiled: `dist/data-source.js`
- Source: `src/index.ts` → Compiled: `dist/index.js`

The startup script needs to go "up" one directory level (`../`) to access the sibling files in the `dist` folder.

## File Structure Reference

```
/app/
├── dist/
│   ├── data-source.js          ← Target file
│   ├── index.js                ← Target file
│   └── scripts/
│       └── start.js            ← Script location (needs ../ to reach siblings)
├── src/
│   ├── data-source.ts
│   ├── index.ts
│   └── scripts/
│       └── start.ts
└── package.json
```

## Verification Steps

### 1. Local Build Test

```bash
cd backend
npm run build
node dist/scripts/start.js
```

### 2. Docker Build Test

```bash
cd backend
docker build -t backend-test .
```

### 3. Check Compiled Paths

```bash
# Verify the compiled startup script has correct paths
cat backend/dist/scripts/start.js | grep require
```

Should show:

```javascript
const { AppDataSource } = require("../data-source");
const app = require("../index").default;
```

## Prevention

When creating scripts in subdirectories that need to import from parent directories:

1. Always consider the compiled file structure, not just the source structure
2. Use relative paths based on the final compiled location
3. Test both TypeScript compilation and runtime execution
4. Verify Docker builds work with the compiled paths

## Status

✅ **RESOLVED** - Backend startup script now correctly resolves module paths and container starts successfully.

## Testing Results

- ✅ TypeScript compilation works correctly
- ✅ Docker build completes successfully
- ✅ Module paths resolve correctly in production
- ✅ Startup script ready for deployment
