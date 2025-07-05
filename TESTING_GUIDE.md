# Testing Guide for Automatic Tournament Bracket System

## Prerequisites

1. **Backend Setup**

   - Database running (PostgreSQL/MySQL)
   - Backend server running on port 3001
   - All dependencies installed

2. **Frontend Setup**
   - Frontend development server running on port 5173
   - All dependencies installed

## Step-by-Step Testing Guide

### 1. Start the Applications

```bash
# Terminal 1 - Backend
cd /Users/venkatagurrala/Documents/projects/node/pickleballplanner-project/backend
npm run dev

# Terminal 2 - Frontend
cd /Users/venkatagurrala/Documents/projects/node/pickleballplanner-project/frontend
npm run dev
```

### 2. Create Test Users

First, create several test users to participate in tournaments:

1. **Register as Tournament Organizer**

   - Go to http://localhost:5173/register
   - Create user: `organizer@test.com` / `password123`
   - Set rating: 4.5

2. **Register Test Players**
   - Create 4-8 test players with different ratings:
   - `player1@test.com` / `password123` (Rating: 5.0)
   - `player2@test.com` / `password123` (Rating: 4.8)
   - `player3@test.com` / `password123` (Rating: 4.6)
   - `player4@test.com` / `password123` (Rating: 4.4)
   - `player5@test.com` / `password123` (Rating: 4.2)
   - `player6@test.com` / `password123` (Rating: 4.0)

### 3. Test Tournament Creation

1. **Login as Organizer**

   - Login with `organizer@test.com`

2. **Create a Knockout Tournament**

   - Go to Tournaments page
   - Click "Create Tournament"
   - Fill in details:
     - Name: "Test Knockout Tournament"
     - Type: Singles
     - Format: Knockout
     - Start Date: Today + 1 hour
     - End Date: Today + 6 hours
     - Location: "Test Court"
     - Max Participants: 8
     - Entry Fee: $10 (optional)

3. **Create a Round-Robin Tournament**
   - Create another tournament with:
     - Name: "Test Round Robin Tournament"
     - Format: Round-Robin
     - Max Participants: 4

### 4. Test Player Registration

1. **Join Tournament as Players**

   - Logout and login as each test player
   - Navigate to tournament details
   - Click "Join Tournament" for each player
   - Verify participant count increases

2. **Check Tournament Capacity**
   - Try to join with more players than max capacity
   - Verify proper error handling

### 5. Test Knockout Tournament Bracket Generation

1. **Start Tournament**

   - Login as organizer
   - Go to tournament details
   - Click "Start Tournament"
   - Verify first round matches are created

2. **Check Initial Bracket**
   - Go to "Bracket" tab
   - Verify matches are properly seeded (highest rating vs lowest)
   - Check if byes are handled correctly (odd number of players)
   - Verify match scheduling (30 min intervals)

### 6. Test Match Score Updates and Automatic Progression

1. **Complete First Round Matches**

   - Go to each match in round 1
   - Update scores using valid pickleball scoring:
     - Example: Player 1: [11, 8, 11], Player 2: [9, 11, 6]
   - Verify winner is automatically determined

2. **Test Automatic Round Generation**

   - Complete all round 1 matches
   - Verify round 2 is automatically created
   - Check that winners advance correctly
   - Verify new match scheduling

3. **Continue Tournament to Completion**
   - Complete round 2 matches
   - Continue until final match
   - Verify tournament status changes to "completed"

### 7. Test Organizer Controls

1. **Edit Match Schedule**

   - As organizer, go to bracket view
   - Click "Edit Schedule" on any match
   - Change start time and court assignment
   - Verify changes are saved

2. **Manual Next Round Generation**
   - Complete some but not all matches in a round
   - Try "Generate Next Round" button
   - Verify it shows appropriate error
   - Complete remaining matches
   - Try again and verify it works

### 8. Test Round-Robin Tournament

1. **Start Round-Robin Tournament**

   - With 4 players, verify 6 matches are created (each plays each)
   - All matches should be in "round 1"

2. **Complete All Matches**
   - Update scores for all matches
   - Verify no additional rounds are generated
   - Check tournament completion

### 9. Test Error Handling

1. **Tournament with Insufficient Players**

   - Try to start tournament with only 1 player
   - Verify appropriate error message

2. **Invalid Score Updates**

   - Try invalid pickleball scores
   - Verify validation errors

3. **Next Round Generation Errors**
   - Try to generate next round when current round incomplete
   - Verify appropriate error handling

### 10. Test API Endpoints Directly

Use a tool like Postman or curl to test API endpoints:

```bash
# Get tournament bracket
curl -X GET "http://localhost:3001/api/tournaments/{tournamentId}/bracket"

# Update match score
curl -X PUT "http://localhost:3001/api/matches/{matchId}/score" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"score": {"player1": [11, 9], "player2": [9, 11]}}'

# Generate next round manually
curl -X POST "http://localhost:3001/api/matches/tournament/{tournamentId}/next-round" \
  -H "Authorization: Bearer {token}"
```

## Expected Behavior Checklist

### ✅ Tournament Creation

- [ ] Tournament created successfully
- [ ] Players can join/leave
- [ ] Participant count updates correctly
- [ ] Capacity limits enforced

### ✅ Bracket Generation

- [ ] First round matches created on tournament start
- [ ] Players seeded by rating
- [ ] Byes handled for odd participant numbers
- [ ] Match scheduling with proper intervals

### ✅ Automatic Progression

- [ ] Match winners determined automatically
- [ ] Next round generated when current round complete
- [ ] Winners advance to next matches
- [ ] Tournament completes with single winner

### ✅ Organizer Controls

- [ ] Match schedule editing works
- [ ] Court assignment functionality
- [ ] Manual next round generation
- [ ] Tournament statistics display

### ✅ Real-time Updates

- [ ] Bracket updates after match completion
- [ ] Tournament progress statistics
- [ ] Status changes (upcoming → ongoing → completed)

### ✅ Error Handling

- [ ] Insufficient participants handled
- [ ] Invalid scores rejected
- [ ] Premature next round generation prevented
- [ ] Unauthorized access blocked

## Common Issues and Troubleshooting

### Backend Issues

1. **Database Connection**: Ensure database is running and connected
2. **Authentication**: Verify JWT tokens are being generated and validated
3. **CORS**: Check if frontend can communicate with backend

### Frontend Issues

1. **API Calls**: Check browser network tab for failed requests
2. **State Management**: Verify Zustand store updates correctly
3. **Component Rendering**: Check React DevTools for component state

### Data Issues

1. **User Ratings**: Ensure test users have different ratings for seeding
2. **Tournament Status**: Verify status transitions work correctly
3. **Match Relationships**: Check player-match associations

## Performance Testing

1. **Large Tournament**: Test with 16+ participants
2. **Multiple Tournaments**: Run several tournaments simultaneously
3. **Concurrent Updates**: Multiple users updating scores simultaneously

## Database Verification

Check database directly to verify data integrity:

```sql
-- Check tournament and matches
SELECT t.name, t.status, COUNT(m.id) as match_count
FROM tournaments t
LEFT JOIN matches m ON t.id = m.tournament_id
GROUP BY t.id;

-- Check match progression
SELECT tournament_id, round, COUNT(*) as matches,
       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
FROM matches
GROUP BY tournament_id, round
ORDER BY tournament_id, round;
```

This comprehensive testing will ensure your automatic tournament bracket system works correctly in all scenarios!
