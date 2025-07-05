# Automatic Tournament Bracket System

## Overview

The Pickleball Tournament Planner now features an automatic bracket system that generates tournament matches and progresses rounds automatically based on match results. This system is designed to work with both knockout (single-elimination) and round-robin tournament formats.

## How It Works

### Tournament Creation

1. **Tournament Setup**: Organizers create tournaments with format selection (knockout, round-robin, or swiss)
2. **Player Registration**: Players join tournaments during the registration period
3. **Tournament Start**: When organizer starts the tournament, the system generates the initial bracket

### Automatic Bracket Generation

#### Knockout Tournaments

- **Initial Setup**: When a knockout tournament starts, only the first round matches are generated with real participants
- **Seeding**: Players are seeded based on their rating (highest rating gets best seed)
- **Bye Handling**: If odd number of participants, highest seed gets a bye to the next round
- **Match Scheduling**: Matches are scheduled with 30-minute intervals between matches and 2-hour intervals between rounds

#### Automatic Round Progression

- **Match Completion**: When a match is completed with scores, the system automatically checks if the current round is complete
- **Next Round Generation**: If all matches in a round are complete, the system automatically generates the next round
- **Winner Advancement**: Winners from completed matches are automatically paired for the next round
- **Tournament Completion**: When only one winner remains, the tournament status is updated to "completed"

#### Round-Robin Tournaments

- **All-vs-All**: Generates matches where every participant plays every other participant
- **Single Round**: All matches are considered part of "round 1"
- **No Progression**: No automatic round generation (all matches are created at start)

## Key Features

### For Tournament Organizers

1. **Match Schedule Management**

   - Edit match start times
   - Assign courts to matches
   - View tournament progress and statistics

2. **Manual Controls**

   - Force generate next round if needed
   - Edit tournament details
   - Monitor match progression

3. **Real-time Updates**
   - Tournament bracket updates automatically
   - Progress tracking with completion percentages
   - Current round indication

### For Players and Spectators

1. **Live Bracket View**

   - Visual bracket display with match results
   - Winner highlighting
   - Match status indicators (scheduled, in-progress, completed)

2. **Tournament Statistics**
   - Matches completed/in-progress/scheduled
   - Current round information
   - Overall tournament progress

## API Endpoints

### Tournament Bracket Management

- `GET /api/tournaments/:id/bracket` - Get complete tournament bracket with statistics
- `PUT /api/tournaments/:id/match-schedule` - Update match scheduling details
- `POST /api/matches/tournament/:id/next-round` - Manually generate next round

### Match Management

- `PUT /api/matches/:id/score` - Update match score (triggers auto-progression)
- `PUT /api/matches/:id/details` - Update match time and court assignment
- `GET /api/matches/tournament/:id/bracket` - Get tournament matches grouped by round

## Frontend Components

### TournamentBracket Component

- Displays visual bracket with rounds and matches
- Shows tournament progress statistics
- Provides organizer controls for match editing
- Real-time updates when matches complete

### Integration with Tournament Details

- Bracket tab in tournament view
- Conditional display based on tournament status
- Organizer-specific editing capabilities

## Database Schema Updates

### Match Entity Enhancements

- Round number field for organizing matches
- Winner field for tracking progression
- Status field (scheduled, in-progress, completed)
- Court assignment and timing fields

### Tournament Status Tracking

- Status progression: upcoming → ongoing → completed
- Automatic status updates based on match completion

## Automatic Workflow

### Match Score Update Flow

1. Organizer/player updates match score
2. System validates pickleball scoring rules
3. If match is complete, winner is determined
4. Player statistics are updated
5. System checks if current round is complete
6. If round complete, next round is automatically generated
7. New matches are created with scheduled status
8. Tournament bracket is updated in real-time

### Tournament Completion Flow

1. Final match is completed
2. Tournament winner is determined
3. Tournament status updated to "completed"
4. Final statistics calculated
5. Players and organizers notified

## Benefits

### For Organizers

- **Reduced Manual Work**: No need to manually create each round of matches
- **Consistent Scheduling**: Automatic timing and progression
- **Real-time Management**: Live updates and controls
- **Professional Presentation**: Clean bracket visualization

### For Players

- **Clear Progression**: Visual bracket shows tournament structure
- **Up-to-date Information**: Real-time match status and results
- **Easy Navigation**: Intuitive bracket interface

### For Spectators

- **Tournament Following**: Easy to track favorite players
- **Progress Monitoring**: Clear tournament advancement
- **Result History**: Complete match results and statistics

## Future Enhancements

1. **Swiss Tournament Format**: More complex pairing algorithms
2. **Bracket Predictions**: AI-powered match outcome predictions
3. **Live Scoring**: Real-time score updates during matches
4. **Tournament Analytics**: Advanced statistics and insights
5. **Mobile Optimization**: Enhanced mobile bracket viewing
6. **Notification System**: Alerts for match start times and results

## Usage Examples

### Starting a Tournament

```typescript
// Organizer starts tournament
const result = await tournamentAPI.start(tournamentId);
// First round matches are automatically created
// Tournament status changes to "ongoing"
```

### Updating Match Score

```typescript
// Match score is updated
const score = { player1: [11, 8, 11], player2: [9, 11, 6] };
await matchAPI.updateScore(matchId, score);
// Winner determined automatically
// Next round generated if current round complete
```

### Viewing Tournament Bracket

```typescript
// Get complete bracket with statistics
const bracket = await tournamentAPI.getBracket(tournamentId);
// Display visual bracket with match results
// Show tournament progress and statistics
```

This automatic bracket system significantly improves the tournament management experience by reducing manual work for organizers while providing real-time updates and professional presentation for all participants.
