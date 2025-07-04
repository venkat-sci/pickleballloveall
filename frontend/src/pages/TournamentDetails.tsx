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
  MessageCircle,
  FileText,
  AlertCircle,
  Play,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Tournament, TournamentParticipant, Match } from "../types";
import { tournamentAPI, matchAPI } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { EditTournamentModal } from "../components/tournaments/EditTournamentModal";
import { ContactOrganizerModal } from "../components/tournaments/ContactOrganizerModal";

export const TournamentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [joiningTournament, setJoiningTournament] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "participants" | "matches" | "bracket" | "rules"
  >("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [scoreData, setScoreData] = useState({
    player1Games: [0, 0, 0],
    player2Games: [0, 0, 0],
    setsPlayed: 1,
  });

  // Score handling functions
  const handleUpdateScore = (match: Match) => {
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

      // Refresh tournament data to get updated matches
      if (id) {
        const response = await tournamentAPI.getById(id);
        setTournament(response.data);
      }
    } catch (error) {
      console.error("Failed to update score:", error);
      toast.error("Failed to update score");
    }
  };

  const canUpdateScore = (match: Match) => {
    return (
      user &&
      (user.role === "organizer" ||
        match.player1Id === user.id ||
        match.player2Id === user.id) &&
      match.status !== "completed"
    );
  };

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

  const handleStartTournament = async () => {
    if (!tournament || !id) return;

    try {
      setLoading(true);
      await tournamentAPI.start(id);

      // Refresh tournament data from API to get the complete updated data
      const response = await tournamentAPI.getById(id);
      setTournament(response.data);

      toast.success(
        "Tournament started successfully! Bracket has been generated."
      );
    } catch (error: unknown) {
      console.error("Error starting tournament:", error);
      let errorMessage = "Failed to start tournament";

      if (error && typeof error === "object" && "response" in error) {
        const responseError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = responseError.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTournament = async (updatedData: Partial<Tournament>) => {
    if (!tournament || !id) return;

    try {
      await tournamentAPI.update(id, updatedData);

      // Refresh tournament data
      const response = await tournamentAPI.getById(id);
      setTournament(response.data);

      toast.success("Tournament updated successfully!");
    } catch (error) {
      console.error("Failed to update tournament:", error);
      throw error; // Re-throw to handle in modal
    }
  };

  const handleShareTournament = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Tournament link copied to clipboard!");
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

  const isOrganizer = user?.id === tournament?.organizerId;

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

                {isOrganizer &&
                  tournament.status === "upcoming" &&
                  tournament.currentParticipants >= 2 && (
                    <Button
                      onClick={handleStartTournament}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Play className="w-4 h-4" />
                      <span>
                        {loading ? "Starting..." : "Start Tournament"}
                      </span>
                    </Button>
                  )}

                {isOrganizer && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Tournament</span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => setIsContactModalOpen(true)}
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Organizer</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShareTournament}
                  className="flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Tournament</span>
                </Button>
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
                { id: "rules", name: "Rules" },
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
                        | "rules"
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
                      <h4 className="font-medium text-gray-900 mb-2">
                        Tournament Format
                      </h4>
                      <p className="text-gray-600 capitalize">
                        {tournament.format || "knockout"} format •{" "}
                        {tournament.type || "singles"} tournament
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Quick Rules Summary
                      </h4>
                      <div className="text-gray-600 space-y-1">
                        {tournament.rules ? (
                          <p className="text-sm">
                            {tournament.rules.slice(0, 200)}...
                            <button
                              onClick={() => setActiveTab("rules")}
                              className="text-green-600 hover:text-green-700 ml-1"
                            >
                              View full rules
                            </button>
                          </p>
                        ) : (
                          <ul className="space-y-1 list-disc list-inside text-sm">
                            <li>Standard pickleball rules apply</li>
                            <li>Games played to 11 points, win by 2</li>
                            <li>Best of 3 games per match</li>
                            <li>30-second timeout per game</li>
                          </ul>
                        )}
                      </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setIsContactModalOpen(true)}
                    >
                      Contact Organizer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tournament Stats */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Tournament Stats</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Registration Progress
                      </span>
                      <span className="font-medium">
                        {tournament.currentParticipants || 0}/
                        {tournament.maxParticipants}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${
                            ((tournament.currentParticipants || 0) /
                              tournament.maxParticipants) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>

                    <div className="pt-2 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
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
                      </div>

                      {tournament.entryFee && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Entry Fee</span>
                          <span className="font-medium">
                            ${tournament.entryFee}
                          </span>
                        </div>
                      )}

                      {tournament.prizePool && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Prize Pool</span>
                          <span className="font-medium text-green-600">
                            ${tournament.prizePool}
                          </span>
                        </div>
                      )}
                    </div>
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
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium text-gray-900">
                            Round {match.round || 1}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {match.player1?.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                Rating: {match.player1?.rating} | W-L:{" "}
                                {match.player1?.totalWins || 0}-
                                {match.player1?.totalLosses || 0}
                              </span>
                            </div>
                            <span className="text-gray-400 font-bold mx-3">
                              vs
                            </span>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {match.player2?.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                Rating: {match.player2?.rating} | W-L:{" "}
                                {match.player2?.totalWins || 0}-
                                {match.player2?.totalLosses || 0}
                              </span>
                            </div>
                          </div>
                          {/* Display score if available */}
                          {match.score && (
                            <div className="ml-4 text-sm font-mono bg-gray-50 px-2 py-1 rounded">
                              {match.score.player1.map((score, index) => (
                                <span key={index} className="mr-2">
                                  {score}-{match.score!.player2[index]}
                                </span>
                              ))}
                            </div>
                          )}
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
                                : match.status === "in-progress"
                                ? "warning"
                                : "default"
                            }
                          >
                            {match.status}
                          </Badge>
                          {/* Action buttons */}
                          <div className="flex space-x-2">
                            {canUpdateScore(match) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateScore(match)}
                                className="text-xs"
                              >
                                {match.status === "scheduled"
                                  ? "Start Match"
                                  : "Update Score"}
                              </Button>
                            )}
                            {match.status === "completed" && match.winner && (
                              <div className="text-xs text-green-600 font-medium">
                                Winner:{" "}
                                {match.winner === match.player1Id
                                  ? match.player1?.name
                                  : match.player2?.name}
                              </div>
                            )}
                          </div>
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
                        {isOrganizer && tournament.status === "upcoming" && (
                          <p className="text-sm text-gray-400 mt-2">
                            Click "Start Tournament" to generate matches
                          </p>
                        )}
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

          {activeTab === "rules" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Tournament Rules</span>
                  </h3>
                  {isOrganizer && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Rules</span>
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {tournament?.rules ? (
                      <div
                        className="whitespace-pre-wrap text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: tournament.rules.replace(/\n/g, "<br />"),
                        }}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">
                          No rules have been set for this tournament yet.
                        </p>
                        {isOrganizer && (
                          <Button
                            variant="outline"
                            className="mt-3"
                            onClick={() => setIsEditModalOpen(true)}
                          >
                            Add Tournament Rules
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      {tournament && (
        <>
          <EditTournamentModal
            tournament={tournament}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateTournament}
          />

          {tournament.organizer && (
            <ContactOrganizerModal
              organizer={tournament.organizer}
              tournamentName={tournament.name}
              isOpen={isContactModalOpen}
              onClose={() => setIsContactModalOpen(false)}
            />
          )}
        </>
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
                      <Input
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
                        className="w-full text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        {selectedMatch.player2?.name || "Player 2"}
                      </label>
                      <Input
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
                        className="w-full text-center"
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
