import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  Trophy,
  DollarSign,
  Grid,
  List,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useTournamentStore } from "../store/tournamentStore";
import { tournamentAPI } from "../services/api";
import { Tournament } from "../types";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { TournamentCard } from "../components/tournaments/TournamentCard";
import toast from "react-hot-toast";

export const Tournaments: React.FC = () => {
  const { user } = useAuthStore();
  const { tournaments, setTournaments } = useTournamentStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: "",
    description: "",
    category: "men" as "men" | "women" | "kids",
    type: "singles" as "singles" | "doubles" | "mixed",
    format: "knockout" as "knockout" | "round-robin" | "swiss",
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: 16,
    entryFee: 0,
    prizePool: 0,
    numGroups: 1,
    knockoutEnabled: false,
    advanceCount: 1,
  });

  const [groupPreview, setGroupPreview] = useState<
    Array<{ name: string; players: string[] }>
  >([]);
  // Live preview of group distribution for create modal
  useEffect(() => {
    const totalPlayers = newTournament.maxParticipants || 0;
    const numGroups = newTournament.numGroups || 1;
    if (numGroups < 1 || totalPlayers < 1) {
      setGroupPreview([]);
      return;
    }
    const players = Array.from(
      { length: totalPlayers },
      (_, i) => `Player ${i + 1}`
    );
    const groups: Array<{ name: string; players: string[] }> = [];
    for (let g = 0; g < numGroups; g++) {
      groups.push({
        name: `Group ${String.fromCharCode(65 + g)}`,
        players: [],
      });
    }
    players.forEach((player, idx) => {
      groups[idx % numGroups].players.push(player);
    });
    setGroupPreview(groups);
  }, [newTournament.maxParticipants, newTournament.numGroups]);

  const loadTournaments = useCallback(async () => {
    try {
      const response = await tournamentAPI.getAll();

      // Backend returns { data: tournaments[] }, so axios response is { data: { data: tournaments[] } }
      // We need to access response.data.data to get the actual tournaments array
      let tournamentData: Tournament[] = [];

      if (
        response.data &&
        typeof response.data === "object" &&
        "data" in response.data &&
        Array.isArray(response.data.data)
      ) {
        tournamentData = response.data.data as Tournament[];
      } else if (Array.isArray(response.data)) {
        tournamentData = response.data;
      } else {
        tournamentData = [];
      }

      setTournaments(tournamentData);
    } catch (error) {
      console.error("❌ Failed to load tournaments:", error);
      toast.error("Failed to load tournaments");
      // Set empty array on error
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  }, [setTournaments]);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  const handleCreateTournament = async () => {
    try {
      const tournamentData = {
        ...newTournament,
        organizerId: user?.id || "",
        currentParticipants: 0,
        status: "upcoming" as const,
        courts: [],
        participants: [],
      };

      await tournamentAPI.create(tournamentData);
      toast.success("Tournament created successfully!");
      setShowCreateModal(false);
      setNewTournament({
        name: "",
        description: "",
        category: "men",
        type: "singles",
        format: "knockout",
        startDate: "",
        endDate: "",
        location: "",
        maxParticipants: 16,
        entryFee: 0,
        prizePool: 0,
        numGroups: 1,
        knockoutEnabled: false,
        advanceCount: 1,
      });
      loadTournaments();
    } catch {
      toast.error("Failed to create tournament");
    }
  };

  const handleJoinTournament = async (tournamentId: string) => {
    try {
      await tournamentAPI.join(tournamentId);
      toast.success("Successfully joined tournament!");
      loadTournaments();
    } catch {
      toast.error("Failed to join tournament");
    }
  };

  const handleViewTournament = (tournamentId: string) => {
    // Navigate to tournament details page
    navigate(`/app/tournaments/${tournamentId}`);
  };

  const filteredTournaments = Array.isArray(tournaments)
    ? tournaments.filter((tournament) => {
        const matchesSearch =
          tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || tournament.status === statusFilter;
        const matchesType =
          typeFilter === "all" || tournament.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading tournaments...</div>
      </div>
    );
  }

  const TournamentListItem = ({ tournament }: { tournament: Tournament }) => {
    const handleListItemClick = (e: React.MouseEvent) => {
      // Don't trigger item click if clicking on a button
      if ((e.target as HTMLElement).closest("button")) {
        return;
      }
      handleViewTournament(tournament.id);
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleListItemClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {tournament.name}
              </h3>
              <Badge
                variant={
                  (tournament.status || "upcoming") === "upcoming"
                    ? "info"
                    : (tournament.status || "upcoming") === "ongoing"
                    ? "warning"
                    : "success"
                }
              >
                {tournament.status
                  ? tournament.status.charAt(0).toUpperCase() +
                    tournament.status.slice(1)
                  : "Upcoming"}
              </Badge>
            </div>
            <p className="text-gray-600 mb-3">{tournament.description}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(tournament.startDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {tournament.location}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {tournament.currentParticipants}/{tournament.maxParticipants}
              </div>
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                {tournament.type} • {tournament.format}
              </div>
              {tournament.prizePool && (
                <div className="flex items-center text-green-600 font-medium">
                  <DollarSign className="w-4 h-4 mr-1" />${tournament.prizePool}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewTournament(tournament.id)}
            >
              View Details
            </Button>
            {user?.role === "player" &&
              (tournament.status || "upcoming") === "upcoming" &&
              (tournament.currentParticipants || 0) <
                tournament.maxParticipants && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleJoinTournament(tournament.id)}
                >
                  Join
                </Button>
              )}
          </div>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Tournaments</h1>
          <p className="text-gray-600 mt-1">
            Discover and join exciting pickleball tournaments
          </p>
        </div>
        {user?.role === "organizer" && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
          >
            Create Tournament
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tournaments..."
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
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Types</option>
                <option value="singles">Singles</option>
                <option value="doubles">Doubles</option>
                <option value="mixed">Mixed</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {tournaments.length}
            </div>
            <div className="text-sm text-gray-600">Total Tournaments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tournaments.filter((t) => t.status === "upcoming").length}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {tournaments.filter((t) => t.status === "ongoing").length}
            </div>
            <div className="text-sm text-gray-600">Ongoing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {tournaments.reduce((acc, t) => acc + t.currentParticipants, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Players</div>
          </CardContent>
        </Card>
      </div>

      {/* Tournaments List/Grid */}
      {filteredTournaments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tournaments found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredTournaments.map((tournament) =>
            viewMode === "grid" ? (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onJoin={handleJoinTournament}
                onView={handleViewTournament}
                canJoin={user?.role === "player"}
              />
            ) : (
              <TournamentListItem key={tournament.id} tournament={tournament} />
            )
          )}
        </div>
      )}

      {/* Create Tournament Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Tournament"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tournament Name"
              value={newTournament.name}
              onChange={(e) =>
                setNewTournament({ ...newTournament, name: e.target.value })
              }
              placeholder="Enter tournament name"
            />
            <Input
              label="Location"
              value={newTournament.location}
              onChange={(e) =>
                setNewTournament({ ...newTournament, location: e.target.value })
              }
              placeholder="Enter location"
            />
          </div>

          <Input
            label="Description"
            value={newTournament.description}
            onChange={(e) =>
              setNewTournament({
                ...newTournament,
                description: e.target.value,
              })
            }
            placeholder="Enter tournament description"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newTournament.type}
                onChange={(e) =>
                  setNewTournament({
                    ...newTournament,
                    type: e.target.value as "singles" | "doubles" | "mixed",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="singles">Singles</option>
                <option value="doubles">Doubles</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newTournament.category || "men"}
                onChange={(e) =>
                  setNewTournament({
                    ...newTournament,
                    category: e.target.value as "men" | "women" | "kids",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format
              </label>
              <select
                value={newTournament.format}
                onChange={(e) =>
                  setNewTournament({
                    ...newTournament,
                    format: e.target.value as
                      | "round-robin"
                      | "knockout"
                      | "swiss",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="knockout">Knockout</option>
                <option value="round-robin">Round Robin</option>
                <option value="swiss">Swiss</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={newTournament.startDate}
              onChange={(e) =>
                setNewTournament({
                  ...newTournament,
                  startDate: e.target.value,
                })
              }
            />
            <Input
              label="End Date"
              type="date"
              value={newTournament.endDate}
              onChange={(e) =>
                setNewTournament({ ...newTournament, endDate: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Max Participants"
              type="number"
              value={newTournament.maxParticipants}
              onChange={(e) =>
                setNewTournament({
                  ...newTournament,
                  maxParticipants: parseInt(e.target.value),
                })
              }
              min="4"
              max="128"
            />
            <Input
              label="Entry Fee ($)"
              type="number"
              value={newTournament.entryFee}
              onChange={(e) =>
                setNewTournament({
                  ...newTournament,
                  entryFee: parseFloat(e.target.value),
                })
              }
              min="0"
              step="0.01"
            />
            <Input
              label="Prize Pool ($)"
              type="number"
              value={newTournament.prizePool}
              onChange={(e) =>
                setNewTournament({
                  ...newTournament,
                  prizePool: parseFloat(e.target.value),
                })
              }
              min="0"
              step="0.01"
            />
          </div>
          {/* Number of Groups Selector (only for round-robin) */}
          {newTournament.format === "round-robin" && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Groups
              </label>
              <Input
                name="numGroups"
                type="number"
                min="1"
                max={newTournament.maxParticipants}
                value={newTournament.numGroups}
                onChange={(e) =>
                  setNewTournament({
                    ...newTournament,
                    numGroups: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Players will be evenly distributed into groups (A, B, C, ...)
              </p>
            </div>
          )}
          {/* Knockout Advancement Option (only for round-robin) */}
          {newTournament.format === "round-robin" && (
            <div className="md:col-span-2 flex items-center space-x-3">
              <input
                type="checkbox"
                name="knockoutEnabled"
                checked={newTournament.knockoutEnabled}
                onChange={(e) =>
                  setNewTournament({
                    ...newTournament,
                    knockoutEnabled: e.target.checked,
                  })
                }
                id="knockoutEnabled"
                className="mr-2"
              />
              <label
                htmlFor="knockoutEnabled"
                className="text-sm font-medium text-gray-700"
              >
                Enable Knockout Stage after Groups
              </label>
              {newTournament.knockoutEnabled && (
                <div className="flex items-center space-x-2 ml-4">
                  <label className="text-xs text-gray-500">Advance top</label>
                  <Input
                    name="advanceCount"
                    type="number"
                    min="1"
                    max={Math.ceil(
                      newTournament.maxParticipants / newTournament.numGroups
                    )}
                    value={newTournament.advanceCount}
                    onChange={(e) =>
                      setNewTournament({
                        ...newTournament,
                        advanceCount: Math.max(
                          1,
                          parseInt(e.target.value) || 1
                        ),
                      })
                    }
                    className="w-16"
                  />
                  <span className="text-xs text-gray-500">from each group</span>
                </div>
              )}
            </div>
          )}
          {/* Live Group Preview (only for round-robin) */}
          {newTournament.format === "round-robin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Distribution Preview
              </label>
              {groupPreview.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupPreview.map((group) => (
                    <div key={group.name} className="bg-gray-50 rounded-lg p-3">
                      <div className="font-semibold text-green-700 mb-2">
                        {group.name}
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {group.players.map((player) => (
                          <li key={player}>{player}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  Set max participants and number of groups to preview
                  distribution.
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateTournament}>
              Create Tournament
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
