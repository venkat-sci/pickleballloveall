# 🚀 Quick Start Guide - Tournament Bracket System Testing

## Prerequisites Check

- [ ] Node.js installed (v18+)
- [ ] PostgreSQL or MySQL database running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed

## 1. Quick Setup (5 minutes)

### Start Backend

```bash
cd /Users/venkatagurrala/Documents/projects/node/pickleballplanner-project/backend
npm install
npm run dev
```

### Start Frontend

```bash
cd /Users/venkatagurrala/Documents/projects/node/pickleballplanner-project/frontend
npm install
npm run dev
```

## 2. Create Test Data (2 minutes)

### Option A: Automated Script

```bash
cd /Users/venkatagurrala/Documents/projects/node/pickleballplanner-project/backend
npm run create-test-data
```

### Option B: Manual Creation

1. Go to http://localhost:5173/register
2. Create users:
   - `organizer@test.com` / `password123`
   - `player1@test.com` / `password123` (rating: 5.0)
   - `player2@test.com` / `password123` (rating: 4.8)
   - `player3@test.com` / `password123` (rating: 4.6)
   - `player4@test.com` / `password123` (rating: 4.4)

## 3. Test Tournament Creation (3 minutes)

1. **Login as organizer**: `organizer@test.com` / `password123`
2. **Create tournament**:
   - Go to Tournaments → Create Tournament
   - Name: "Test Knockout"
   - Format: Knockout
   - Max participants: 6
   - Start: 1 hour from now
3. **Add participants**: Login as each player and join tournament

## 4. Test Automatic Bracket System (10 minutes)

### 4.1 Start Tournament

1. Login as organizer
2. Go to tournament details
3. Click "Start Tournament"
4. ✅ **Verify**: First round matches are created automatically

### 4.2 View Bracket

1. Click "Bracket" tab
2. ✅ **Verify**:
   - Players are seeded by rating
   - Byes handled correctly (if odd number)
   - Match timing shows 30-min intervals

### 4.3 Complete Matches

1. Go to each match in Round 1
2. Update scores: e.g., `[11, 8, 11]` vs `[9, 11, 6]`
3. ✅ **Verify**: Winner determined automatically

### 4.4 Test Automatic Progression

1. Complete all Round 1 matches
2. ✅ **Verify**: Round 2 automatically created
3. ✅ **Verify**: Winners advance to new matches
4. ✅ **Verify**: Tournament statistics update

### 4.5 Complete Tournament

1. Continue completing matches
2. ✅ **Verify**: Tournament status becomes "completed"
3. ✅ **Verify**: Final winner determined

## 5. Test Organizer Controls (5 minutes)

### 5.1 Edit Match Schedule

1. In bracket view, click "Edit Schedule" on any match
2. Change start time and court
3. ✅ **Verify**: Changes are saved

### 5.2 Manual Round Generation

1. Complete some but not all matches in a round
2. Click "Generate Next Round"
3. ✅ **Verify**: Error message shown
4. Complete remaining matches
5. Click "Generate Next Round" again
6. ✅ **Verify**: Next round created

## 6. API Testing (Optional)

```bash
cd /Users/venkatagurrala/Documents/projects/node/pickleballplanner-project
./test-api.sh
```

## 7. Common Test Scenarios

### Scenario 1: Odd Number Tournament (6 players)

- ✅ Highest seed gets bye to Round 2
- ✅ Bracket balances correctly
- ✅ Tournament completes with 3 rounds

### Scenario 2: Round Robin Tournament

1. Create tournament with format "Round-Robin"
2. Add 4 players
3. Start tournament
4. ✅ **Verify**: 6 matches created (each vs each)
5. ✅ **Verify**: All matches in "Round 1"

### Scenario 3: Large Tournament (8+ players)

- ✅ Proper seeding maintained
- ✅ Multiple rounds generate correctly
- ✅ Performance remains good

## 8. Troubleshooting

### Backend Issues

- **Port conflict**: Change port in backend/.env
- **Database**: Check connection in data-source.ts
- **Auth errors**: Verify JWT secret

### Frontend Issues

- **API calls fail**: Check CORS in backend
- **Bracket not showing**: Check browser console
- **State not updating**: Refresh page

### Test Data Issues

- **Login fails**: Run create-test-data script again
- **No tournaments**: Check database has test data
- **Permission errors**: Verify user roles

## 9. Success Criteria Checklist

- [ ] ✅ Tournament creation works
- [ ] ✅ Players can join tournaments
- [ ] ✅ Bracket generates on tournament start
- [ ] ✅ Players are seeded by rating
- [ ] ✅ Match scores can be updated
- [ ] ✅ Winners advance automatically
- [ ] ✅ Next round generates when current complete
- [ ] ✅ Tournament completes correctly
- [ ] ✅ Organizer can edit match details
- [ ] ✅ Real-time updates work
- [ ] ✅ Error handling works properly

## 10. Performance Testing

### Load Test (Optional)

1. Create tournament with 16+ players
2. Start tournament
3. Rapidly update multiple match scores
4. ✅ **Verify**: System handles concurrent updates

## 📊 Expected Results

### Knockout Tournament (6 players)

- **Round 1**: 2 matches + 1 bye = 3 winners
- **Round 2**: 1 match + 1 bye = 2 winners
- **Round 3**: 1 final match = 1 winner
- **Total**: 4 matches across 3 rounds

### Round Robin (4 players)

- **Round 1**: 6 matches (A vs B, A vs C, A vs D, B vs C, B vs D, C vs D)
- **Total**: 6 matches in 1 round

## 🎯 Key Features to Test

1. **Automatic Seeding**: Higher rated players get better seeds
2. **Bye Handling**: Odd numbers handled with byes for top seeds
3. **Round Progression**: Next round creates when current complete
4. **Winner Advancement**: Match winners automatically advance
5. **Tournament Completion**: Status updates when only one winner remains
6. **Real-time Updates**: Bracket updates immediately after score entry
7. **Organizer Controls**: Schedule editing and manual round generation
8. **Error Handling**: Proper validation and error messages

## 📞 Support

If you encounter issues:

1. Check console logs (browser dev tools)
2. Check server logs (terminal running backend)
3. Verify test data exists in database
4. Ensure both servers are running

**Happy Testing! 🏆**
