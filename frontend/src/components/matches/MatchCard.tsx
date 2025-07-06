import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Clock, MapPin, Trophy, Play, CheckCircle } from "lucide-react";
import { Match } from "../../types";
import { Avatar } from "../ui/Avatar";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface MatchCardProps {
  match: Match;
  onUpdateScore?: (matchId: string) => void;
  onViewDetails?: (matchId: string) => void;
  canUpdateScore?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onUpdateScore,
  onViewDetails,
  canUpdateScore = false,
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "info";
      case "in-progress":
        return "warning";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return Clock;
      case "in-progress":
        return Play;
      case "completed":
        return CheckCircle;
      default:
        return Clock;
    }
  };

  const StatusIcon = getStatusIcon(match.status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Badge
              variant={getStatusVariant(match.status)}
              size="sm"
              className="flex items-center gap-1"
            >
              <StatusIcon className="w-3 h-3" />
              {match.status.replace("-", " ").toUpperCase()}
            </Badge>
            <span className="text-sm text-gray-500">Round {match.round}</span>
          </div>

          <div className="space-y-4">
            {/* Players */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={match.player1?.profileImage}
                    name={match.player1?.name}
                    size="sm"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {match.player1?.name || "Player 1"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Rating: {match.player1?.rating || "N/A"}
                    </p>
                  </div>
                </div>
                {match.score && (
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">
                      {match.score.player1.join("-")}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <span className="text-gray-400 font-medium">VS</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={match.player2?.profileImage}
                    name={match.player2?.name}
                    size="sm"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {match.player2?.name || "Player 2"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Rating: {match.player2?.rating || "N/A"}
                    </p>
                  </div>
                </div>
                {match.score && (
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">
                      {match.score.player2.join("-")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Match Details */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {match.startTime
                    ? format(new Date(match.startTime), "MMM dd, HH:mm")
                    : "TBD"}
                </div>
                {match.court && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {match.court.name}
                  </div>
                )}
              </div>
              {match.winner && (
                <div className="flex items-center text-green-600">
                  <Trophy className="w-4 h-4 mr-1" />
                  <span className="font-medium">
                    {match.winner === match.player1?.id
                      ? match.player1?.name || "Player 1"
                      : match.player2?.name || "Player 2"}{" "}
                    wins
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-gray-200 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails?.(match.id)}
                className="w-full"
              >
                View Details
              </Button>
              {canUpdateScore &&
                match.status !== "completed" &&
                onUpdateScore && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onUpdateScore(match.id)}
                    className="w-full"
                  >
                    {match.status === "scheduled"
                      ? "Start Match"
                      : "Update Score"}
                  </Button>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
