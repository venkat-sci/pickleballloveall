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
    category: "men",
    type: "singles",
    format: "round-robin",
    numGroups: 1,
    knockoutEnabled: false,
    advanceCount: 1,
  });
  const [groupPreview, setGroupPreview] = useState<
    Array<{ name: string; players: string[] }>
  >([]);
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
        category: tournament.category || "men",
        type: tournament.type || "singles",
        format: tournament.format || "round-robin",
        numGroups: tournament.numGroups || 1,
        knockoutEnabled: tournament.knockoutEnabled || false,
        advanceCount: tournament.advanceCount || 1,
      });
    }
  }, [tournament]);

  // Live preview of group distribution
  useEffect(() => {
    const totalPlayers = formData.maxParticipants || 0;
    const numGroups = formData.numGroups || 1;
    if (numGroups < 1 || totalPlayers < 1) {
      setGroupPreview([]);
      return;
    }
    // Generate mock player names for preview
    const players = Array.from(
      { length: totalPlayers },
      (_, i) => `Player ${i + 1}`
    );
    const groups: Array<{ name: string; players: string[] }> = [];
    for (let g = 0; g < numGroups; g++) {
      groups.push({
        name: `Group ${String.fromCharCode(65 + g)}`,
        players: [],
      });
    }
    players.forEach((player, idx) => {
      groups[idx % numGroups].players.push(player);
    });
    setGroupPreview(groups);
  }, [formData.maxParticipants, formData.numGroups]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        ...formData,
        type: formData.type as "singles" | "doubles" | "mixed",
        category: formData.category as "men" | "women" | "kids",
        format: formData.format as "round-robin" | "knockout" | "swiss",
      });
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
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue:
      | string
      | number
      | boolean
      | "singles"
      | "doubles"
      | "mixed"
      | "men"
      | "women"
      | "kids"
      | "round-robin"
      | "knockout"
      | "swiss" = value;
    if (name === "type") {
      newValue = value as "singles" | "doubles" | "mixed";
    } else if (name === "category") {
      newValue = value as "men" | "women" | "kids";
    } else if (name === "format") {
      newValue = value as "round-robin" | "knockout" | "swiss";
    } else if (name === "numGroups") {
      newValue = Math.max(1, parseInt(value) || 1);
    } else if (name === "knockoutEnabled") {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (name === "advanceCount") {
      newValue = Math.max(1, parseInt(value) || 1);
    } else if (type === "number") {
      newValue = parseFloat(value) || 0;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Tournament">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ...existing code... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="singles">Singles</option>
              <option value="doubles">Doubles</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="round-robin">Round Robin</option>
              <option value="knockout">Knockout</option>
              <option value="swiss">Swiss</option>
            </select>
          </div>
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
          {/* Number of Groups Selector */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Groups
            </label>
            <Input
              name="numGroups"
              type="number"
              min="1"
              max={formData.maxParticipants}
              value={formData.numGroups}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Players will be evenly distributed into groups (A, B, C, ...)
            </p>
          </div>
          {/* Knockout Advancement Option */}
          <div className="md:col-span-2 flex items-center space-x-3">
            <input
              type="checkbox"
              name="knockoutEnabled"
              checked={formData.knockoutEnabled}
              onChange={handleChange}
              id="knockoutEnabled"
              className="mr-2"
            />
            <label
              htmlFor="knockoutEnabled"
              className="text-sm font-medium text-gray-700"
            >
              Enable Knockout Stage after Groups
            </label>
            {formData.knockoutEnabled && (
              <div className="flex items-center space-x-2 ml-4">
                <label className="text-xs text-gray-500">Advance top</label>
                <Input
                  name="advanceCount"
                  type="number"
                  min="1"
                  max={Math.ceil(formData.maxParticipants / formData.numGroups)}
                  value={formData.advanceCount}
                  onChange={handleChange}
                  className="w-16"
                />
                <span className="text-xs text-gray-500">from each group</span>
              </div>
            )}
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
        {/* Live Group Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Distribution Preview
          </label>
          {groupPreview.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupPreview.map((group) => (
                <div key={group.name} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-green-700 mb-2">
                    {group.name}
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {group.players.map((player) => (
                      <li key={player}>{player}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              Set max participants and number of groups to preview distribution.
            </div>
          )}
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
