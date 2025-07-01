import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useTournamentStore } from "../store/tournamentStore";
import { tournamentAPI } from "../services/api";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { TournamentCard } from "../components/tournaments/TournamentCard";
import { MatchCard } from "../components/matches/MatchCard";
import { Link } from "react-router-dom";
import { Tournament, Match } from "../types";

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { tournaments, matches, setTournaments, setMatches } =
    useTournamentStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTournaments: 0,
    upcomingMatches: 0,
    totalPlayers: 0,
    winRate: 0,
  });

  const loadDashboardData = useCallback(async () => {
    try {
      const [tournamentsResponse, matchesResponse] = await Promise.all([
        tournamentAPI.getAll(),
        // For now, we'll use a mock endpoint for matches
        Promise.resolve({ data: [] }),
      ]);

      // Ensure data is arrays
      const tournamentsData = Array.isArray(tournamentsResponse.data)
        ? tournamentsResponse.data
        : [];
      const matchesData = Array.isArray(matchesResponse.data)
        ? matchesResponse.data
        : [];

      setTournaments(tournamentsData);
      setMatches(matchesData);

      // Calculate stats
      setStats({
        totalTournaments: tournamentsData.length,
        upcomingMatches: matchesData.filter(
          (m: Match) => m.status === "scheduled"
        ).length,
        totalPlayers: tournamentsData.reduce(
          (acc: number, t: Tournament) => acc + (t.currentParticipants || 0),
          0
        ),
        winRate: 75, // Mock data
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Set empty arrays on error
      setTournaments([]);
      setMatches([]);
      setStats({
        totalTournaments: 0,
        upcomingMatches: 0,
        totalPlayers: 0,
        winRate: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [setTournaments, setMatches]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleJoinTournament = async (tournamentId: string) => {
    try {
      await tournamentAPI.join(tournamentId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error joining tournament:", error);
    }
  };

  interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: number;
    color: string;
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color,
  }: StatCardProps) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+{trend}%</span>
              </div>
            )}
          </div>
          <div
            className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-green-100 mb-4">
          Ready to dominate the court? Check out your latest tournaments and
          matches.
        </p>
        <div className="flex items-center space-x-2">
          <Badge variant="success" className="bg-white/20 text-white">
            {user?.role.toUpperCase()}
          </Badge>
          {user?.rating && (
            <Badge variant="info" className="bg-white/20 text-white">
              Rating: {user.rating}
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tournaments"
          value={stats.totalTournaments}
          icon={Trophy}
          trend={12}
          color="bg-green-500"
        />
        <StatCard
          title="Upcoming Matches"
          value={stats.upcomingMatches}
          icon={Calendar}
          trend={8}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Players"
          value={stats.totalPlayers}
          icon={Users}
          trend={15}
          color="bg-purple-500"
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate}%`}
          icon={TrendingUp}
          trend={5}
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      {user?.role === "organizer" && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link to="/tournaments/create">
                <Button variant="primary" icon={Plus}>
                  Create Tournament
                </Button>
              </Link>
              <Link to="/matches/schedule">
                <Button variant="secondary" icon={Calendar}>
                  Schedule Match
                </Button>
              </Link>
              <Link to="/players">
                <Button variant="outline" icon={Users}>
                  Manage Players
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Tournaments */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Recent Tournaments
          </h2>
          <Link to="/tournaments">
            <Button variant="ghost" icon={ArrowRight}>
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(tournaments) &&
            tournaments
              .slice(0, 3)
              .map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onJoin={handleJoinTournament}
                  onView={(id) => (window.location.href = `/tournaments/${id}`)}
                  canJoin={user?.role === "player"}
                />
              ))}
        </div>
      </div>

      {/* Upcoming Matches */}
      {matches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Matches
            </h2>
            <Link to="/matches">
              <Button variant="ghost" icon={ArrowRight}>
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches
              .filter((match) => match.status === "scheduled")
              .slice(0, 4)
              .map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  canUpdateScore={user?.role === "organizer"}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
