import React, { useState, useEffect } from "react";
import { Save, Loader } from "lucide-react";
import { Tournament } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import toast from "react-hot-toast";

interface EditTournamentModalProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTournament: Partial<Tournament>) => Promise<void>;
}

const DEFAULT_RULES = `## Tournament Rules

### General Rules
1. All matches must be played according to official pickleball rules
2. Players must arrive 15 minutes before their scheduled match time
3. Late arrivals may result in forfeit (grace period of 10 minutes)
4. All equipment must meet tournament standards

### Scoring
- Games played to 11 points, win by 2
- Best of 3 games format
- Rally scoring system

### Conduct
- Good sportsmanship is expected at all times
- Disputes should be resolved respectfully
- Tournament director's decisions are final

### Equipment
- Approved paddles only
- Tournament-provided balls will be used
- Appropriate court shoes required

### Weather Policy
- Tournament may be postponed due to severe weather
- Indoor alternatives will be provided when possible

Contact the organizer for any rule clarifications.`;

export const EditTournamentModal: React.FC<EditTournamentModalProps> = ({
  tournament,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    maxParticipants: 0,
    entryFee: 0,
    prizePool: 0,
    rules: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name || "",
        description: tournament.description || "",
        location: tournament.location || "",
        maxParticipants: tournament.maxParticipants || 0,
        entryFee: tournament.entryFee || 0,
        prizePool: tournament.prizePool || 0,
        rules: tournament.rules || DEFAULT_RULES,
      });
    }
  }, [tournament]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      toast.success("Tournament updated successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to update tournament:", err);
      toast.error("Failed to update tournament");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Tournament">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tournament Name
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter tournament name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Enter location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Participants
            </label>
            <Input
              name="maxParticipants"
              type="number"
              value={formData.maxParticipants}
              onChange={handleChange}
              required
              min="2"
              placeholder="Enter max participants"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entry Fee ($)
            </label>
            <Input
              name="entryFee"
              type="number"
              step="0.01"
              value={formData.entryFee}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prize Pool ($)
            </label>
            <Input
              name="prizePool"
              type="number"
              step="0.01"
              value={formData.prizePool}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter tournament description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tournament Rules
          </label>
          <textarea
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
            placeholder="Enter tournament rules (Markdown supported)"
          />
          <p className="text-xs text-gray-500 mt-1">
            You can use Markdown formatting for better readability
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex items-center space-x-2"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{loading ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
