import {
  AlertTriangle,
  BarChart3,
  Bell,
  Download,
  Lock,
  Mail,
  MapPin,
  Save,
  Settings,
  Shield,
  Star,
  Target,
  Trash2,
  Trophy,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { ProfilePictureUpload } from "../components/ui/ProfilePictureUpload";
import { useAuthStore } from "../store/authStore";
import { userAPI } from "../services/api";
import { User as UserType } from "../types";

// Validation schemas
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  // email is not editable for security reasons
  location: z.string().optional(),
  bio: z.string().optional(),
  playingLevel: z.string(),
  preferredHand: z.string(),
  yearsPlaying: z.string(),
  favoriteShot: z.string(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export const Profile: React.FC = () => {
  const { user, updateUser, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profilePictureLoading, setProfilePictureLoading] = useState(false);

  // Profile form with react-hook-form
  const { control, handleSubmit, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      location: "",
      bio: "",
      playingLevel: "3.5",
      preferredHand: "right",
      yearsPlaying: "2",
      favoriteShot: "dink",
    },
  });

  // Password form
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        location: user.location || "",
        bio: user.bio || "",
        playingLevel: user.rating?.toString() || "3.5",
        preferredHand: user.preferredHand || "right",
        yearsPlaying: user.yearsPlaying || "2",
        favoriteShot: user.favoriteShot || "dink",
      });
    }
  }, [user, reset]);

  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    matchReminders: true,
    tournamentUpdates: true,
    scoreUpdates: true,
    weeklyDigest: false,

    // Privacy
    profileVisibility: "public",
    showRating: true,
    showStats: true,
    showLocation: false,
    allowMessages: true,

    // Preferences
    theme: "light",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12h",

    // Game Settings
    defaultTournamentType: "singles",
    autoJoinWaitlist: false,
    preferredCourtSurface: "outdoor",
    availableDays: ["monday", "wednesday", "friday", "saturday"],
    preferredTimeSlots: ["morning", "evening"],
  });

  // Stats data (mock)
  const playerStats = {
    totalGames: 45,
    wins: 32,
    losses: 13,
    winRate: 71,
    currentRating: user?.rating || 4.2,
    bestRating: 4.5,
    tournamentsPlayed: 8,
    tournamentsWon: 2,
    currentStreak: 5,
    longestStreak: 8,
    averageGameDuration: 42,
    favoriteOpponent: "Sarah Wilson",
    recentForm: [true, true, false, true, true], // W/L for last 5 games
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "stats", label: "Statistics", icon: BarChart3 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "game-settings", label: "Game Settings", icon: Trophy },
    { id: "account", label: "Account", icon: Lock },
  ];

  // Initialize settings from user data (only once)
  useEffect(() => {
    if (user) {
      setSettings((prev) => ({
        ...prev,
        emailNotifications:
          user.notificationSettings?.emailNotifications ??
          prev.emailNotifications,
        pushNotifications:
          user.notificationSettings?.pushNotifications ??
          prev.pushNotifications,
        matchReminders:
          user.notificationSettings?.matchReminders ?? prev.matchReminders,
        tournamentUpdates:
          user.notificationSettings?.tournamentUpdates ??
          prev.tournamentUpdates,
        scoreUpdates:
          user.notificationSettings?.scoreUpdates ?? prev.scoreUpdates,
        weeklyDigest:
          user.notificationSettings?.weeklyDigest ?? prev.weeklyDigest,

        profileVisibility:
          user.privacySettings?.profileVisibility ?? prev.profileVisibility,
        showRating: user.privacySettings?.showRating ?? prev.showRating,
        showStats: user.privacySettings?.showStats ?? prev.showStats,
        showLocation: user.privacySettings?.showLocation ?? prev.showLocation,
        allowMessages:
          user.privacySettings?.allowMessages ?? prev.allowMessages,

        theme: user.preferences?.theme ?? prev.theme,
        language: user.preferences?.language ?? prev.language,
        timezone: user.preferences?.timezone ?? prev.timezone,
        dateFormat: user.preferences?.dateFormat ?? prev.dateFormat,
        timeFormat: user.preferences?.timeFormat ?? prev.timeFormat,

        defaultTournamentType:
          user.gameSettings?.defaultTournamentType ??
          prev.defaultTournamentType,
        autoJoinWaitlist:
          user.gameSettings?.autoJoinWaitlist ?? prev.autoJoinWaitlist,
        preferredCourtSurface:
          user.gameSettings?.preferredCourtSurface ??
          prev.preferredCourtSurface,
        availableDays: user.gameSettings?.availableDays ?? prev.availableDays,
        preferredTimeSlots:
          user.gameSettings?.preferredTimeSlots ?? prev.preferredTimeSlots,
      }));
    }
  }, [user]);

  const onSubmitProfile = async (data: ProfileFormData) => {
    setLoading(true);

    try {
      if (!user?.id) {
        toast.error("User not found");
        return;
      }

      // Prepare data for API (email is not updatable)
      const updateData: Partial<UserType> = {
        name: data.name.trim(),
        location: data.location?.trim() || undefined,
        bio: data.bio?.trim() || undefined,
        rating: parseFloat(data.playingLevel),
        preferredHand: data.preferredHand as "left" | "right" | "ambidextrous",
        yearsPlaying: data.yearsPlaying,
        favoriteShot: data.favoriteShot,
        profileImage: user.profileImage, // Preserve the current profile image
      };

      // Use the userAPI
      const response = await userAPI.updateProfile(user.id, updateData);

      updateUser(response.data);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/users/${user?.id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        throw new Error(errorData.message || "Failed to change password");
      }

      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      resetPassword();
    } catch (error: unknown) {
      console.error("Password change error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Account deletion request submitted");
      setShowDeleteModal(false);
    } catch {
      toast.error("Failed to delete account");
    }
  };

  const handleExportData = () => {
    // Get current form data
    const currentFormData = {
      name: user?.name || "",
      email: user?.email || "",
      location: user?.location || "",
      bio: user?.bio || "",
      // Add other fields as needed
    };

    const data = {
      profile: currentFormData,
      stats: playerStats,
      settings: settings,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pickleball-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  const handleProfilePictureUpload = async (file: File) => {
    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    setProfilePictureLoading(true);
    try {
      const response = await userAPI.uploadProfilePicture(user.id, file);

      // Update the user in the auth store
      const updatedUser = { ...user, profileImage: response.data.profileImage };
      updateUser(updatedUser);

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Profile picture upload error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload profile picture";
      toast.error(errorMessage);
    } finally {
      setProfilePictureLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const settingsData = {
        notificationSettings: {
          emailNotifications: settings.emailNotifications,
          pushNotifications: settings.pushNotifications,
          matchReminders: settings.matchReminders,
          tournamentUpdates: settings.tournamentUpdates,
          scoreUpdates: settings.scoreUpdates,
          weeklyDigest: settings.weeklyDigest,
        },
        privacySettings: {
          profileVisibility: settings.profileVisibility,
          showRating: settings.showRating,
          showStats: settings.showStats,
          showLocation: settings.showLocation,
          allowMessages: settings.allowMessages,
        },
        preferences: {
          theme: settings.theme,
          language: settings.language,
          timezone: settings.timezone,
          dateFormat: settings.dateFormat,
          timeFormat: settings.timeFormat,
        },
        gameSettings: {
          defaultTournamentType: settings.defaultTournamentType,
          autoJoinWaitlist: settings.autoJoinWaitlist,
          preferredCourtSurface: settings.preferredCourtSurface,
          availableDays: settings.availableDays,
          preferredTimeSlots: settings.preferredTimeSlots,
        },
      };

      const response = await fetch(`/api/users/${user?.id}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsData),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        throw new Error(errorData.message || "Failed to update settings");
      }

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      updateUser(result.user);
      toast.success("Settings updated successfully!");
    } catch (error: unknown) {
      console.error("Settings update error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update settings";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Optimized change handlers to prevent unnecessary re-renders
  const ProfileTab = () => (
    <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Personal Information</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6 mb-6">
            <ProfilePictureUpload
              currentImage={user?.profileImage}
              userName={user?.name}
              onImageUpload={handleProfilePictureUpload}
              loading={profilePictureLoading}
              className="flex-shrink-0"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 capitalize">{user?.role}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="success" size="sm">
                  <Star className="w-3 h-3 mr-1" />
                  {user?.rating?.toFixed(1)} Rating
                </Badge>
                <Badge variant="info" size="sm">
                  {playerStats.totalGames} Games
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Full Name"
                  icon={User}
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />
            {/* Email is read-only for security */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">
                Email cannot be changed for security reasons
              </p>
            </div>
            <Controller
              name="location"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  label="Location"
                  icon={MapPin}
                  {...field}
                  placeholder="City, State"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="playingLevel"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Playing Level
                  </label>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="2.0">2.0 - Beginner</option>
                    <option value="2.5">2.5 - Novice</option>
                    <option value="3.0">3.0 - Intermediate</option>
                    <option value="3.5">3.5 - Intermediate+</option>
                    <option value="4.0">4.0 - Advanced</option>
                    <option value="4.5">4.5 - Advanced+</option>
                    <option value="5.0">5.0 - Expert</option>
                  </select>
                </div>
              )}
            />
          </div>

          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  {...field}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Tell us about your pickleball journey..."
                />
              </div>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Controller
              name="preferredHand"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Hand
                  </label>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                    <option value="ambidextrous">Ambidextrous</option>
                  </select>
                </div>
              )}
            />
            <Controller
              name="yearsPlaying"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years Playing
                  </label>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="<1">Less than 1 year</option>
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="4">4 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
              )}
            />
            <Controller
              name="favoriteShot"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Favorite Shot
                  </label>
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="dink">Dink</option>
                    <option value="drive">Drive</option>
                    <option value="lob">Lob</option>
                    <option value="drop">Drop Shot</option>
                    <option value="smash">Smash</option>
                    <option value="serve">Serve</option>
                  </select>
                </div>
              )}
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" variant="primary" loading={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );

  const StatsTab = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Performance Overview</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {playerStats.wins}
              </div>
              <div className="text-sm text-gray-600">Wins</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Target className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {playerStats.losses}
              </div>
              <div className="text-sm text-gray-600">Losses</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {playerStats.winRate}%
              </div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {playerStats.currentRating}
              </div>
              <div className="text-sm text-gray-600">Current Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Game Statistics</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Games</span>
                <span className="font-medium">{playerStats.totalGames}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Streak</span>
                <span className="font-medium text-green-600">
                  {playerStats.currentStreak} wins
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Longest Streak</span>
                <span className="font-medium">
                  {playerStats.longestStreak} wins
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Game Duration</span>
                <span className="font-medium">
                  {playerStats.averageGameDuration} min
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Best Rating</span>
                <span className="font-medium">{playerStats.bestRating}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Tournament History</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tournaments Played</span>
                <span className="font-medium">
                  {playerStats.tournamentsPlayed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tournaments Won</span>
                <span className="font-medium text-green-600">
                  {playerStats.tournamentsWon}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tournament Win Rate</span>
                <span className="font-medium">
                  {Math.round(
                    (playerStats.tournamentsWon /
                      playerStats.tournamentsPlayed) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Favorite Opponent</span>
                <span className="font-medium">
                  {playerStats.favoriteOpponent}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Form (Last 5 Games)</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {playerStats.recentForm.map((win, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  win ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {win ? "W" : "L"}
              </div>
            ))}
            <span className="ml-4 text-sm text-gray-600">
              {playerStats.recentForm.filter(Boolean).length} wins in last 5
              games
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Email Notifications</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                key: "emailNotifications",
                label: "Email Notifications",
                desc: "Receive notifications via email",
              },
              {
                key: "matchReminders",
                label: "Match Reminders",
                desc: "Get reminded about upcoming matches",
              },
              {
                key: "tournamentUpdates",
                label: "Tournament Updates",
                desc: "Updates about tournament changes",
              },
              {
                key: "scoreUpdates",
                label: "Score Updates",
                desc: "Live score updates during matches",
              },
              {
                key: "weeklyDigest",
                label: "Weekly Digest",
                desc: "Weekly summary of your activity",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      settings[item.key as keyof typeof settings] as boolean
                    }
                    onChange={(e) =>
                      setSettings({ ...settings, [item.key]: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Push Notifications</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                Push Notifications
              </div>
              <div className="text-sm text-gray-600">
                Receive push notifications on your device
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pushNotifications: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSaveSettings}
          loading={loading}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Notification Settings
        </Button>
      </div>
    </div>
  );

  const PrivacyTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Profile Visibility</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Who can see your profile?
              </label>
              <select
                value={settings.profileVisibility}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profileVisibility: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="public">Everyone</option>
                <option value="players">Players Only</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            {[
              {
                key: "showRating",
                label: "Show Rating",
                desc: "Display your skill rating on your profile",
              },
              {
                key: "showStats",
                label: "Show Statistics",
                desc: "Display your game statistics",
              },
              {
                key: "showLocation",
                label: "Show Location",
                desc: "Display your location information",
              },
              {
                key: "allowMessages",
                label: "Allow Messages",
                desc: "Allow other players to message you",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      settings[item.key as keyof typeof settings] as boolean
                    }
                    onChange={(e) =>
                      setSettings({ ...settings, [item.key]: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSaveSettings}
          loading={loading}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Privacy Settings
        </Button>
      </div>
    </div>
  );

  const PreferencesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Display Preferences</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) =>
                  setSettings({ ...settings, theme: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) =>
                  setSettings({ ...settings, language: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) =>
                  setSettings({ ...settings, timezone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) =>
                  setSettings({ ...settings, dateFormat: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                <option value="yyyy-MM-dd">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSaveSettings}
          loading={loading}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );

  const GameSettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Game Preferences</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Tournament Type
              </label>
              <select
                value={settings.defaultTournamentType}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultTournamentType: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="singles">Singles</option>
                <option value="doubles">Doubles</option>
                <option value="mixed">Mixed Doubles</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Court Surface
              </label>
              <select
                value={settings.preferredCourtSurface}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferredCourtSurface: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="outdoor">Outdoor</option>
                <option value="indoor">Indoor</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">
                  Auto-join Waitlist
                </div>
                <div className="text-sm text-gray-600">
                  Automatically join tournament waitlists when full
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoJoinWaitlist}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoJoinWaitlist: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Availability</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Days
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ].map((day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.availableDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSettings({
                            ...settings,
                            availableDays: [...settings.availableDays, day],
                          });
                        } else {
                          setSettings({
                            ...settings,
                            availableDays: settings.availableDays.filter(
                              (d) => d !== day
                            ),
                          });
                        }
                      }}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {day.slice(0, 3)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time Slots
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["morning", "afternoon", "evening"].map((time) => (
                  <label key={time} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.preferredTimeSlots.includes(time)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSettings({
                            ...settings,
                            preferredTimeSlots: [
                              ...settings.preferredTimeSlots,
                              time,
                            ],
                          });
                        } else {
                          setSettings({
                            ...settings,
                            preferredTimeSlots:
                              settings.preferredTimeSlots.filter(
                                (t) => t !== time
                              ),
                          });
                        }
                      }}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {time}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSaveSettings}
          loading={loading}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Game Settings
        </Button>
      </div>
    </div>
  );

  const AccountTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Security</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowPasswordModal(true)}
              icon={Lock}
            >
              Change Password
            </Button>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Add an extra layer of security to your account
              </p>
              <Button variant="secondary" size="sm">
                Enable 2FA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Data Management</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={handleExportData}
              icon={Download}
            >
              Export My Data
            </Button>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
              <p className="text-sm text-gray-600 mb-3">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
                icon={Trash2}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "stats":
        return <StatsTab />;
      case "notifications":
        return <NotificationsTab />;
      case "privacy":
        return <PrivacyTab />;
      case "preferences":
        return <PreferencesTab />;
      case "game-settings":
        return <GameSettingsTab />;
      case "account":
        return <AccountTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-green-100 text-green-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">{renderTabContent()}</div>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        size="md"
      >
        <form
          onSubmit={handlePasswordSubmit(onSubmitPassword)}
          className="space-y-4"
        >
          <Controller
            name="currentPassword"
            control={passwordControl}
            render={({ field, fieldState }) => (
              <Input
                label="Current Password"
                type="password"
                icon={Lock}
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="newPassword"
            control={passwordControl}
            render={({ field, fieldState }) => (
              <Input
                label="New Password"
                type="password"
                icon={Lock}
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={passwordControl}
            render={({ field, fieldState }) => (
              <Input
                label="Confirm New Password"
                type="password"
                icon={Lock}
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Change Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h4 className="font-medium text-red-800">
                This action cannot be undone
              </h4>
              <p className="text-sm text-red-600">
                This will permanently delete your account and all associated
                data.
              </p>
            </div>
          </div>

          <p className="text-gray-600">
            Are you sure you want to delete your account? All your tournaments,
            matches, and statistics will be permanently removed.
          </p>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
