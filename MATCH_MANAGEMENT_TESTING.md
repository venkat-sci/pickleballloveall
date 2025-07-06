# Testing Guide: Organizer Match Management

## Quick Test Setup

### 1. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Create Test Data

```bash
# In backend directory
npm run create-test-data
```

This creates:

- Test organizer account: `organizer@test.com` / `password123`
- Test players and tournaments
- Sample matches with various statuses

### 3. Login as Organizer

1. Go to `http://localhost:5173`
2. Click "Login"
3. Use credentials: `organizer@test.com` / `password123`

## Feature Testing

### Testing Early Match Start

1. **Navigate to Tournament**

   - Go to "Tournaments" page
   - Click on any active tournament
   - Switch to "Matches" tab

2. **Open Match Management**

   - Find a scheduled match
   - Click the purple "Manage" button
   - Modal opens with two tabs

3. **Start Match Early**
   - Stay on "Schedule Management" tab
   - Look for orange "Start Match Early" section
   - Click "Start Match Now" button
   - Verify success message appears
   - Check that "Actual Start" time is updated

### Testing Score Keeper Management

1. **Open Score Keepers Tab**

   - In the same match management modal
   - Click "Score Keepers" tab

2. **Search for Users**

   - Type an email in the search box (e.g., `player1@test.com`)
   - Click "Search" button
   - User should appear in results

3. **Add Score Keeper**

   - Click "Add" button next to the user
   - Verify success message
   - User should appear in "Authorized Score Keepers" list

4. **Remove Score Keeper**
   - Click red "Remove" button next to an authorized keeper
   - Verify success message
   - User should be removed from the list

### Testing from Tournament Bracket

1. **Navigate to Bracket View**

   - Go to tournament details
   - Click "Bracket" tab

2. **Access Match Management**

   - Find any match card
   - Click blue "Manage Match" button
   - Same management modal should open

3. **Verify Both Buttons Work**
   - "Manage Match" (blue) - opens full management modal
   - "Edit Schedule" (gray) - opens simple schedule editor

## Expected Behaviors

### Early Start Feature

- ✅ Only shows for scheduled matches
- ✅ Only available if `canStartEarly` is true
- ✅ Button disabled after match is started
- ✅ Updates actual start time immediately
- ✅ Shows confirmation message

### Score Keeper Feature

- ✅ Search returns max 10 results
- ✅ Can't add same user twice
- ✅ Shows user's name and email
- ✅ Immediate update after add/remove
- ✅ Clear permissions explanation

### UI/UX Features

- ✅ Smooth animations and transitions
- ✅ Color-coded status indicators
- ✅ Responsive on mobile devices
- ✅ Proper error messages
- ✅ Loading states during API calls

## Common Issues & Solutions

### Issue: "Manage" Button Not Visible

**Solution:** Ensure you're logged in as an organizer and viewing your own tournament

### Issue: Can't Start Match Early

**Possible Causes:**

- Match is not in "scheduled" status
- Match has `canStartEarly: false`
- Match already has an actual start time

### Issue: User Search Returns No Results

**Check:**

- User exists in database
- Search query is correct (email or name)
- Backend API is running
- Check browser network tab for errors

### Issue: Score Keeper Changes Not Saving

**Check:**

- Network connection
- Backend API responses
- User has permission to modify the match
- Check browser console for errors

## API Testing

You can also test the APIs directly:

```bash
# Get match score keepers
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/matches/MATCH_ID/score-keepers

# Add score keeper
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID"}' \
  http://localhost:3001/api/matches/MATCH_ID/score-keepers

# Start match early
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/matches/MATCH_ID/start-early

# Search users
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/users/search?q=test@email.com"
```

## Test Scenarios

### Scenario 1: Tournament Day Management

1. Login as organizer
2. View today's matches in tournament bracket
3. Start early matches as players arrive
4. Add venue staff as score keepers for multiple matches
5. Monitor match progress in real-time

### Scenario 2: Remote Tournament Management

1. Login as organizer
2. Add remote score keepers to matches
3. Allow trusted volunteers to update scores
4. Start matches early based on player readiness
5. Track progress remotely

### Scenario 3: Large Tournament Coordination

1. Create tournament with many participants
2. Generate bracket with multiple rounds
3. Assign different score keepers to different courts
4. Manage staggered match start times
5. Handle schedule changes in real-time

## Success Metrics

After testing, you should be able to:

- ✅ Start any scheduled match early as organizer
- ✅ Add any registered user as a score keeper
- ✅ Remove score keepers from matches
- ✅ See real-time updates across all views
- ✅ Handle errors gracefully with clear messages
- ✅ Navigate between schedule and score keeper management seamlessly

## Cleanup

After testing, you can reset the data:

```bash
# In backend directory
npm run seed
```

This will recreate the initial database state with fresh test data.
