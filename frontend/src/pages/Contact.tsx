import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Users,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import toast from "react-hot-toast";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      type: "general",
    });
    setLoading(false);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@pickleballloveall.com",
      response: "Response within 24 hours",
      color: "bg-blue-500",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our team",
      contact: "Available 9 AM - 6 PM EST",
      response: "Instant response",
      color: "bg-green-500",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us directly",
      contact: "+1 (555) 123-4567",
      response: "Mon-Fri 9 AM - 6 PM EST",
      color: "bg-purple-500",
    },
  ];

  const supportTypes = [
    {
      icon: HelpCircle,
      title: "General Support",
      description: "Questions about features, billing, or account issues",
    },
    {
      icon: Users,
      title: "Tournament Help",
      description: "Assistance with tournament setup and management",
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Bug reports and technical troubleshooting",
    },
  ];

  const offices = [
    {
      city: "San Francisco",
      address: "123 Pickleball Ave, Suite 100",
      zipcode: "San Francisco, CA 94105",
      phone: "+1 (555) 123-4567",
      email: "sf@pickleballloveall.com",
    },
    {
      city: "Austin",
      address: "456 Tournament Blvd, Floor 5",
      zipcode: "Austin, TX 78701",
      phone: "+1 (555) 987-6543",
      email: "austin@pickleballloveall.com",
    },
    {
      city: "Miami",
      address: "789 Court Street, Building A",
      zipcode: "Miami, FL 33101",
      phone: "+1 (555) 456-7890",
      email: "miami@pickleballloveall.com",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Pickleballloveall
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Get in{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Have questions? We're here to help! Reach out to our friendly
              support team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Can We Help?
            </h2>
            <p className="text-xl text-gray-600">
              Choose the best way to reach us
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                    >
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    <p className="font-medium text-gray-900 mb-2">
                      {method.contact}
                    </p>
                    <p className="text-sm text-gray-500">{method.response}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Send Us a Message
            </h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll get back to you as soon as
              possible
            </p>
          </div>

          <Card className="shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Enter your full name"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="general">General Support</option>
                    <option value="tournament">Tournament Help</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>

                <Input
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                  placeholder="Brief description of your inquiry"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Please provide as much detail as possible..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                  icon={Send}
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Support Types */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Can Help With
            </h2>
            <p className="text-xl text-gray-600">
              Our support team is experienced in all aspects of tournament
              management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <type.icon className="w-12 h-12 text-green-600 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {type.title}
                    </h3>
                    <p className="text-gray-600">{type.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Offices
            </h2>
            <p className="text-xl text-gray-600">
              Visit us at one of our locations across the United States
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {office.city}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                        <div className="text-sm text-gray-700">
                          <div>{office.address}</div>
                          <div>{office.zipcode}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          {office.phone}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          {office.email}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="text-center">
                <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Business Hours
                </h2>
                <p className="text-gray-600">
                  When you can reach our support team
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Support Hours
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium">
                        10:00 AM - 4:00 PM EST
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Emergency Support
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    For urgent tournament issues during events:
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    Available 24/7 for Pro subscribers
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Call: +1 (555) 911-HELP
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of tournament organizers using Pickleballloveall
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/help">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                >
                  Visit Help Center
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Pickleballloveall</span>
              </div>
              <p className="text-gray-400 mb-4">
                The ultimate platform for pickleball tournaments and player
                development.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tournaments
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Players
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 Pickleballloveall. All rights reserved. Made with ❤️
              for the pickleball community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
