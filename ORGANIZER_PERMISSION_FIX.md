# Organizer Permission Fix

## Issue

Organizers were able to update match scores for any tournament, not just tournaments they created. The frontend permission check was using `user?.role === "organizer"` which allowed any user with organizer role to update scores for all matches.

## Root Cause

The frontend was checking if the user has an "organizer" role instead of checking if the user is the organizer of the specific tournament that contains the match.

## Solution

### 1. Updated Match Interface

Added `tournament?: Tournament` property to the Match interface to include tournament information when matches are fetched.

**File: `frontend/src/types/index.ts`**

```typescript
export interface Match {
  id: string;
  tournamentId: string;
  tournament?: Tournament; // Added this line
  // ... other properties
}
```

### 2. Implemented Proper Permission Logic

Created a `canUpdateMatchScore` function that checks multiple conditions:

**File: `frontend/src/pages/Matches.tsx`**

```typescript
const canUpdateMatchScore = (match: Match): boolean => {
  if (!user) return false;

  // Tournament organizer can update scores for their tournaments
  if (match.tournament && match.tournament.organizerId === user.id) {
    return true;
  }

  // Players in the match can update scores
  if (match.player1Id === user.id || match.player2Id === user.id) {
    return true;
  }

  // Authorized score keepers can update scores
  if (
    match.authorizedScoreKeepers &&
    match.authorizedScoreKeepers.includes(user.id)
  ) {
    return true;
  }

  return false;
};
```

### 3. Updated Permission Checks

Replaced the simple role check with the proper permission function:

**Before:**

```tsx
canUpdateScore={user?.role === "organizer"}
```

**After:**

```tsx
canUpdateScore={canUpdateMatchScore(match)}
```

## Security Benefits

1. **Tournament Ownership**: Organizers can only update scores for tournaments they created
2. **Player Participation**: Players can update scores for matches they're participating in
3. **Authorized Score Keepers**: Only designated score keepers can update specific match scores
4. **Defense in Depth**: Backend already had proper permission checks, now frontend matches this security

## Backend Verification

The backend was already properly secured with the `checkScoreUpdatePermission` function that ensures:

- Tournament organizer can only update scores for their own tournaments
- Players can update scores for their own matches
- Authorized score keepers can update designated matches

## Testing

- ✅ Frontend builds successfully
- ✅ Backend builds successfully
- ✅ Permission logic properly restricts organizers to their own tournaments
- ✅ Players and authorized score keepers maintain their update permissions

## Impact

This fix ensures that organizers can only manage matches within tournaments they created, maintaining proper data security and preventing unauthorized score modifications.
