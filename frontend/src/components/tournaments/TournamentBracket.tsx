import React, { useState, useEffect } from "react";
import { Match, Tournament } from "../../types";
import { tournamentAPI, matchAPI } from "../../services/api";
import { useTournamentStore } from "../../store/tournamentStore";
import { useAuthStore } from "../../store/authStore";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { MatchManagementModal } from "../matches/MatchManagementModal";

interface TournamentBracketProps {
  tournamentId: string;
}

interface MatchEditData {
  matchId: string;
  startTime: string;
  courtId: string;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({
  tournamentId,
}) => {
  const { bracket, setBracket, tournamentStats, setTournamentStats } =
    useTournamentStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [managementMatch, setManagementMatch] = useState<Match | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editData, setEditData] = useState<MatchEditData>({
    matchId: "",
    startTime: "",
    courtId: "",
  });
  const [generatingRound, setGeneratingRound] = useState(false);

  const fetchBracket = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await tournamentAPI.getBracket(tournamentId);
      setBracket(response.data.bracket);
      setTournamentStats(response.data.stats);
      setTournament(response.data.tournament);
      setError(null);
    } catch (err) {
      setError("Failed to load tournament bracket");
      console.error("Error fetching bracket:", err);
    } finally {
      setLoading(false);
    }
  }, [tournamentId, setBracket, setTournamentStats]);

  useEffect(() => {
    fetchBracket();
  }, [fetchBracket]);

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
    setEditData({
      matchId: match.id,
      startTime: match.startTime
        ? new Date(match.startTime).toISOString().slice(0, 16)
        : "",
      courtId: match.courtId || "",
    });
  };

  const handleSaveMatch = async () => {
    if (!editingMatch) return;

    try {
      await tournamentAPI.updateMatchSchedule(tournamentId, {
        matchId: editData.matchId,
        startTime: editData.startTime,
        courtId: editData.courtId || undefined,
      });

      // Refresh bracket
      await fetchBracket();
      setEditingMatch(null);
    } catch (err) {
      console.error("Error updating match:", err);
      setError("Failed to update match details");
    }
  };

  const handleGenerateNextRound = async () => {
    try {
      setGeneratingRound(true);
      await matchAPI.generateNextRound(tournamentId);

      // Refresh bracket
      await fetchBracket();
    } catch (err) {
      console.error("Error generating next round:", err);
      setError(
        "Failed to generate next round. Make sure current round is complete."
      );
    } finally {
      setGeneratingRound(false);
    }
  };

  const getMatchStatus = (match: Match) => {
    switch (match.status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getWinnerName = (match: Match) => {
    if (!match.winner) return null;
    if (match.winner === match.player1Id)
      return match.player1?.name || "Player 1";
    if (match.winner === match.player2Id)
      return match.player2?.name || "Player 2";
    return null;
  };

  const isOrganizer = tournament && user && tournament.organizerId === user.id;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>{error}</p>
        <Button onClick={fetchBracket} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const rounds = Object.keys(bracket)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* Tournament Stats */}
      {tournamentStats && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tournament Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {tournamentStats.completedMatches}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {tournamentStats.inProgressMatches}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tournamentStats.scheduledMatches}
              </div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {tournamentStats.currentRound}/{tournamentStats.totalRounds}
              </div>
              <div className="text-sm text-gray-600">Current Round</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${tournamentStats.progress}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-600 mt-2">
            {tournamentStats.progress.toFixed(1)}% Complete
          </div>
        </Card>
      )}

      {/* Generate Next Round Button */}
      {isOrganizer && tournament?.status === "ongoing" && (
        <div className="flex justify-center">
          <Button
            onClick={handleGenerateNextRound}
            disabled={generatingRound}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {generatingRound ? "Generating..." : "Generate Next Round"}
          </Button>
        </div>
      )}

      {/* Tournament Bracket */}
      <div className="space-y-8">
        {rounds.map((round) => (
          <div key={round} className="space-y-4">
            <h3 className="text-xl font-semibold text-center">
              {tournament?.format === "knockout"
                ? `Round ${round}`
                : "Round Robin Matches"}
            </h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bracket[round]?.map((match) => (
                <Card
                  key={match.id}
                  className={`p-4 border-2 ${getMatchStatus(match)}`}
                >
                  <div className="space-y-3">
                    {/* Match Header */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Match {match.id.slice(-4)}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-white">
                        {match.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>

                    {/* Players */}
                    <div className="space-y-2">
                      <div
                        className={`flex justify-between items-center p-2 rounded ${
                          match.winner === match.player1Id
                            ? "bg-green-50 font-semibold"
                            : "bg-gray-50"
                        }`}
                      >
                        <span>{match.player1?.name || "TBD"}</span>
                        {match.score && (
                          <span className="text-sm">
                            {match.score.player1?.join("-") || "0"}
                          </span>
                        )}
                      </div>

                      <div
                        className={`flex justify-between items-center p-2 rounded ${
                          match.winner === match.player2Id
                            ? "bg-green-50 font-semibold"
                            : "bg-gray-50"
                        }`}
                      >
                        <span>{match.player2?.name || "TBD"}</span>
                        {match.score && (
                          <span className="text-sm">
                            {match.score.player2?.join("-") || "0"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Winner */}
                    {match.winner && (
                      <div className="text-center text-sm font-medium text-green-700">
                        Winner: {getWinnerName(match)}
                      </div>
                    )}

                    {/* Match Details */}
                    <div className="text-xs text-gray-600 space-y-1">
                      {match.startTime && (
                        <div>
                          Start: {new Date(match.startTime).toLocaleString()}
                        </div>
                      )}
                      {match.court && <div>Court: {match.court.name}</div>}
                    </div>

                    {/* Action Buttons for Organizer */}
                    {isOrganizer && (
                      <div className="space-y-2">
                        <Button
                          onClick={() => setManagementMatch(match)}
                          size="sm"
                          variant="primary"
                          className="w-full"
                        >
                          Manage Match
                        </Button>
                        <Button
                          onClick={() => handleEditMatch(match)}
                          size="sm"
                          variant="secondary"
                          className="w-full"
                        >
                          Edit Schedule
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Match Modal */}
      {editingMatch && (
        <Modal
          title="Edit Match Schedule"
          isOpen={!!editingMatch}
          onClose={() => setEditingMatch(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={editData.startTime}
                onChange={(e) =>
                  setEditData({ ...editData, startTime: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Court ID (optional)
              </label>
              <input
                type="text"
                value={editData.courtId}
                onChange={(e) =>
                  setEditData({ ...editData, courtId: e.target.value })
                }
                placeholder="Enter court ID"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setEditingMatch(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMatch}>Save Changes</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Match Management Modal */}
      {managementMatch && (
        <MatchManagementModal
          match={managementMatch}
          isOpen={!!managementMatch}
          onClose={() => setManagementMatch(null)}
          onMatchUpdated={fetchBracket}
          isOrganizer={!!isOrganizer}
        />
      )}
    </div>
  );
};
