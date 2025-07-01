import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Play,
  CheckCircle,
  Filter,
  Search,
  Plus,
  Edit,
  Eye,
} from "lucide-react";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { useAuthStore } from "../store/authStore";
import { useTournamentStore } from "../store/tournamentStore";
import { matchAPI, tournamentAPI } from "../services/api";
import { Match } from "../types";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { MatchCard } from "../components/matches/MatchCard";
import toast from "react-hot-toast";

export const Matches: React.FC = () => {
  const { user } = useAuthStore();
  const { matches, tournaments, setMatches } = useTournamentStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoreData, setScoreData] = useState({
    player1Games: [0, 0, 0],
    player2Games: [0, 0, 0],
    setsPlayed: 1,
  });

  // Mock matches data since we don't have a backend
  const mockMatches: Match[] = [
    {
      id: "1",
      tournamentId: "1",
      round: 1,
      player1: {
        id: "1",
        userId: "1",
        name: "John Smith",
        rating: 4.2,
        wins: 15,
        losses: 3,
        gamesPlayed: 18,
      },
      player2: {
        id: "2",
        userId: "2",
        name: "Mike Johnson",
        rating: 4.0,
        wins: 12,
        losses: 6,
        gamesPlayed: 18,
      },
      status: "scheduled",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      court: { id: "1", name: "Court 1", isAvailable: true },
    },
    {
      id: "2",
      tournamentId: "1",
      round: 1,
      player1: {
        id: "3",
        userId: "3",
        name: "Sarah Wilson",
        rating: 4.5,
        wins: 20,
        losses: 2,
        gamesPlayed: 22,
      },
      player2: {
        id: "4",
        userId: "4",
        name: "Emma Davis",
        rating: 4.1,
        wins: 14,
        losses: 8,
        gamesPlayed: 22,
      },
      status: "in-progress",
      startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      court: { id: "2", name: "Court 2", isAvailable: false },
      score: {
        player1: [11, 8],
        player2: [9, 11],
      },
    },
    {
      id: "3",
      tournamentId: "2",
      round: 1,
      player1: {
        id: "5",
        userId: "5",
        name: "David Brown",
        rating: 3.8,
        wins: 10,
        losses: 5,
        gamesPlayed: 15,
      },
      player2: {
        id: "6",
        userId: "6",
        name: "Lisa Garcia",
        rating: 4.3,
        wins: 18,
        losses: 4,
        gamesPlayed: 22,
      },
      status: "completed",
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      court: { id: "3", name: "Court 3", isAvailable: true },
      score: {
        player1: [11, 8, 7],
        player2: [9, 11, 11],
      },
      winner: "6",
    },
  ];

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      // In a real app, this would fetch from the API
      setMatches(mockMatches);
    } catch (error) {
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScore = (matchId: string) => {
    const match = mockMatches.find((m) => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
      if (match.score) {
        setScoreData({
          player1Games: [...match.score.player1, 0],
          player2Games: [...match.score.player2, 0],
          setsPlayed: match.score.player1.length,
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
      toast.error("Failed to update score");
    }
  };

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM dd, yyyy");
  };

  const filteredMatches = Array.isArray(mockMatches)
    ? mockMatches.filter((match) => {
        const matchesSearch =
          match.player1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.player2.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.court?.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || match.status === statusFilter;

        let matchesDate = true;
        if (dateFilter !== "all") {
          const matchDate = new Date(match.startTime);
          switch (dateFilter) {
            case "today":
              matchesDate = isToday(matchDate);
              break;
            case "tomorrow":
              matchesDate = isTomorrow(matchDate);
              break;
            case "week":
              const weekFromNow = new Date();
              weekFromNow.setDate(weekFromNow.getDate() + 7);
              matchesDate = matchDate <= weekFromNow;
              break;
          }
        }

        return matchesSearch && matchesStatus && matchesDate;
      })
    : [];

  // Group matches by date
  const groupedMatches = filteredMatches.reduce((groups, match) => {
    const dateKey = format(new Date(match.startTime), "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(match);
    return groups;
  }, {} as Record<string, Match[]>);

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
          <Button variant="primary" icon={Plus}>
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
              {mockMatches.filter((m) => m.status === "scheduled").length}
            </div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {mockMatches.filter((m) => m.status === "in-progress").length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {mockMatches.filter((m) => m.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {mockMatches.length}
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
                    {getDateLabel(dayMatches[0].startTime)}
                  </h2>
                  <div className="ml-3 text-sm text-gray-500">
                    {dayMatches.length} match
                    {dayMatches.length !== 1 ? "es" : ""}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dayMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onUpdateScore={handleUpdateScore}
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
                {selectedMatch.player1.name} vs {selectedMatch.player2.name}
              </h3>
              <p className="text-sm text-gray-600">
                {format(
                  new Date(selectedMatch.startTime),
                  "MMM dd, yyyy • HH:mm"
                )}
              </p>
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
                        {selectedMatch.player1.name}
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
                        {selectedMatch.player2.name}
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
    </div>
  );
};
