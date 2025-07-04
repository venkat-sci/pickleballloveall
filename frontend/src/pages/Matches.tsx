import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Search, Plus } from "lucide-react";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { useAuthStore } from "../store/authStore";
import { useTournamentStore } from "../store/tournamentStore";
import { matchAPI, tournamentAPI, userAPI } from "../services/api";
import { Match, Tournament, User } from "../types";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { MatchCard } from "../components/matches/MatchCard";
import { MatchDetailsModal } from "../components/matches/MatchDetailsModal";
import toast from "react-hot-toast";

export const Matches: React.FC = () => {
  const { user } = useAuthStore();
  const { setMatches } = useTournamentStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [playerFilter, setPlayerFilter] = useState<string>("all"); // Add player filter
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showMatchDetailsModal, setShowMatchDetailsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    tournamentId: "",
    player1Id: "",
    player2Id: "",
    startTime: "",
    courtId: "",
    round: 1,
  });
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const loadScheduleData = useCallback(async () => {
    try {
      const [tournamentsResponse, usersResponse] = await Promise.all([
        tournamentAPI.getAll(),
        userAPI.getAll(),
      ]);

      setTournaments(tournamentsResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error("Failed to load schedule data:", error);
    }
  }, []);
  const [scoreData, setScoreData] = useState({
    player1Games: [0, 0, 0],
    player2Games: [0, 0, 0],
    setsPlayed: 1,
  });

  // State for storing fetched matches
  const [allMatches, setAllMatches] = useState<Match[]>([]);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await matchAPI.getAll();

      // The API service now returns {data: Match[]} directly
      let fetchedMatches: Match[] = [];
      if (response && Array.isArray(response.data)) {
        fetchedMatches = response.data;
      } else {
        console.warn("Unexpected API response structure:", response);
        fetchedMatches = [];
      }

      setAllMatches(fetchedMatches);
      setMatches(fetchedMatches);
    } catch (error) {
      console.error("Failed to load matches:", error);
      toast.error("Failed to load matches");
      setAllMatches([]);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [setMatches]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleUpdateScore = (matchId: string) => {
    const match = (allMatches || []).find((m) => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
      // Initialize score data based on current match scores
      if (match.score) {
        setScoreData({
          player1Games: [...match.score.player1, 0],
          player2Games: [...match.score.player2, 0],
          setsPlayed: match.score.player1.length,
        });
      } else {
        setScoreData({
          player1Games: [0, 0, 0],
          player2Games: [0, 0, 0],
          setsPlayed: 1,
        });
      }
      setShowScoreModal(true);
    }
  };

  const handleSaveScore = async () => {
    if (!selectedMatch) return;

    try {
      const scoreUpdate = {
        player1: scoreData.player1Games.slice(0, scoreData.setsPlayed),
        player2: scoreData.player2Games.slice(0, scoreData.setsPlayed),
      };

      await matchAPI.updateScore(selectedMatch.id, scoreUpdate);
      toast.success("Score updated successfully!");
      setShowScoreModal(false);
      loadMatches();
    } catch (error) {
      console.error("Failed to update score:", error);
      toast.error("Failed to update score");
    }
  };

  const handleViewMatchDetails = (matchId: string) => {
    const match = (allMatches || []).find((m) => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
      setShowMatchDetailsModal(true);
    }
  };

  const handleUpdateScoreFromDetails = (match: Match) => {
    // Close the match details modal first
    setShowMatchDetailsModal(false);
    // Then open the score modal with the match ID
    handleUpdateScore(match.id);
  };

  const handleScheduleMatch = async () => {
    try {
      if (
        !scheduleForm.tournamentId ||
        !scheduleForm.player1Id ||
        !scheduleForm.player2Id ||
        !scheduleForm.startTime
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      await matchAPI.create({
        tournamentId: scheduleForm.tournamentId,
        player1Id: scheduleForm.player1Id,
        player2Id: scheduleForm.player2Id,
        startTime: scheduleForm.startTime,
        courtId: scheduleForm.courtId || undefined,
        round: scheduleForm.round,
        status: "scheduled",
      });

      toast.success("Match scheduled successfully!");
      setShowScheduleModal(false);
      setScheduleForm({
        tournamentId: "",
        player1Id: "",
        player2Id: "",
        startTime: "",
        courtId: "",
        round: 1,
      });
      loadMatches();
    } catch (error) {
      console.error("Failed to schedule match:", error);
      toast.error("Failed to schedule match");
    }
  };

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM dd, yyyy");
  };

  const filteredMatches = Array.isArray(allMatches)
    ? allMatches.filter((match) => {
        // Search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch =
            (match.player1?.name || "").toLowerCase().includes(searchLower) ||
            (match.player2?.name || "").toLowerCase().includes(searchLower) ||
            (match.court?.name || "").toLowerCase().includes(searchLower);

          if (!matchesSearch) return false;
        }

        // Status filter
        if (statusFilter !== "all" && match.status !== statusFilter) {
          return false;
        }

        // Player filter (my matches)
        if (playerFilter === "mine" && user) {
          if (match.player1Id !== user.id && match.player2Id !== user.id) {
            return false;
          }
        }

        // Date filter
        if (dateFilter !== "all" && match.startTime) {
          const matchDate = new Date(match.startTime);
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          switch (dateFilter) {
            case "today":
              if (!isToday(matchDate)) return false;
              break;
            case "tomorrow":
              if (!isTomorrow(matchDate)) return false;
              break;
            case "week": {
              const weekFromNow = new Date(today);
              weekFromNow.setDate(weekFromNow.getDate() + 7);
              if (matchDate < today || matchDate > weekFromNow) return false;
              break;
            }
          }
        }

        return true;
      })
    : [];

  // Group matches by date
  const groupedMatches = filteredMatches.reduce(
    (groups: Record<string, Match[]>, match: Match) => {
      if (match.startTime) {
        const dateKey = format(new Date(match.startTime), "yyyy-MM-dd");
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(match);
      }
      return groups;
    },
    {} as Record<string, Match[]>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Matches</h1>
          <p className="text-gray-600 mt-1">
            Track and manage tournament matches
          </p>
        </div>
        {user?.role === "organizer" && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setShowScheduleModal(true);
              loadScheduleData();
            }}
          >
            Schedule Match
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search matches, players, or courts..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                value={playerFilter}
                onChange={(e) => setPlayerFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Matches</option>
                <option value="mine">My Matches</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {
                (allMatches || []).filter((m) => m.status === "scheduled")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {
                (allMatches || []).filter((m) => m.status === "in-progress")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {
                (allMatches || []).filter((m) => m.status === "completed")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {(allMatches || []).length}
            </div>
            <div className="text-sm text-gray-600">Total Matches</div>
          </CardContent>
        </Card>
      </div>

      {/* Matches List */}
      {Object.keys(groupedMatches).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No matches found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMatches)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([dateKey, dayMatches]) => (
              <div key={dateKey}>
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {dayMatches[0]?.startTime
                      ? getDateLabel(dayMatches[0].startTime)
                      : "Date TBD"}
                  </h2>
                  <div className="ml-3 text-sm text-gray-500">
                    {dayMatches.length} match
                    {dayMatches.length !== 1 ? "es" : ""}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(dayMatches as Match[]).map((match: Match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onUpdateScore={handleUpdateScore}
                      onViewDetails={handleViewMatchDetails}
                      canUpdateScore={user?.role === "organizer"}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Score Update Modal */}
      <Modal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        title="Update Match Score"
        size="md"
      >
        {selectedMatch && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedMatch.player1?.name || "Player 1"} vs{" "}
                {selectedMatch.player2?.name || "Player 2"}
              </h3>
              {selectedMatch.startTime && (
                <p className="text-sm text-gray-600">
                  {format(
                    new Date(selectedMatch.startTime),
                    "MMM dd, yyyy • HH:mm"
                  )}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Sets Played
                </span>
                <select
                  value={scoreData.setsPlayed}
                  onChange={(e) =>
                    setScoreData({
                      ...scoreData,
                      setsPlayed: parseInt(e.target.value),
                    })
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={1}>1 Set</option>
                  <option value={2}>2 Sets</option>
                  <option value={3}>3 Sets</option>
                </select>
              </div>

              {Array.from({ length: scoreData.setsPlayed }, (_, setIndex) => (
                <div
                  key={setIndex}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Set {setIndex + 1}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {selectedMatch.player1?.name || "Player 1"}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="21"
                        value={scoreData.player1Games[setIndex]}
                        onChange={(e) => {
                          const newGames = [...scoreData.player1Games];
                          newGames[setIndex] = parseInt(e.target.value) || 0;
                          setScoreData({
                            ...scoreData,
                            player1Games: newGames,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {selectedMatch.player2?.name || "Player 2"}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="21"
                        value={scoreData.player2Games[setIndex]}
                        onChange={(e) => {
                          const newGames = [...scoreData.player2Games];
                          newGames[setIndex] = parseInt(e.target.value) || 0;
                          setScoreData({
                            ...scoreData,
                            player2Games: newGames,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowScoreModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveScore}>
                Save Score
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Schedule Match Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule a New Match"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tournament
            </label>
            <select
              value={scheduleForm.tournamentId}
              onChange={(e) =>
                setScheduleForm({
                  ...scheduleForm,
                  tournamentId: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a tournament</option>
              {tournaments.map((tournament) => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.name} ({tournament.status})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Player 1
              </label>
              <select
                value={scheduleForm.player1Id}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    player1Id: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select player 1</option>
                {users
                  .filter((u) => u.id !== scheduleForm.player2Id)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} (Rating: {user.rating})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Player 2
              </label>
              <select
                value={scheduleForm.player2Id}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    player2Id: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select player 2</option>
                {users
                  .filter((u) => u.id !== scheduleForm.player1Id)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} (Rating: {user.rating})
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date and Time
            </label>
            <input
              type="datetime-local"
              value={scheduleForm.startTime}
              onChange={(e) =>
                setScheduleForm({ ...scheduleForm, startTime: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Court
            </label>
            <select
              value={scheduleForm.courtId}
              onChange={(e) =>
                setScheduleForm({ ...scheduleForm, courtId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a court</option>
              {/* Add court options here */}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowScheduleModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleScheduleMatch}>
              Schedule Match
            </Button>
          </div>
        </div>
      </Modal>

      {/* Match Details Modal */}
      <MatchDetailsModal
        match={selectedMatch}
        isOpen={showMatchDetailsModal}
        onClose={() => setShowMatchDetailsModal(false)}
        canUpdateScore={user?.role === "organizer"}
        onUpdateScore={handleUpdateScoreFromDetails}
      />
    </div>
  );
};
