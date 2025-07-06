import React from "react";
import { User } from "lucide-react";
import { config } from "../../config/environment";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = "",
  size = "md",
  className = "",
}) => {
  // Generate a consistent color based on the user's name
  const getAvatarColor = (name: string = "") => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];

    // Create a simple hash from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use the hash to pick a color consistently
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  // Get the first letter of the name
  const getInitial = (name: string = "") => {
    return name.charAt(0).toUpperCase() || "U";
  };

  // Construct full URL for the image
  const getImageUrl = (imageUrl?: string | null) => {
    if (!imageUrl) return null;

    // If it's already a full URL (starts with http), return as is
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // If it's a relative URL, prepend the backend URL
    const baseUrl = config.apiUrl; // Backend URL without /api suffix
    return `${baseUrl}${imageUrl}`;
  };

  // Size configurations
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
    xl: "text-2xl",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const imageUrl = getImageUrl(src);
  const avatarColor = getAvatarColor(name);
  const initial = getInitial(name);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 ${className}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name || "User"}
          className="w-full h-full object-cover"
        />
      ) : name ? (
        // Show avatar with first letter and random color
        <div
          className={`w-full h-full ${avatarColor} flex items-center justify-center`}
        >
          <span className={`text-white font-bold ${textSizeClasses[size]}`}>
            {initial}
          </span>
        </div>
      ) : (
        // Default placeholder
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <User className={`text-gray-400 ${iconSizeClasses[size]}`} />
        </div>
      )}
    </div>
  );
};
