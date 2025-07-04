import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  DollarSign,
  Clock,
  ArrowLeft,
  UserPlus,
  UserMinus,
  Edit,
  Share2,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Tournament, TournamentParticipant, Match } from "../types";
import { tournamentAPI } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export const TournamentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [joiningTournament, setJoiningTournament] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "participants" | "matches" | "bracket"
  >("overview");

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await tournamentAPI.getById(id);
        console.log("Tournament response:", response); // Debug log
        setTournament(response.data);
      } catch (error) {
        console.error("Failed to load tournament:", error); // Debug log
        toast.error("Failed to load tournament details");
        navigate("/app/tournaments");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id, navigate]);

  const handleJoinTournament = async () => {
    if (!tournament || !id) return;

    try {
      setJoiningTournament(true);
      await tournamentAPI.join(id);
      toast.success("Successfully joined tournament!");

      // Refresh tournament data
      const response = await tournamentAPI.getById(id);
      setTournament(response.data);
    } catch {
      toast.error("Failed to join tournament");
    } finally {
      setJoiningTournament(false);
    }
  };

  const handleLeaveTournament = async () => {
    if (!tournament || !id) return;

    try {
      setJoiningTournament(true);
      await tournamentAPI.leave(id);
      toast.success("Successfully left tournament");

      // Refresh tournament data
      const response = await tournamentAPI.getById(id);
      setTournament(response.data);
    } catch {
      toast.error("Failed to leave tournament");
    } finally {
      setJoiningTournament(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "upcoming":
        return "info";
      case "ongoing":
        return "warning";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const isUserParticipant = tournament?.participants?.some(
    (participant: TournamentParticipant) => participant.user?.id === user?.id
  );

  const canJoin =
    tournament &&
    (tournament.status || "upcoming") === "upcoming" &&
    (tournament.currentParticipants || 0) < tournament.maxParticipants &&
    !isUserParticipant;

  const canLeave =
    tournament &&
    (tournament.status || "upcoming") === "upcoming" &&
    isUserParticipant;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tournament details...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tournament Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The tournament you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/app/tournaments")}>
            Back to Tournaments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/app/tournaments")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tournaments</span>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="w-8 h-8 text-green-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {tournament.name}
                    </h1>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge
                        variant={getStatusVariant(
                          tournament.status || "upcoming"
                        )}
                      >
                        {tournament.status
                          ? tournament.status.charAt(0).toUpperCase() +
                            tournament.status.slice(1)
                          : "Upcoming"}
                      </Badge>
                      <Badge variant="default" className="capitalize">
                        {tournament.type || "singles"}
                      </Badge>
                      <Badge variant="default" className="capitalize">
                        {tournament.format || "knockout"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-lg mb-6">
                  {tournament.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">
                        {tournament.startDate
                          ? format(
                              new Date(tournament.startDate),
                              "MMM dd, yyyy"
                            )
                          : "TBD"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">
                        {tournament.endDate
                          ? format(new Date(tournament.endDate), "MMM dd, yyyy")
                          : "TBD"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {tournament.location || "TBD"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Participants</p>
                      <p className="font-medium">
                        {tournament.currentParticipants || 0}/
                        {tournament.maxParticipants || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 mt-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign className="w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Entry Fee</p>
                      <p className="font-medium">${tournament.entryFee || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <Trophy className="w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Prize Pool</p>
                      <p className="font-medium">
                        ${tournament.prizePool || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col space-y-3">
                {canJoin && (
                  <Button
                    onClick={handleJoinTournament}
                    disabled={joiningTournament}
                    className="flex items-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>
                      {joiningTournament ? "Joining..." : "Join Tournament"}
                    </span>
                  </Button>
                )}

                {canLeave && (
                  <Button
                    variant="outline"
                    onClick={handleLeaveTournament}
                    disabled={joiningTournament}
                    className="flex items-center space-x-2"
                  >
                    <UserMinus className="w-4 h-4" />
                    <span>
                      {joiningTournament ? "Leaving..." : "Leave Tournament"}
                    </span>
                  </Button>
                )}

                {user?.role === "organizer" && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/app/tournaments/${id}/edit`)}
                    className="flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Tournament</span>
                  </Button>
                )}

                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", name: "Overview" },
                { id: "participants", name: "Participants" },
                { id: "matches", name: "Matches" },
                { id: "bracket", name: "Bracket" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as
                        | "overview"
                        | "participants"
                        | "matches"
                        | "bracket"
                    )
                  }
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Tournament Rules */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    Tournament Rules & Format
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Format</h4>
                      <p className="text-gray-600 capitalize">
                        {tournament.format} format
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Tournament Type
                      </h4>
                      <p className="text-gray-600 capitalize">
                        {tournament.type} tournament
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Rules</h4>
                      <ul className="text-gray-600 space-y-1 list-disc list-inside">
                        <li>Standard pickleball rules apply</li>
                        <li>Games played to 11 points, win by 2</li>
                        <li>Best of 3 games per match</li>
                        <li>30-second timeout per game</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organizer Info */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    Tournament Organizer
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">
                      {tournament.organizer?.name || "Tournament Organizer"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {tournament.organizer?.role
                        ? tournament.organizer.role.charAt(0).toUpperCase() +
                          tournament.organizer.role.slice(1)
                        : "Organizer"}
                    </p>
                    {tournament.organizer?.location && (
                      <p className="text-xs text-gray-400 mt-1">
                        {tournament.organizer.location}
                      </p>
                    )}
                    <Button variant="outline" size="sm" className="mt-4">
                      Contact Organizer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "participants" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    Participants ({tournament.currentParticipants}/
                    {tournament.maxParticipants})
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tournament.participants?.map(
                      (participant: TournamentParticipant) => (
                        <div
                          key={participant.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {participant.user?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Rating: {participant.user?.rating}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {tournament.currentParticipants === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No participants yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "matches" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Tournament Matches</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tournament.matches?.map((match: Match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium text-gray-900">
                            Round {match.round || 1}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {match.player1?.name}
                            </span>
                            <span className="text-gray-400">vs</span>
                            <span className="font-medium">
                              {match.player2?.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-500">
                            {match.startTime &&
                              format(
                                new Date(match.startTime),
                                "MMM dd, HH:mm"
                              )}
                          </div>
                          <Badge
                            variant={
                              match.status === "completed"
                                ? "success"
                                : "default"
                            }
                          >
                            {match.status}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {(!tournament.matches ||
                      tournament.matches.length === 0) && (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No matches scheduled yet
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "bracket" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Tournament Bracket</h3>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">
                      Bracket will be available when tournament starts
                    </p>
                    <p className="text-sm text-gray-400">
                      Check back after registration closes
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
