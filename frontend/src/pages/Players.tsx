import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Trophy,
  TrendingUp,
  TrendingDown,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Target,
  BarChart3,
  Users,
  Star,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { playerAPI } from "../services/api";
import { Player } from "../types";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import toast from "react-hot-toast";

export const Players: React.FC = () => {
  const { user } = useAuthStore();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  // Mock players data
  const mockPlayers: Player[] = [
    {
      id: "1",
      userId: "1",
      name: "John Smith",
      rating: 4.2,
      wins: 15,
      losses: 3,
      gamesPlayed: 18,
      profileImage:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "2",
      userId: "2",
      name: "Sarah Wilson",
      rating: 4.5,
      wins: 20,
      losses: 2,
      gamesPlayed: 22,
      profileImage:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "3",
      userId: "3",
      name: "Mike Johnson",
      rating: 4.0,
      wins: 12,
      losses: 6,
      gamesPlayed: 18,
      profileImage:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "4",
      userId: "4",
      name: "Emma Davis",
      rating: 4.1,
      wins: 14,
      losses: 8,
      gamesPlayed: 22,
      profileImage:
        "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "5",
      userId: "5",
      name: "David Brown",
      rating: 3.8,
      wins: 10,
      losses: 5,
      gamesPlayed: 15,
      profileImage:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "6",
      userId: "6",
      name: "Lisa Garcia",
      rating: 4.3,
      wins: 18,
      losses: 4,
      gamesPlayed: 22,
      profileImage:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "7",
      userId: "7",
      name: "Alex Chen",
      rating: 3.9,
      wins: 11,
      losses: 7,
      gamesPlayed: 18,
      profileImage:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    {
      id: "8",
      userId: "8",
      name: "Maria Rodriguez",
      rating: 4.4,
      wins: 19,
      losses: 3,
      gamesPlayed: 22,
      profileImage:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
  ];

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      // In a real app, this would fetch from the API
      setPlayers(mockPlayers);
    } catch (error) {
      toast.error("Failed to load players");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setShowPlayerModal(true);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-gray-600";
  };

  const getRatingBadgeVariant = (rating: number) => {
    if (rating >= 4.5) return "success";
    if (rating >= 4.0) return "info";
    if (rating >= 3.5) return "warning";
    return "default";
  };

  const getWinPercentage = (wins: number, losses: number) => {
    const total = wins + losses;
    return total > 0 ? Math.round((wins / total) * 100) : 0;
  };

  const filteredPlayers = Array.isArray(players)
    ? players.filter((player) => {
        const matchesSearch = player.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        let matchesRating = true;
        if (ratingFilter !== "all") {
          switch (ratingFilter) {
            case "beginner":
              matchesRating = player.rating < 3.5;
              break;
            case "intermediate":
              matchesRating = player.rating >= 3.5 && player.rating < 4.0;
              break;
            case "advanced":
              matchesRating = player.rating >= 4.0 && player.rating < 4.5;
              break;
            case "expert":
              matchesRating = player.rating >= 4.5;
              break;
          }
        }

        return matchesSearch && matchesRating;
      })
    : [];

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "wins":
        return b.wins - a.wins;
      case "winPercentage":
        return (
          getWinPercentage(b.wins, b.losses) -
          getWinPercentage(a.wins, a.losses)
        );
      case "gamesPlayed":
        return b.gamesPlayed - a.gamesPlayed;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const PlayerCard = ({ player, rank }: { player: Player; rank: number }) => {
    const winPercentage = getWinPercentage(player.wins, player.losses);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="cursor-pointer"
        onClick={() => handleViewPlayer(player)}
      >
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={
                    player.profileImage ||
                    `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150`
                  }
                  alt={player.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {rank}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {player.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge
                    variant={getRatingBadgeVariant(player.rating)}
                    size="sm"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    {player.rating.toFixed(1)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {player.gamesPlayed} games played
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {winPercentage}%
                </div>
                <div className="text-sm text-gray-500">Win Rate</div>
                <div className="text-xs text-gray-400 mt-1">
                  {player.wins}W - {player.losses}L
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Players</h1>
          <p className="text-gray-600 mt-1">
            View player rankings and statistics
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search players..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner (&lt; 3.5)</option>
                <option value="intermediate">Intermediate (3.5 - 4.0)</option>
                <option value="advanced">Advanced (4.0 - 4.5)</option>
                <option value="expert">Expert (4.5+)</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="rating">Sort by Rating</option>
                <option value="wins">Sort by Wins</option>
                <option value="winPercentage">Sort by Win %</option>
                <option value="gamesPlayed">Sort by Games</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {players.length}
            </div>
            <div className="text-sm text-gray-600">Total Players</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(
                players.reduce((acc, p) => acc + p.rating, 0) / players.length
              ).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {players.reduce((acc, p) => acc + p.gamesPlayed, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Games</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(
                players.reduce(
                  (acc, p) => acc + getWinPercentage(p.wins, p.losses),
                  0
                ) / players.length
              )}
              %
            </div>
            <div className="text-sm text-gray-600">Avg Win Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Players */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Top Players</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sortedPlayers.slice(0, 3).map((player, index) => (
              <div
                key={player.id}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <div
                  className={`text-3xl mb-2 ${
                    index === 0
                      ? "text-yellow-500"
                      : index === 1
                      ? "text-gray-400"
                      : "text-orange-600"
                  }`}
                >
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </div>
                <img
                  src={
                    player.profileImage ||
                    `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150`
                  }
                  alt={player.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                />
                <h3 className="font-semibold text-gray-900">{player.name}</h3>
                <div className="text-sm text-gray-600">
                  Rating: {player.rating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">
                  {getWinPercentage(player.wins, player.losses)}% Win Rate
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Players List */}
      {sortedPlayers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No players found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedPlayers.map((player, index) => (
            <PlayerCard key={player.id} player={player} rank={index + 1} />
          ))}
        </div>
      )}

      {/* Player Details Modal */}
      <Modal
        isOpen={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
        title="Player Details"
        size="lg"
      >
        {selectedPlayer && (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <img
                src={
                  selectedPlayer.profileImage ||
                  `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150`
                }
                alt={selectedPlayer.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPlayer.name}
                </h2>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge
                    variant={getRatingBadgeVariant(selectedPlayer.rating)}
                    size="md"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {selectedPlayer.rating.toFixed(1)} Rating
                  </Badge>
                  <Badge variant="info" size="md">
                    Rank #
                    {sortedPlayers.findIndex(
                      (p) => p.id === selectedPlayer.id
                    ) + 1}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedPlayer.wins}
                  </div>
                  <div className="text-sm text-gray-600">Wins</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedPlayer.losses}
                  </div>
                  <div className="text-sm text-gray-600">Losses</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {getWinPercentage(
                      selectedPlayer.wins,
                      selectedPlayer.losses
                    )}
                    %
                  </div>
                  <div className="text-sm text-gray-600">Win Rate</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Performance Stats</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Games Played</span>
                      <span className="font-medium">
                        {selectedPlayer.gamesPlayed}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Rating</span>
                      <span
                        className={`font-medium ${getRatingColor(
                          selectedPlayer.rating
                        )}`}
                      >
                        {selectedPlayer.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Win Streak</span>
                      <span className="font-medium">3 games</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Rating</span>
                      <span className="font-medium">
                        {(selectedPlayer.rating + 0.2).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Won vs Mike Johnson
                      </span>
                      <span className="text-xs text-gray-400">2 days ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Won vs Emma Davis
                      </span>
                      <span className="text-xs text-gray-400">5 days ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Lost to Sarah Wilson
                      </span>
                      <span className="text-xs text-gray-400">1 week ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Won vs David Brown
                      </span>
                      <span className="text-xs text-gray-400">1 week ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
