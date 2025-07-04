// Pickleball scoring and winner determination utilities

export interface GameScore {
  player1Score: number;
  player2Score: number;
  isComplete: boolean;
  winner?: "player1" | "player2";
}

export interface MatchResult {
  games: GameScore[];
  isComplete: boolean;
  winner?: string; // player1Id or player2Id
  gamesWon: {
    player1: number;
    player2: number;
  };
}

/**
 * Determines if a game is complete and who won
 */
export const determineGameWinner = (
  player1Score: number,
  player2Score: number
): GameScore => {
  const minWinScore = 11;
  const minWinMargin = 2;

  // Check if either player has reached minimum win score
  const player1CanWin = player1Score >= minWinScore;
  const player2CanWin = player2Score >= minWinScore;

  // Calculate score difference
  const scoreDifference = Math.abs(player1Score - player2Score);

  let winner: "player1" | "player2" | undefined;
  let isComplete = false;

  if (
    player1CanWin &&
    scoreDifference >= minWinMargin &&
    player1Score > player2Score
  ) {
    winner = "player1";
    isComplete = true;
  } else if (
    player2CanWin &&
    scoreDifference >= minWinMargin &&
    player2Score > player1Score
  ) {
    winner = "player2";
    isComplete = true;
  }

  return {
    player1Score,
    player2Score,
    isComplete,
    winner,
  };
};

/**
 * Determines match winner based on all games played
 */
export const determineMatchWinner = (
  player1Scores: number[],
  player2Scores: number[],
  player1Id: string,
  player2Id: string,
  bestOf: number = 3 // 3 or 5 games
): MatchResult => {
  const games: GameScore[] = [];
  let player1GamesWon = 0;
  let player2GamesWon = 0;

  // Analyze each game
  const maxGames = Math.max(player1Scores.length, player2Scores.length);
  for (let i = 0; i < maxGames; i++) {
    const p1Score = player1Scores[i] || 0;
    const p2Score = player2Scores[i] || 0;

    const gameResult = determineGameWinner(p1Score, p2Score);
    games.push(gameResult);

    if (gameResult.winner === "player1") {
      player1GamesWon++;
    } else if (gameResult.winner === "player2") {
      player2GamesWon++;
    }
  }

  // Determine match winner
  const gamesToWin = Math.ceil(bestOf / 2); // 2 for best of 3, 3 for best of 5
  let matchWinner: string | undefined;
  let isMatchComplete = false;

  if (player1GamesWon >= gamesToWin) {
    matchWinner = player1Id;
    isMatchComplete = true;
  } else if (player2GamesWon >= gamesToWin) {
    matchWinner = player2Id;
    isMatchComplete = true;
  }

  return {
    games,
    isComplete: isMatchComplete,
    winner: matchWinner,
    gamesWon: {
      player1: player1GamesWon,
      player2: player2GamesWon,
    },
  };
};

/**
 * Validates if a score is valid for pickleball
 */
export const validateScore = (
  player1Score: number,
  player2Score: number
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Basic validation
  if (player1Score < 0 || player2Score < 0) {
    errors.push("Scores cannot be negative");
  }

  if (!Number.isInteger(player1Score) || !Number.isInteger(player2Score)) {
    errors.push("Scores must be whole numbers");
  }

  // Check for reasonable score limits (prevent typos like 111 instead of 11)
  const maxReasonableScore = 25; // Games rarely go beyond this
  if (player1Score > maxReasonableScore || player2Score > maxReasonableScore) {
    errors.push(
      `Scores above ${maxReasonableScore} are unusual. Please verify.`
    );
  }

  // Check for valid win conditions if either score is 11+
  if (player1Score >= 11 || player2Score >= 11) {
    const scoreDiff = Math.abs(player1Score - player2Score);
    const higher = Math.max(player1Score, player2Score);
    const lower = Math.min(player1Score, player2Score);

    // If someone has 11+ points, they should either:
    // 1. Have won by 2+ (completed game), or
    // 2. Be in a deuce situation (both close to each other)
    if (higher >= 11 && scoreDiff >= 2) {
      // This is a completed game - that's fine
    } else if (higher >= 11 && scoreDiff < 2 && lower >= 10) {
      // This is a deuce situation - that's fine
    } else if (higher >= 11 && lower < 10) {
      // This might be an incomplete game entry
      // We'll allow it but it's worth noting
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Gets a human-readable description of the match state
 */
export const getMatchStatusDescription = (matchResult: MatchResult): string => {
  if (matchResult.isComplete && matchResult.winner) {
    return `Match Complete - ${matchResult.gamesWon.player1}-${matchResult.gamesWon.player2} games`;
  } else {
    return `In Progress - ${matchResult.gamesWon.player1}-${matchResult.gamesWon.player2} games`;
  }
};
