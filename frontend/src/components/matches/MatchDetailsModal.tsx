import React from "react";
import {
  Trophy,
  Clock,
  MapPin,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Match } from "../../types";
import { Modal } from "../ui/Modal";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  determineMatchWinner,
  determineGameWinner,
} from "../../utils/pickleballScoring";
import { PickleballScoringGuide } from "./PickleballScoringGuide";

interface MatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  canUpdateScore?: boolean;
  onUpdateScore?: (match: Match) => void;
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  isOpen,
  onClose,
  match,
  canUpdateScore = false,
  onUpdateScore,
}) => {
  if (!match) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getWinnerName = () => {
    if (!match.winner) return null;
    return match.winner === match.player1Id
      ? match.player1?.name
      : match.player2?.name;
  };

  const calculateMatchDuration = () => {
    if (!match.startTime) return null;
    // For now, we'll estimate duration based on completed status
    // In a real app, you'd have an endTime field
    if (match.status === "completed") {
      // Estimate based on number of games played
      const gamesPlayed = match.score
        ? Math.max(match.score.player1.length, match.score.player2.length)
        : 1;
      const estimatedMinutes = gamesPlayed * 25; // Average 25 minutes per game
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;
      return hours > 0 ? `~${hours}h ${minutes}m` : `~${minutes}m`;
    }
    return null;
  };

  const getTotalGames = () => {
    if (!match.score) return 0;
    return Math.max(match.score.player1.length, match.score.player2.length);
  };

  const getGameWins = (
    playerScores: number[],
    opponentScores: number[],
    isPlayer1: boolean = true
  ) => {
    let wins = 0;
    for (let i = 0; i < playerScores.length; i++) {
      const gameResult = determineGameWinner(
        isPlayer1 ? playerScores[i] || 0 : opponentScores[i] || 0,
        isPlayer1 ? opponentScores[i] || 0 : playerScores[i] || 0
      );
      if (gameResult.winner === "player1") {
        wins++;
      }
    }
    return wins;
  };

  const renderScoreChart = () => {
    if (!match.score) return null;

    const player1Scores = match.score.player1;
    const player2Scores = match.score.player2;
    const maxGames = Math.max(player1Scores.length, player2Scores.length);

    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Game-by-Game Breakdown</h4>
        <div className="grid gap-3">
          {Array.from({ length: maxGames }).map((_, gameIndex) => {
            const p1Score = player1Scores[gameIndex] || 0;
            const p2Score = player2Scores[gameIndex] || 0;

            // Use proper pickleball scoring logic
            const gameResult = determineGameWinner(p1Score, p2Score);
            const winner = gameResult.winner;

            return (
              <div
                key={gameIndex}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  winner === "player1"
                    ? "bg-green-50 border-green-200"
                    : winner === "player2"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-sm">
                    Game {gameIndex + 1}
                  </span>
                  {winner === "player1" && (
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4 text-green-600" />
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                  )}
                  {winner === "player2" && (
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4 text-blue-600" />
                      <CheckCircle className="w-3 h-3 text-blue-600" />
                    </div>
                  )}
                  {!winner && (p1Score > 0 || p2Score > 0) && (
                    <div title="Game in progress">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="font-mono text-lg flex items-center space-x-2">
                    <span
                      className={
                        winner === "player1" ? "font-bold text-green-700" : ""
                      }
                    >
                      {p1Score}
                    </span>
                    <span className="text-gray-400">-</span>
                    <span
                      className={
                        winner === "player2" ? "font-bold text-blue-700" : ""
                      }
                    >
                      {p2Score}
                    </span>
                  </div>
                  {gameResult.isComplete && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Complete
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Match Analysis */}
        {match.score && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-700">
              {(() => {
                const matchResult = determineMatchWinner(
                  match.score.player1,
                  match.score.player2,
                  match.player1Id || "",
                  match.player2Id || ""
                );

                if (matchResult.isComplete) {
                  return (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>
                        <strong>Match Complete:</strong>{" "}
                        {matchResult.gamesWon.player1}-
                        {matchResult.gamesWon.player2} games
                        {matchResult.winner === match.player1Id
                          ? ` - ${match.player1?.name} wins!`
                          : ` - ${match.player2?.name} wins!`}
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span>
                        <strong>In Progress:</strong>{" "}
                        {matchResult.gamesWon.player1}-
                        {matchResult.gamesWon.player2} games
                        {matchResult.gamesWon.player1 === 1 &&
                        matchResult.gamesWon.player2 === 1
                          ? " - Deciding game needed!"
                          : ""}
                      </span>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Match Details" size="lg">
      <div className="space-y-6">
        {/* Header with Scoring Guide */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Understanding pickleball scoring rules:
          </div>
          <PickleballScoringGuide />
        </div>

        {/* Match Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(match.status)}>
              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
            </Badge>
            <span className="text-sm text-gray-500">
              Round {match.round || 1}
            </span>
          </div>
          {canUpdateScore && onUpdateScore && (
            <Button
              size="sm"
              onClick={() => onUpdateScore(match)}
              className="flex items-center space-x-1"
            >
              <Target className="w-4 h-4" />
              <span>
                {match.status === "scheduled" ? "Start Match" : "Update Score"}
              </span>
            </Button>
          )}
        </div>

        {/* Players Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Player 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  match.winner === match.player1Id
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
              <h3 className="text-lg font-semibold">{match.player1?.name}</h3>
              {match.winner === match.player1Id && (
                <Trophy className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Rating: {match.player1?.rating}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>
                  Record: {match.player1?.totalWins || 0}W -{" "}
                  {match.player1?.totalLosses || 0}L
                </span>
              </div>
            </div>
            {match.score && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Games Won</div>
                <div className="text-2xl font-bold text-gray-900">
                  {getGameWins(match.score.player1, match.score.player2, true)}
                </div>
              </div>
            )}
          </div>

          {/* Player 2 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  match.winner === match.player2Id
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
              <h3 className="text-lg font-semibold">{match.player2?.name}</h3>
              {match.winner === match.player2Id && (
                <Trophy className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Rating: {match.player2?.rating}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>
                  Record: {match.player2?.totalWins || 0}W -{" "}
                  {match.player2?.totalLosses || 0}L
                </span>
              </div>
            </div>
            {match.score && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Games Won</div>
                <div className="text-2xl font-bold text-gray-900">
                  {getGameWins(match.score.player2, match.score.player1, true)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overall Score */}
        {match.score && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Final Score</div>
              <div className="text-3xl font-bold text-gray-900 font-mono">
                {getGameWins(match.score.player1, match.score.player2, true)} -{" "}
                {getGameWins(match.score.player2, match.score.player1, true)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Best of {getTotalGames()} games
              </div>
            </div>
          </div>
        )}

        {/* Match Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {match.startTime && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <div>
                <div className="font-medium">Start Time</div>
                <div>
                  {format(new Date(match.startTime), "MMM dd, yyyy HH:mm")}
                </div>
              </div>
            </div>
          )}

          {match.court && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <div>
                <div className="font-medium">Court</div>
                <div>{match.court.name}</div>
              </div>
            </div>
          )}

          {calculateMatchDuration() && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <div>
                <div className="font-medium">Duration</div>
                <div>{calculateMatchDuration()}</div>
              </div>
            </div>
          )}
        </div>

        {/* Score Chart */}
        {match.score && renderScoreChart()}

        {/* Winner Section */}
        {match.status === "completed" && match.winner && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">
                Winner: {getWinnerName()}
              </span>
            </div>
          </div>
        )}

        {/* Future: Notes or Comments Section */}
        {/* 
        {match.notes && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Match Notes</h4>
            <p className="text-gray-700 text-sm">{match.notes}</p>
          </div>
        )}
        */}
      </div>
    </Modal>
  );
};
