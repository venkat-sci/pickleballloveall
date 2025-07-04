// Pickleball scoring utilities for backend
export interface GameResult {
  player1Score: number;
  player2Score: number;
  isComplete: boolean;
  winner?: "player1" | "player2";
}

export interface MatchResult {
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
): GameResult => {
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
  let player1GamesWon = 0;
  let player2GamesWon = 0;

  // Analyze each game
  const maxGames = Math.max(player1Scores.length, player2Scores.length);
  for (let i = 0; i < maxGames; i++) {
    const p1Score = player1Scores[i] || 0;
    const p2Score = player2Scores[i] || 0;

    const gameResult = determineGameWinner(p1Score, p2Score);

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
    isComplete: isMatchComplete,
    winner: matchWinner,
    gamesWon: {
      player1: player1GamesWon,
      player2: player2GamesWon,
    },
  };
};

/**
 * Validates score input
 */
export const validateScores = (
  player1Scores: number[],
  player2Scores: number[]
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (player1Scores.length !== player2Scores.length) {
    errors.push("Player score arrays must have the same length");
  }

  for (
    let i = 0;
    i < Math.max(player1Scores.length, player2Scores.length);
    i++
  ) {
    const p1Score = player1Scores[i] || 0;
    const p2Score = player2Scores[i] || 0;

    if (p1Score < 0 || p2Score < 0) {
      errors.push(`Game ${i + 1}: Scores cannot be negative`);
    }

    if (!Number.isInteger(p1Score) || !Number.isInteger(p2Score)) {
      errors.push(`Game ${i + 1}: Scores must be whole numbers`);
    }

    if (p1Score > 25 || p2Score > 25) {
      errors.push(
        `Game ${i + 1}: Score seems unusually high (${p1Score}-${p2Score})`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
