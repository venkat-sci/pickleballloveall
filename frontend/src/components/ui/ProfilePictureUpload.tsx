import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { config } from "../../config/environment";
import toast from "react-hot-toast";

interface ProfilePictureUploadProps {
  currentImage?: string;
  userName?: string;
  onImageUpload: (file: File) => Promise<void>;
  loading?: boolean;
  className?: string;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImage,
  userName,
  onImageUpload,
  loading = false,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Clear preview when currentImage changes (after successful upload)
  useEffect(() => {
    if (currentImage && preview) {
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [currentImage, preview]);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    onImageUpload(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Construct full URL for the image
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return null;

    // If it's already a full URL (starts with http), return as is
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // If it's a relative URL, prepend the backend URL
    const baseUrl = config.apiUrl.replace("/api", ""); // Remove /api from the end
    return `${baseUrl}${imageUrl}`;
  };

  const imageUrl = preview || getImageUrl(currentImage);

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Profile picture display/upload area */}
      <div
        className={`relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer group transition-all duration-200 ${
          dragOver ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Background image or avatar */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <Avatar
            src={null}
            name={userName}
            size="xl"
            className="w-full h-full"
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Clear preview button */}
        {preview && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearPreview();
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload button */}
      <div className="text-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="text-sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          {imageUrl ? "Change Photo" : "Upload Photo"}
        </Button>
      </div>

      {/* Instructions */}
      <p className="text-xs text-gray-500 text-center mt-2">
        Drag & drop or click to upload
        <br />
        JPG, PNG up to 5MB
      </p>
    </div>
  );
};
