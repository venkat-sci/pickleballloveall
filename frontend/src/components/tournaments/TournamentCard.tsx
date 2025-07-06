import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Trophy, DollarSign } from "lucide-react";
import { Tournament } from "../../types";
import { Card, CardContent, CardFooter } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

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
