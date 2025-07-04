import React, { useState } from "react";
import { Mail, Phone, MessageCircle, Send, Loader } from "lucide-react";
import { User } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import toast from "react-hot-toast";

interface ContactOrganizerModalProps {
  organizer: User;
  tournamentName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactOrganizerModal: React.FC<ContactOrganizerModalProps> = ({
  organizer,
  tournamentName,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    subject: `Question about ${tournamentName}`,
    message: "",
    contactMethod: "email" as "email" | "phone",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate sending message (in real app, this would call an API)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formData.contactMethod === "email") {
        // In a real app, this would send an email through your backend
        toast.success("Message sent to organizer via email!");
      } else {
        // For phone, we'll just show the phone number
        toast.success("Organizer contact information copied to clipboard!");
        if (organizer.phone) {
          navigator.clipboard.writeText(organizer.phone);
        }
      }

      onClose();
      setFormData({
        subject: `Question about ${tournamentName}`,
        message: "",
        contactMethod: "email",
      });
    } catch (err) {
      console.error("Failed to contact organizer:", err);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Tournament Organizer"
    >
      <div className="space-y-6">
        {/* Organizer Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            {organizer.profileImage ? (
              <img
                src={organizer.profileImage}
                alt={organizer.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                {organizer.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{organizer.name}</h3>
              <p className="text-sm text-gray-600 capitalize">
                {organizer.role}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {organizer.email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 flex-1 truncate">
                  {organizer.email}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(organizer.email, "Email")}
                  className="text-xs"
                >
                  Copy
                </Button>
              </div>
            )}

            {organizer.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{organizer.phone}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(organizer.phone!, "Phone")}
                  className="text-xs"
                >
                  Copy
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Method
            </label>
            <select
              name="contactMethod"
              value={formData.contactMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="email">Send Email Message</option>
              <option value="phone">Get Phone Contact</option>
            </select>
          </div>

          {formData.contactMethod === "email" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter message subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Type your message here..."
                />
              </div>
            </>
          )}

          {formData.contactMethod === "phone" && organizer.phone && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Phone Contact</span>
              </div>
              <p className="text-sm text-blue-800 mb-3">
                Click the button below to copy the organizer's phone number to
                your clipboard.
              </p>
              <div className="flex items-center space-x-3 bg-white rounded-md p-3">
                <span className="font-mono text-lg">{organizer.phone}</span>
              </div>
            </div>
          )}

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
              ) : formData.contactMethod === "email" ? (
                <Send className="w-4 h-4" />
              ) : (
                <MessageCircle className="w-4 h-4" />
              )}
              <span>
                {loading
                  ? "Processing..."
                  : formData.contactMethod === "email"
                  ? "Send Message"
                  : "Get Contact Info"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
