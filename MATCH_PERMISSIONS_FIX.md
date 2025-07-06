# Match Permissions and Early Start Fix

## Issues Fixed

### 1. **Early Start Eligibility**

**Problem:** All matches showed "This match is not eligible to start early"
**Root Cause:** `canStartEarly` field defaulted to `false` and was never set to `true`

**Solution:**

- Updated `BracketService.ts` to set `canStartEarly: true` for all regular matches
- Updated frontend logic to be more permissive: allows early start unless explicitly disabled
- Improved error messages to be more specific about why a match can't be started early

**Files Changed:**

- `backend/src/services/BracketService.ts` - Set `canStartEarly: true` for new matches
- `frontend/src/components/matches/MatchManagementModal.tsx` - Improved early start logic

### 2. **Score Update Permissions**

**Problem:** Only organizers and players could update scores, authorized score keepers were ignored
**Root Cause:** Frontend permission check didn't include `authorizedScoreKeepers` array

**Solution:**

- Updated `canUpdateScore()` function to check authorized score keepers
- Added proper permission hierarchy: organizers → players → authorized score keepers

**Files Changed:**

- `frontend/src/pages/TournamentDetails.tsx` - Enhanced `canUpdateScore()` function

## Updated Permission Logic

### Early Start Permissions

A match can be started early if:

1. ✅ Match status is "scheduled"
2. ✅ Match hasn't been started yet (`!actualStartTime`)
3. ✅ Early start is not explicitly disabled (`canStartEarly !== false`)

### Score Update Permissions

A user can update match scores if:

1. ✅ **Tournament Organizer** - Can always update any match scores
2. ✅ **Match Player** - Can update scores for matches they're playing in
3. ✅ **Authorized Score Keeper** - Can update scores for matches they're authorized for
4. ❌ Match is not completed

## Backend Changes

### BracketService Updates

```typescript
// Round Robin matches
matches.push({
  tournamentId: tournamentId,
  round: 1,
  player1Id: participants[i].userId,
  player2Id: participants[j].userId,
  status: "scheduled",
  startTime: tournament.startDate,
  canStartEarly: true, // ✅ Now set to true
});

// Knockout tournament matches
roundMatches.push({
  tournamentId: tournamentId,
  round: currentRound,
  player1Id: currentRoundParticipants[i].userId,
  player2Id: currentRoundParticipants[i + 1].userId,
  status: "scheduled",
  startTime: matchStartTime,
  canStartEarly: true, // ✅ Now set to true
});

// Bye matches (auto-completed)
roundMatches.push({
  tournamentId: tournamentId,
  round: currentRound,
  player1Id: byeWinner,
  player2Id: byeWinner,
  status: "completed",
  winner: byeWinner,
  startTime: matchStartTime,
  canStartEarly: false, // ❌ Bye matches don't need early start
});
```

## Frontend Changes

### Enhanced Score Permission Check

```typescript
const canUpdateScore = (match: Match) => {
  if (!user || match.status === "completed") {
    return false;
  }

  // Tournament organizer can always update scores
  if (user.role === "organizer") {
    return true;
  }

  // Players in the match can update scores
  if (match.player1Id === user.id || match.player2Id === user.id) {
    return true;
  }

  // ✅ NEW: Authorized score keepers can update scores
  if (
    match.authorizedScoreKeepers &&
    match.authorizedScoreKeepers.includes(user.id)
  ) {
    return true;
  }

  return false;
};
```

### Improved Early Start Logic

```typescript
const canStartEarly = () => {
  return (
    match.status === "scheduled" &&
    !match.actualStartTime &&
    match.canStartEarly !== false // ✅ Allow unless explicitly disabled
  );
};
```

### Better Error Messages

Now shows specific reasons why a match can't be started early:

- ✅ "You can start this match before its scheduled time if both players are ready."
- ❌ "This match has already been started."
- ❌ "This match has been completed."
- ❌ "This match is already in progress."
- ❌ "Early start has been disabled for this match."
- ❌ "This match cannot be started early at this time."

## Testing

### For Early Start Feature

1. **Create a new tournament** and add participants
2. **Start the tournament** to generate matches
3. **Navigate to match management** and verify:
   - ✅ Scheduled matches show "You can start this match..."
   - ✅ "Start Match Now" button is enabled
   - ✅ Can successfully start matches early

### For Score Update Permissions

1. **Login as organizer** - Should be able to update any match scores
2. **Login as player** - Should be able to update scores for their own matches
3. **Add score keeper** to a match - Should be able to update that match's scores
4. **Login as unrelated user** - Should NOT be able to update any scores

## Database Migration Note

For existing tournaments with matches that have `canStartEarly: false`, you may want to run an update query:

```sql
-- Update existing scheduled matches to allow early start
UPDATE "match"
SET "canStartEarly" = true
WHERE status = 'scheduled'
  AND "canStartEarly" = false;
```

## Impact

### ✅ **Positive Changes**

- Organizers can now start matches early as intended
- Score keepers can properly update scores for authorized matches
- Better user feedback about why actions aren't allowed
- More flexible and intuitive permission system

### 🔧 **No Breaking Changes**

- All existing functionality preserved
- Backwards compatible with existing data
- Enhanced permissions are additive, not restrictive

### 📈 **User Experience Improvements**

- Clear, specific error messages
- Intuitive permission model
- Reduced confusion about match eligibility
- Better tournament day workflow
