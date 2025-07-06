import React, { useState } from "react";
import { Crown, User, Users } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Tournament, User as UserType } from "../../types";
import { Avatar } from "../ui/Avatar";

interface SetWinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: Tournament;
  participants: Array<{ id: string; user: UserType }>;
  onSetWinner: (winnerData: {
    winnerId?: string;
    winnerName?: string;
    winnerPartner?: string;
  }) => Promise<void>;
  loading?: boolean;
}

export const SetWinnerModal: React.FC<SetWinnerModalProps> = ({
  isOpen,
  onClose,
  tournament,
  participants,
  onSetWinner,
  loading = false,
}) => {
  const [selectedWinnerId, setSelectedWinnerId] = useState<string>("");
  const [customWinnerName, setCustomWinnerName] = useState("");
  const [winnerPartner, setWinnerPartner] = useState("");
  const [useCustomName, setUseCustomName] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const winnerData: {
      winnerId?: string;
      winnerName?: string;
      winnerPartner?: string;
    } = {};

    if (useCustomName) {
      if (!customWinnerName.trim()) {
        alert("Please enter a winner name");
        return;
      }
      winnerData.winnerName = customWinnerName.trim();
    } else {
      if (!selectedWinnerId) {
        alert("Please select a winner");
        return;
      }
      winnerData.winnerId = selectedWinnerId;
      const selectedParticipant = participants.find(
        (p) => p.user.id === selectedWinnerId
      );
      winnerData.winnerName = selectedParticipant?.user.name;
    }

    if (tournament.type !== "singles" && winnerPartner.trim()) {
      winnerData.winnerPartner = winnerPartner.trim();
    }

    try {
      await onSetWinner(winnerData);
      onClose();
      // Reset form
      setSelectedWinnerId("");
      setCustomWinnerName("");
      setWinnerPartner("");
      setUseCustomName(false);
    } catch (error) {
      console.error("Failed to set winner:", error);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setSelectedWinnerId("");
    setCustomWinnerName("");
    setWinnerPartner("");
    setUseCustomName(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Set Tournament Winner"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
          <Crown className="w-5 h-5" />
          <span className="font-medium">
            Set the winner for "{tournament.name}"
          </span>
        </div>

        {/* Winner Selection Method */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Winner Selection</h3>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="winnerMethod"
                checked={!useCustomName}
                onChange={() => setUseCustomName(false)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                Select from participants
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="winnerMethod"
                checked={useCustomName}
                onChange={() => setUseCustomName(true)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                Enter custom name
              </span>
            </label>
          </div>
        </div>

        {/* Participant Selection */}
        {!useCustomName && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Select Winner from Participants
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {participants.map((participant) => (
                <div
                  key={participant.user.id}
                  className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                    selectedWinnerId === participant.user.id
                      ? "bg-green-50 border-green-200"
                      : ""
                  }`}
                  onClick={() => setSelectedWinnerId(participant.user.id)}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="winner"
                      value={participant.user.id}
                      checked={selectedWinnerId === participant.user.id}
                      onChange={() => setSelectedWinnerId(participant.user.id)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <Avatar
                      src={participant.user.profileImage}
                      name={participant.user.name}
                      size="sm"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {participant.user.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Rating: {participant.user.rating?.toFixed(1) || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Winner Name */}
        {useCustomName && (
          <Input
            label="Winner Name"
            icon={User}
            value={customWinnerName}
            onChange={(e) => setCustomWinnerName(e.target.value)}
            placeholder="Enter winner's name"
            required
          />
        )}

        {/* Partner Name for Doubles/Mixed */}
        {tournament.type !== "singles" && (
          <Input
            label={`Partner Name ${
              tournament.type === "doubles" ? "(Doubles)" : "(Mixed Doubles)"
            }`}
            icon={Users}
            value={winnerPartner}
            onChange={(e) => setWinnerPartner(e.target.value)}
            placeholder="Enter partner's name (optional)"
          />
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={Crown}
          >
            Set Winner
          </Button>
        </div>
      </form>
    </Modal>
  );
};
