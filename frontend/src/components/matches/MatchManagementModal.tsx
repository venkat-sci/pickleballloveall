import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  UserPlus,
  UserMinus,
  Play,
  Users,
  Mail,
  Check,
  AlertCircle,
} from "lucide-react";
import { Match, User } from "../../types";
import { matchAPI, userAPI } from "../../services/api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { Badge } from "../ui/Badge";
import toast from "react-hot-toast";

interface MatchManagementModalProps {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
  onMatchUpdated: () => void;
  isOrganizer: boolean;
}

interface ScoreKeeper {
  id: string;
  name: string;
  email: string;
}

export const MatchManagementModal: React.FC<MatchManagementModalProps> = ({
  match,
  isOpen,
  onClose,
  onMatchUpdated,
  isOrganizer,
}) => {
  const [activeTab, setActiveTab] = useState<"schedule" | "scoreKeepers">(
    "schedule"
  );
  const [scoreKeepers, setScoreKeepers] = useState<ScoreKeeper[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [startingEarly, setStartingEarly] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Load score keepers when modal opens
  const loadScoreKeepers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await matchAPI.getScoreKeepers(match.id);
      setScoreKeepers(response.data.scoreKeepers);
    } catch (error) {
      console.error("Failed to load score keepers:", error);
      toast.error("Failed to load score keepers");
    } finally {
      setLoading(false);
    }
  }, [match.id]);

  useEffect(() => {
    if (isOpen && match) {
      loadScoreKeepers();
    }
  }, [isOpen, match, loadScoreKeepers]);

  const searchUsers = async () => {
    if (!searchEmail.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await userAPI.search(searchEmail);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Failed to search users:", error);
      toast.error("Failed to search users");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleStartEarly = async () => {
    try {
      setStartingEarly(true);
      await matchAPI.startEarly(match.id);
      toast.success("Match started early successfully!");
      onMatchUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to start match early:", error);
      toast.error("Failed to start match early");
    } finally {
      setStartingEarly(false);
    }
  };

  const handleAddScoreKeeper = async (userId: string) => {
    try {
      await matchAPI.addScoreKeeper(match.id, userId);
      toast.success("Score keeper added successfully!");
      await loadScoreKeepers();
      setSearchEmail("");
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to add score keeper:", error);
      toast.error("Failed to add score keeper");
    }
  };

  const handleRemoveScoreKeeper = async (userId: string) => {
    try {
      await matchAPI.removeScoreKeeper(match.id, userId);
      toast.success("Score keeper removed successfully!");
      await loadScoreKeepers();
    } catch (error) {
      console.error("Failed to remove score keeper:", error);
      toast.error("Failed to remove score keeper");
    }
  };

  const canStartEarly = () => {
    return (
      match.status === "scheduled" &&
      match.canStartEarly &&
      !match.actualStartTime
    );
  };

  const isAlreadyScoreKeeper = (userId: string) => {
    return scoreKeepers.some((sk) => sk.id === userId);
  };

  const getMatchStatusInfo = () => {
    if (match.status === "completed") {
      return {
        color: "green",
        text: "Match Completed",
        icon: Check,
      };
    }
    if (match.status === "in-progress") {
      return {
        color: "yellow",
        text: "Match In Progress",
        icon: Play,
      };
    }
    if (match.actualStartTime) {
      return {
        color: "blue",
        text: "Started Early",
        icon: Clock,
      };
    }
    return {
      color: "gray",
      text: "Scheduled",
      icon: Clock,
    };
  };

  const statusInfo = getMatchStatusInfo();
  const StatusIcon = statusInfo.icon;

  if (!isOrganizer) {
    return null;
  }

  return (
    <Modal
      title={`Manage Match ${match.id.slice(-4)}`}
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
    >
      <div className="space-y-6">
        {/* Match Status Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <StatusIcon size={20} className={`text-${statusInfo.color}-600`} />
            <div>
              <h3 className="font-semibold text-gray-900">
                {match.player1?.name || "TBD"} vs {match.player2?.name || "TBD"}
              </h3>
              <p className="text-sm text-gray-600">{statusInfo.text}</p>
            </div>
          </div>
          <Badge
            variant={
              statusInfo.color === "green"
                ? "success"
                : statusInfo.color === "yellow"
                ? "warning"
                : "default"
            }
          >
            {match.status.replace("-", " ").toUpperCase()}
          </Badge>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "schedule"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>Schedule Management</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("scoreKeepers")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "scoreKeepers"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users size={16} />
                <span>Score Keepers ({scoreKeepers.length})</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            {/* Schedule Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Scheduled Time
                </h4>
                <p className="text-gray-600">
                  {match.startTime
                    ? new Date(match.startTime).toLocaleString()
                    : "Not scheduled"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Actual Start</h4>
                <p className="text-gray-600">
                  {match.actualStartTime
                    ? new Date(match.actualStartTime).toLocaleString()
                    : "Not started"}
                </p>
              </div>
            </div>

            {/* Court Information */}
            {match.court && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Court</h4>
                <p className="text-gray-600">{match.court.name}</p>
                {match.court.location && (
                  <p className="text-sm text-gray-500">
                    Location: {match.court.location}
                  </p>
                )}
              </div>
            )}

            {/* Start Early Option */}
            <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle size={20} className="text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-orange-900 mb-2">
                    Start Match Early
                  </h4>
                  <p className="text-sm text-orange-700 mb-4">
                    {canStartEarly()
                      ? "You can start this match before its scheduled time if both players are ready."
                      : match.actualStartTime
                      ? "This match has already been started."
                      : !match.canStartEarly
                      ? "This match is not eligible to start early."
                      : "This match cannot be started early at this time."}
                  </p>
                  <Button
                    onClick={handleStartEarly}
                    disabled={!canStartEarly() || startingEarly}
                    variant={canStartEarly() ? "primary" : "secondary"}
                    className="flex items-center space-x-2"
                  >
                    <Play size={16} />
                    <span>
                      {startingEarly ? "Starting..." : "Start Match Now"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "scoreKeepers" && (
          <div className="space-y-6">
            {/* Add Score Keeper */}
            <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-3">
                Add Authorized Score Keeper
              </h4>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Search by email address..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchUsers()}
                    className="flex-1"
                  />
                  <Button
                    onClick={searchUsers}
                    disabled={!searchEmail.trim() || searchLoading}
                    variant="secondary"
                  >
                    {searchLoading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <div className="flex items-center space-x-2">
                          <Mail size={16} className="text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAddScoreKeeper(user.id)}
                          disabled={isAlreadyScoreKeeper(user.id)}
                          size="sm"
                          variant={
                            isAlreadyScoreKeeper(user.id)
                              ? "secondary"
                              : "primary"
                          }
                        >
                          {isAlreadyScoreKeeper(user.id) ? (
                            <div className="flex items-center space-x-1">
                              <Check size={14} />
                              <span>Added</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <UserPlus size={14} />
                              <span>Add</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Current Score Keepers */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Authorized Score Keepers
              </h4>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading...</p>
                </div>
              ) : scoreKeepers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>No authorized score keepers yet</p>
                  <p className="text-sm">
                    Add users who can update scores for this match
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {scoreKeepers.map((keeper) => (
                    <motion.div
                      key={keeper.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Users size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {keeper.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {keeper.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleRemoveScoreKeeper(keeper.id)}
                        size="sm"
                        variant="danger"
                        className="flex items-center space-x-1"
                      >
                        <UserMinus size={14} />
                        <span>Remove</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Score Keeper Permissions Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">
                Score Keeper Permissions
              </h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Can update match scores in real-time</li>
                <li>• Can change match status (start, pause, complete)</li>
                <li>• Cannot modify match schedule or other settings</li>
                <li>• Permissions are match-specific</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
