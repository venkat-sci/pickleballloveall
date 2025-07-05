"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateScores = exports.determineMatchWinner = exports.determineGameWinner = void 0;
/**
 * Determines if a game is complete and who won
 */
const determineGameWinner = (player1Score, player2Score) => {
    const minWinScore = 11;
    const minWinMargin = 2;
    // Check if either player has reached minimum win score
    const player1CanWin = player1Score >= minWinScore;
    const player2CanWin = player2Score >= minWinScore;
    // Calculate score difference
    const scoreDifference = Math.abs(player1Score - player2Score);
    let winner;
    let isComplete = false;
    if (player1CanWin &&
        scoreDifference >= minWinMargin &&
        player1Score > player2Score) {
        winner = "player1";
        isComplete = true;
    }
    else if (player2CanWin &&
        scoreDifference >= minWinMargin &&
        player2Score > player1Score) {
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
exports.determineGameWinner = determineGameWinner;
/**
 * Determines match winner based on all games played
 */
const determineMatchWinner = (player1Scores, player2Scores, player1Id, player2Id, bestOf = 3 // 3 or 5 games
) => {
    let player1GamesWon = 0;
    let player2GamesWon = 0;
    // Analyze each game
    const maxGames = Math.max(player1Scores.length, player2Scores.length);
    for (let i = 0; i < maxGames; i++) {
        const p1Score = player1Scores[i] || 0;
        const p2Score = player2Scores[i] || 0;
        const gameResult = (0, exports.determineGameWinner)(p1Score, p2Score);
        if (gameResult.winner === "player1") {
            player1GamesWon++;
        }
        else if (gameResult.winner === "player2") {
            player2GamesWon++;
        }
    }
    // Determine match winner
    const gamesToWin = Math.ceil(bestOf / 2); // 2 for best of 3, 3 for best of 5
    let matchWinner;
    let isMatchComplete = false;
    if (player1GamesWon >= gamesToWin) {
        matchWinner = player1Id;
        isMatchComplete = true;
    }
    else if (player2GamesWon >= gamesToWin) {
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
exports.determineMatchWinner = determineMatchWinner;
/**
 * Validates score input
 */
const validateScores = (player1Scores, player2Scores) => {
    const errors = [];
    if (player1Scores.length !== player2Scores.length) {
        errors.push("Player score arrays must have the same length");
    }
    for (let i = 0; i < Math.max(player1Scores.length, player2Scores.length); i++) {
        const p1Score = player1Scores[i] || 0;
        const p2Score = player2Scores[i] || 0;
        if (p1Score < 0 || p2Score < 0) {
            errors.push(`Game ${i + 1}: Scores cannot be negative`);
        }
        if (!Number.isInteger(p1Score) || !Number.isInteger(p2Score)) {
            errors.push(`Game ${i + 1}: Scores must be whole numbers`);
        }
        if (p1Score > 25 || p2Score > 25) {
            errors.push(`Game ${i + 1}: Score seems unusually high (${p1Score}-${p2Score})`);
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
exports.validateScores = validateScores;
