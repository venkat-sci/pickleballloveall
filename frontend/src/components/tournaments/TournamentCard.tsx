import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  DollarSign,
  Crown,
  Star,
} from "lucide-react";
import { Tournament } from "../../types";
import { Card, CardContent, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";

interface TournamentCardProps {
  tournament: Tournament;
  onJoin?: (tournamentId: string) => void;
  onView: (tournamentId: string) => void;
  canJoin?: boolean;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onJoin,
  onView,
  canJoin = false,
}) => {
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on a button
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    onView(tournament.id);
  };

  const handleViewClick = () => {
    onView(tournament.id);
  };

  const handleJoinClick = () => {
    if (onJoin) {
      onJoin(tournament.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <div className="h-full cursor-pointer" onClick={handleCardClick}>
        <Card
          hover
          className="h-full flex flex-col transition-shadow duration-200 hover:shadow-lg"
        >
          <CardContent className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {tournament.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {tournament.description}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <Badge
                  variant={getStatusVariant(tournament.status || "upcoming")}
                  size="sm"
                >
                  {tournament.status
                    ? tournament.status.charAt(0).toUpperCase() +
                      tournament.status.slice(1)
                    : "Upcoming"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {format(new Date(tournament.startDate), "MMM dd, yyyy")} -{" "}
                  {format(new Date(tournament.endDate), "MMM dd, yyyy")}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{tournament.location}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>
                  {tournament.currentParticipants}/{tournament.maxParticipants}{" "}
                  players
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Trophy className="w-4 h-4 mr-2" />
                <span className="capitalize">
                  {tournament.type} • {tournament.format}
                </span>
              </div>

              {tournament.entryFee && (
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Entry Fee: ${tournament.entryFee}</span>
                </div>
              )}

              {tournament.prizePool && (
                <div className="flex items-center text-sm font-semibold text-green-600">
                  <Trophy className="w-4 h-4 mr-2" />
                  <span>Prize Pool: ${tournament.prizePool}</span>
                </div>
              )}
            </div>

            {/* Winner Display for Completed Tournaments */}
            {tournament.status === "completed" &&
              (tournament.winnerName || tournament.winner) && (
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Crown className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-semibold text-yellow-800">
                          🏆 Tournament Champion
                        </h4>
                        <Star className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {tournament.winner?.profileImage && (
                          <Avatar
                            src={tournament.winner.profileImage}
                            name={
                              tournament.winnerName || tournament.winner.name
                            }
                            size="sm"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-yellow-900">
                            {tournament.winnerName || tournament.winner?.name}
                            {tournament.winnerPartner && (
                              <span className="text-yellow-700">
                                {" & "}
                                {tournament.winnerPartner}
                              </span>
                            )}
                          </p>
                          {tournament.type !== "singles" &&
                            tournament.winnerPartner && (
                              <p className="text-xs text-yellow-700">
                                {tournament.type === "doubles"
                                  ? "Doubles"
                                  : "Mixed Doubles"}{" "}
                                Champions
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (tournament.currentParticipants /
                      tournament.maxParticipants) *
                    100
                  }%`,
                }}
              />
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewClick}
              className="flex-1"
            >
              View Details
            </Button>
            {canJoin &&
              tournament.status === "upcoming" &&
              (tournament.currentParticipants || 0) <
                tournament.maxParticipants &&
              onJoin && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleJoinClick}
                  className="flex-1"
                >
                  Join Tournament
                </Button>
              )}
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};
