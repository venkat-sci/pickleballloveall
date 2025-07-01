# 🔧 PicklePro API Documentation

**Version 1.0 | December 2024**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [API Overview](#api-overview)
4. [Endpoints](#endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Webhooks](#webhooks)
9. [SDKs and Libraries](#sdks-and-libraries)
10. [Examples](#examples)
11. [Testing](#testing)
12. [Support](#support)

---

## Introduction

The PicklePro API provides programmatic access to tournament management, player data, and community features. This RESTful API enables developers to build custom applications, integrate with existing systems, and create innovative pickleball solutions.

### API Features

- **Tournament Management**: Create, update, and manage tournaments
- **Player Data**: Access player profiles, statistics, and ratings
- **Match Results**: Submit scores and retrieve match data
- **Real-time Updates**: WebSocket support for live data
- **Community Features**: Access social features and messaging
- **Analytics**: Retrieve performance metrics and reports

### Base URL

```
Production: https://api.picklepro.com/v1
Staging: https://staging-api.picklepro.com/v1
```

### API Versioning

The API uses URL versioning. The current version is `v1`. When breaking changes are introduced, a new version will be released.

### Content Type

All requests and responses use JSON format:
```
Content-Type: application/json
```

---

## Authentication

### API Keys

PicklePro uses API keys for authentication. You can obtain API keys from your account dashboard.

#### API Key Types

1. **Public Key**: For client-side applications (read-only access)
2. **Secret Key**: For server-side applications (full access)
3. **Webhook Key**: For webhook endpoint verification

#### Authentication Header

Include your API key in the Authorization header:

```http
Authorization: Bearer YOUR_API_KEY
```

### OAuth 2.0

For applications requiring user-specific access, PicklePro supports OAuth 2.0:

#### Authorization Flow

1. **Authorization Request**
   ```
   GET https://api.picklepro.com/oauth/authorize
   ?client_id=YOUR_CLIENT_ID
   &response_type=code
   &redirect_uri=YOUR_REDIRECT_URI
   &scope=tournaments:read players:read
   ```

2. **Token Exchange**
   ```http
   POST /oauth/token
   Content-Type: application/x-www-form-urlencoded
   
   grant_type=authorization_code
   &code=AUTHORIZATION_CODE
   &client_id=YOUR_CLIENT_ID
   &client_secret=YOUR_CLIENT_SECRET
   &redirect_uri=YOUR_REDIRECT_URI
   ```

3. **Access Token Usage**
   ```http
   Authorization: Bearer ACCESS_TOKEN
   ```

### Scopes

Available OAuth scopes:

- `tournaments:read` - Read tournament data
- `tournaments:write` - Create and modify tournaments
- `players:read` - Read player profiles and statistics
- `players:write` - Update player information
- `matches:read` - Read match data
- `matches:write` - Submit match results
- `community:read` - Access community features
- `community:write` - Post to community features

---

## API Overview

### HTTP Methods

- `GET` - Retrieve data
- `POST` - Create new resources
- `PUT` - Update existing resources
- `PATCH` - Partial updates
- `DELETE` - Remove resources

### Response Format

All responses follow a consistent format:

#### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-12-15T10:30:00Z",
    "version": "1.0"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  },
  "meta": {
    "timestamp": "2024-12-15T10:30:00Z",
    "version": "1.0"
  }
}
```

### Pagination

List endpoints support pagination:

#### Request Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Sort field
- `order` - Sort order (asc/desc)

#### Response Format
```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

### Filtering

Many endpoints support filtering:

```http
GET /tournaments?status=upcoming&location=california&skill_level=4.0
```

Common filter parameters:
- `status` - Filter by status
- `location` - Geographic filtering
- `skill_level` - Skill level filtering
- `date_from` - Start date filter
- `date_to` - End date filter

---

## Endpoints

### Authentication Endpoints

#### POST /auth/login
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "player@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "user": {
      "id": "user_123",
      "email": "player@example.com",
      "name": "John Player",
      "role": "player"
    }
  }
}
```

#### POST /auth/register
Create new user account.

**Request Body:**
```json
{
  "name": "John Player",
  "email": "player@example.com",
  "password": "securepassword",
  "role": "player",
  "skill_level": 3.5
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/logout
Invalidate current session.

### Tournament Endpoints

#### GET /tournaments
Retrieve list of tournaments.

**Query Parameters:**
- `status` - Filter by status (upcoming, ongoing, completed)
- `location` - Filter by location
- `skill_level` - Filter by skill level
- `type` - Filter by type (singles, doubles, mixed)
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tournament_123",
      "name": "Spring Championship 2024",
      "description": "Annual spring tournament",
      "type": "singles",
      "format": "knockout",
      "status": "upcoming",
      "start_date": "2024-04-15T09:00:00Z",
      "end_date": "2024-04-17T18:00:00Z",
      "location": "Central Sports Complex",
      "max_participants": 32,
      "current_participants": 24,
      "entry_fee": 50.00,
      "prize_pool": 1000.00,
      "organizer": {
        "id": "user_456",
        "name": "Tournament Director",
        "email": "director@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

#### GET /tournaments/{id}
Retrieve specific tournament details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tournament_123",
    "name": "Spring Championship 2024",
    "description": "Annual spring tournament",
    "type": "singles",
    "format": "knockout",
    "status": "upcoming",
    "start_date": "2024-04-15T09:00:00Z",
    "end_date": "2024-04-17T18:00:00Z",
    "location": "Central Sports Complex",
    "max_participants": 32,
    "current_participants": 24,
    "entry_fee": 50.00,
    "prize_pool": 1000.00,
    "rules": "Standard USAPA rules apply",
    "courts": [
      {
        "id": "court_1",
        "name": "Court 1",
        "surface": "outdoor"
      }
    ],
    "participants": [
      {
        "id": "player_789",
        "name": "John Player",
        "skill_level": 3.5,
        "registration_date": "2024-03-15T10:00:00Z"
      }
    ],
    "organizer": {
      "id": "user_456",
      "name": "Tournament Director",
      "email": "director@example.com"
    }
  }
}
```

#### POST /tournaments
Create new tournament (requires organizer role).

**Request Body:**
```json
{
  "name": "Summer Championship 2024",
  "description": "Annual summer tournament",
  "type": "doubles",
  "format": "round_robin",
  "start_date": "2024-06-15T09:00:00Z",
  "end_date": "2024-06-16T18:00:00Z",
  "location": "Community Center",
  "max_participants": 16,
  "entry_fee": 75.00,
  "prize_pool": 1200.00,
  "rules": "Modified rules for doubles play"
}
```

#### PUT /tournaments/{id}
Update tournament details.

#### DELETE /tournaments/{id}
Delete tournament (only if no participants).

#### POST /tournaments/{id}/join
Join tournament as participant.

**Request Body:**
```json
{
  "partner_id": "player_456" // For doubles tournaments
}
```

#### DELETE /tournaments/{id}/leave
Leave tournament.

### Player Endpoints

#### GET /players
Retrieve list of players.

**Query Parameters:**
- `skill_level` - Filter by skill level
- `location` - Filter by location
- `search` - Search by name
- `sort` - Sort field (name, skill_level, rating)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "player_123",
      "name": "John Player",
      "skill_level": 3.5,
      "rating": 3.52,
      "location": "San Francisco, CA",
      "wins": 15,
      "losses": 8,
      "tournaments_played": 12,
      "profile_image": "https://cdn.picklepro.com/profiles/player_123.jpg"
    }
  ]
}
```

#### GET /players/{id}
Retrieve specific player details.

#### PUT /players/{id}
Update player profile (own profile only).

**Request Body:**
```json
{
  "name": "John Updated Player",
  "skill_level": 4.0,
  "location": "Los Angeles, CA",
  "bio": "Passionate pickleball player"
}
```

#### GET /players/{id}/statistics
Retrieve player statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "player_id": "player_123",
    "overall": {
      "wins": 25,
      "losses": 12,
      "win_percentage": 67.6,
      "tournaments_played": 18,
      "current_rating": 3.75,
      "peak_rating": 3.89
    },
    "recent_form": [
      {"result": "win", "date": "2024-12-10"},
      {"result": "win", "date": "2024-12-08"},
      {"result": "loss", "date": "2024-12-05"}
    ],
    "by_tournament_type": {
      "singles": {"wins": 15, "losses": 7},
      "doubles": {"wins": 10, "losses": 5}
    }
  }
}
```

### Match Endpoints

#### GET /matches
Retrieve list of matches.

**Query Parameters:**
- `tournament_id` - Filter by tournament
- `player_id` - Filter by player
- `status` - Filter by status
- `date_from` - Start date filter
- `date_to` - End date filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "match_123",
      "tournament_id": "tournament_456",
      "round": 1,
      "status": "completed",
      "start_time": "2024-12-15T10:00:00Z",
      "court": {
        "id": "court_1",
        "name": "Court 1"
      },
      "player1": {
        "id": "player_123",
        "name": "John Player",
        "skill_level": 3.5
      },
      "player2": {
        "id": "player_456",
        "name": "Jane Player",
        "skill_level": 3.7
      },
      "score": {
        "player1": [11, 8, 11],
        "player2": [9, 11, 7]
      },
      "winner": "player_123"
    }
  ]
}
```

#### GET /matches/{id}
Retrieve specific match details.

#### POST /matches/{id}/score
Submit match score.

**Request Body:**
```json
{
  "score": {
    "player1": [11, 8, 11],
    "player2": [9, 11, 7]
  },
  "winner": "player_123"
}
```

#### PUT /matches/{id}/status
Update match status.

**Request Body:**
```json
{
  "status": "in_progress"
}
```

### Bracket Endpoints

#### GET /tournaments/{id}/bracket
Retrieve tournament bracket.

**Response:**
```json
{
  "success": true,
  "data": {
    "tournament_id": "tournament_123",
    "format": "single_elimination",
    "rounds": [
      {
        "round": 1,
        "matches": [
          {
            "id": "match_123",
            "player1": {"id": "player_123", "name": "John Player"},
            "player2": {"id": "player_456", "name": "Jane Player"},
            "winner": "player_123"
          }
        ]
      }
    ]
  }
}
```

#### POST /tournaments/{id}/bracket/generate
Generate tournament bracket.

**Request Body:**
```json
{
  "seeding_method": "rating_based",
  "randomize": false
}
```

### Community Endpoints

#### GET /community/feed
Retrieve community activity feed.

#### POST /community/posts
Create community post.

#### GET /messages
Retrieve user messages.

#### POST /messages
Send message to user.

---

## Data Models

### User Model

```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "player|organizer|admin",
  "skill_level": "number",
  "rating": "number",
  "location": "string",
  "profile_image": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Tournament Model

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "type": "singles|doubles|mixed",
  "format": "knockout|round_robin|swiss",
  "status": "upcoming|ongoing|completed",
  "start_date": "datetime",
  "end_date": "datetime",
  "location": "string",
  "max_participants": "integer",
  "current_participants": "integer",
  "entry_fee": "number",
  "prize_pool": "number",
  "organizer_id": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Match Model

```json
{
  "id": "string",
  "tournament_id": "string",
  "round": "integer",
  "status": "scheduled|in_progress|completed",
  "start_time": "datetime",
  "court_id": "string",
  "player1_id": "string",
  "player2_id": "string",
  "score": {
    "player1": ["integer"],
    "player2": ["integer"]
  },
  "winner": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Player Statistics Model

```json
{
  "player_id": "string",
  "wins": "integer",
  "losses": "integer",
  "win_percentage": "number",
  "tournaments_played": "integer",
  "current_rating": "number",
  "peak_rating": "number",
  "games_won": "integer",
  "games_lost": "integer",
  "points_scored": "integer",
  "points_allowed": "integer"
}
```

---

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error details
    }
  }
}
```

### Common Error Codes

- `INVALID_API_KEY` - API key is invalid or missing
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `VALIDATION_ERROR` - Request data validation failed
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `TOURNAMENT_FULL` - Tournament has reached capacity
- `REGISTRATION_CLOSED` - Tournament registration is closed

---

## Rate Limiting

### Rate Limits

- **Free Tier**: 1,000 requests per hour
- **Pro Tier**: 10,000 requests per hour
- **Enterprise**: Custom limits

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Handling Rate Limits

When rate limited, the API returns:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again later.",
    "details": {
      "reset_time": "2024-12-15T11:00:00Z"
    }
  }
}
```

---

## Webhooks

### Webhook Events

PicklePro can send webhooks for various events:

- `tournament.created` - New tournament created
- `tournament.updated` - Tournament details updated
- `tournament.participant_joined` - Player joined tournament
- `match.score_updated` - Match score updated
- `match.completed` - Match finished
- `player.rating_updated` - Player rating changed

### Webhook Configuration

Configure webhooks in your account dashboard:

1. Add webhook endpoint URL
2. Select events to receive
3. Configure authentication
4. Test webhook delivery

### Webhook Payload

```json
{
  "event": "tournament.created",
  "timestamp": "2024-12-15T10:30:00Z",
  "data": {
    "tournament": {
      "id": "tournament_123",
      "name": "Spring Championship 2024",
      // ... tournament data
    }
  }
}
```

### Webhook Security

Webhooks include signature verification:

```http
X-PicklePro-Signature: sha256=abc123...
```

Verify signature using your webhook secret:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return `sha256=${expectedSignature}` === signature;
}
```

---

## SDKs and Libraries

### Official SDKs

#### JavaScript/Node.js
```bash
npm install @picklepro/api-client
```

```javascript
const PicklePro = require('@picklepro/api-client');

const client = new PicklePro({
  apiKey: 'your_api_key',
  environment: 'production' // or 'staging'
});

// Get tournaments
const tournaments = await client.tournaments.list({
  status: 'upcoming',
  location: 'california'
});
```

#### Python
```bash
pip install picklepro-api
```

```python
from picklepro import PickleProClient

client = PickleProClient(api_key='your_api_key')

# Get tournaments
tournaments = client.tournaments.list(
    status='upcoming',
    location='california'
)
```

#### PHP
```bash
composer require picklepro/api-client
```

```php
use PicklePro\ApiClient;

$client = new ApiClient('your_api_key');

// Get tournaments
$tournaments = $client->tournaments()->list([
    'status' => 'upcoming',
    'location' => 'california'
]);
```

### Community Libraries

- **Ruby**: `picklepro-ruby` gem
- **Go**: `go-picklepro` package
- **Java**: `picklepro-java` library
- **C#**: `PicklePro.NET` package

---

## Examples

### Tournament Management Example

```javascript
const PicklePro = require('@picklepro/api-client');

const client = new PicklePro({
  apiKey: process.env.PICKLEPRO_API_KEY
});

async function createTournament() {
  try {
    // Create tournament
    const tournament = await client.tournaments.create({
      name: 'Summer Championship 2024',
      type: 'doubles',
      format: 'knockout',
      start_date: '2024-06-15T09:00:00Z',
      end_date: '2024-06-16T18:00:00Z',
      location: 'Community Center',
      max_participants: 16,
      entry_fee: 75.00
    });

    console.log('Tournament created:', tournament.id);

    // Generate bracket when ready
    const bracket = await client.tournaments.generateBracket(tournament.id, {
      seeding_method: 'rating_based'
    });

    console.log('Bracket generated with', bracket.rounds.length, 'rounds');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

createTournament();
```

### Player Statistics Example

```python
from picklepro import PickleProClient

client = PickleProClient(api_key=os.environ['PICKLEPRO_API_KEY'])

def analyze_player_performance(player_id):
    # Get player statistics
    stats = client.players.get_statistics(player_id)
    
    # Calculate performance metrics
    win_rate = stats['overall']['win_percentage']
    recent_form = stats['recent_form'][:5]  # Last 5 matches
    
    # Analyze recent performance
    recent_wins = sum(1 for match in recent_form if match['result'] == 'win')
    recent_performance = recent_wins / len(recent_form) * 100
    
    print(f"Overall win rate: {win_rate}%")
    print(f"Recent performance: {recent_performance}%")
    
    # Get improvement suggestions
    if recent_performance < win_rate:
        print("Recent performance below average - consider practice sessions")
    else:
        print("Good recent form - keep it up!")

analyze_player_performance('player_123')
```

### Real-time Updates Example

```javascript
const io = require('socket.io-client');

// Connect to real-time updates
const socket = io('wss://api.picklepro.com', {
  auth: {
    token: 'your_access_token'
  }
});

// Subscribe to tournament updates
socket.emit('subscribe', {
  event: 'tournament_updates',
  tournament_id: 'tournament_123'
});

// Listen for match score updates
socket.on('match_score_updated', (data) => {
  console.log('Score update:', data.match_id, data.score);
  updateUI(data);
});

// Listen for bracket updates
socket.on('bracket_updated', (data) => {
  console.log('Bracket updated:', data.tournament_id);
  refreshBracket(data.tournament_id);
});
```

---

## Testing

### Test Environment

Use the staging environment for testing:

```
Base URL: https://staging-api.picklepro.com/v1
```

### Test Data

The staging environment includes test data:

- Test tournaments
- Sample players
- Mock matches
- Simulated real-time events

### API Testing Tools

#### Postman Collection

Import our Postman collection for easy testing:

```
https://api.picklepro.com/postman/collection.json
```

#### cURL Examples

```bash
# Get tournaments
curl -X GET "https://api.picklepro.com/v1/tournaments" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"

# Create tournament
curl -X POST "https://api.picklepro.com/v1/tournaments" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Tournament",
    "type": "singles",
    "format": "knockout",
    "start_date": "2024-06-15T09:00:00Z",
    "location": "Test Venue",
    "max_participants": 8
  }'
```

### Unit Testing

Example unit test using Jest:

```javascript
const PicklePro = require('@picklepro/api-client');

describe('PicklePro API', () => {
  let client;

  beforeEach(() => {
    client = new PicklePro({
      apiKey: 'test_api_key',
      environment: 'staging'
    });
  });

  test('should create tournament', async () => {
    const tournament = await client.tournaments.create({
      name: 'Test Tournament',
      type: 'singles',
      format: 'knockout',
      start_date: '2024-06-15T09:00:00Z',
      location: 'Test Venue',
      max_participants: 8
    });

    expect(tournament.id).toBeDefined();
    expect(tournament.name).toBe('Test Tournament');
  });

  test('should handle validation errors', async () => {
    await expect(client.tournaments.create({}))
      .rejects
      .toThrow('Validation error');
  });
});
```

---

## Support

### Getting Help

#### Documentation
- API Reference: https://docs.picklepro.com/api
- Guides and Tutorials: https://docs.picklepro.com/guides
- FAQ: https://docs.picklepro.com/faq

#### Developer Support
- Email: developers@picklepro.com
- Discord: https://discord.gg/picklepro-dev
- GitHub Issues: https://github.com/picklepro/api-issues

#### Status Page
Monitor API status: https://status.picklepro.com

### Community

#### Developer Community
- Discord Server: Real-time chat with other developers
- GitHub Discussions: Technical discussions and feature requests
- Stack Overflow: Tag questions with `picklepro-api`

#### Resources
- Blog: https://blog.picklepro.com/developers
- Newsletter: Developer updates and announcements
- Webinars: Monthly developer webinars

### Feedback

We value your feedback:

- Feature Requests: developers@picklepro.com
- Bug Reports: GitHub Issues
- API Improvements: Developer Discord

---

## Changelog

### Version 1.0 (December 2024)
- Initial API release
- Tournament management endpoints
- Player data endpoints
- Match scoring endpoints
- Real-time WebSocket support
- OAuth 2.0 authentication
- Webhook system

### Upcoming Features
- Advanced analytics endpoints
- Bulk operations
- GraphQL support
- Enhanced real-time features
- Mobile SDK improvements

---

**© 2024 PicklePro. All rights reserved.**

*This documentation is designed to help developers integrate with the PicklePro API. For additional support, visit our developer portal or contact our support team.*