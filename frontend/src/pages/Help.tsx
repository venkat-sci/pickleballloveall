import { motion } from "framer-motion";
import {
  ArrowRight,
  Book,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  MessageCircle,
  Play,
  Search,
  Settings,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", icon: Book },
    { id: "getting-started", name: "Getting Started", icon: Play },
    { id: "tournaments", name: "Tournaments", icon: Trophy },
    { id: "players", name: "Players", icon: Users },
    { id: "settings", name: "Settings", icon: Settings },
    { id: "billing", name: "Billing", icon: Calendar },
    { id: "troubleshooting", name: "Troubleshooting", icon: HelpCircle },
  ];

  const popularArticles = [
    {
      title: "How to Create Your First Tournament",
      description: "Step-by-step guide to setting up a tournament from scratch",
      category: "getting-started",
      readTime: "5 min read",
      views: "12.5k views",
    },
    {
      title: "Managing Player Registration",
      description: "Best practices for handling player sign-ups and waitlists",
      category: "tournaments",
      readTime: "3 min read",
      views: "8.2k views",
    },
    {
      title: "Setting Up Bracket Systems",
      description:
        "Understanding different tournament formats and bracket types",
      category: "tournaments",
      readTime: "7 min read",
      views: "6.8k views",
    },
    {
      title: "Billing and Subscription Management",
      description: "How to manage your subscription and payment methods",
      category: "billing",
      readTime: "4 min read",
      views: "5.1k views",
    },
  ];

  const faqs = [
    {
      question: "How do I create my first tournament?",
      answer:
        'To create your first tournament, log into your account and click "Create Tournament" from the dashboard. Fill in the tournament details including name, dates, location, and format. You can then invite players and set up the bracket system.',
      category: "getting-started",
    },
    {
      question: "What tournament formats are supported?",
      answer:
        "Pickleballloveall supports multiple tournament formats including single elimination, double elimination, round robin, and Swiss system tournaments. You can also create custom formats for special events.",
      category: "tournaments",
    },
    {
      question: "How do players register for tournaments?",
      answer:
        "Players can register through the tournament page by clicking \"Join Tournament\". They'll need to create an account if they don't have one. You can also manually add players from your organizer dashboard.",
      category: "players",
    },
    {
      question: "Can I customize the tournament bracket?",
      answer:
        "Yes! You can customize brackets by seeding players, adjusting match schedules, and even manually placing players in specific positions. The system will automatically generate brackets based on your preferences.",
      category: "tournaments",
    },
    {
      question: "How do I upgrade to the Pro plan?",
      answer:
        'You can upgrade to Pro at any time from your account settings. Go to Billing > Subscription and click "Upgrade to Pro". Your new features will be available immediately.',
      category: "billing",
    },
    {
      question:
        "What happens if I exceed the tournament limit on the Free plan?",
      answer:
        "If you reach the 5-tournament limit on the Free plan, you'll be prompted to upgrade to Pro to create additional tournaments. Your existing tournaments will remain active.",
      category: "billing",
    },
    {
      question: "How do I track match scores in real-time?",
      answer:
        "Pro users can enable real-time scoring from the tournament settings. Players or officials can update scores using the mobile app, and results will appear instantly on the tournament page.",
      category: "tournaments",
    },
    {
      question: "Can I export tournament data?",
      answer:
        "Yes, Pro users can export all tournament data including player lists, match results, and statistics in CSV, PDF, or Excel formats from the tournament dashboard.",
      category: "settings",
    },
  ];

  const videoTutorials = [
    {
      title: "Getting Started with Pickleballloveall",
      description:
        "Complete walkthrough of creating your account and first tournament",
      duration: "8:32",
      thumbnail:
        "https://images.pexels.com/photos/6224459/pexels-photo-6224459.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      title: "Advanced Tournament Management",
      description: "Learn about seeding, scheduling, and bracket customization",
      duration: "12:15",
      thumbnail:
        "https://images.pexels.com/photos/8007401/pexels-photo-8007401.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      title: "Player Registration & Communication",
      description:
        "Best practices for managing players and tournament communication",
      duration: "6:45",
      thumbnail:
        "https://images.pexels.com/photos/6224456/pexels-photo-6224456.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
  ];

  const resources = [
    {
      title: "Tournament Organizer Guide",
      description: "Comprehensive PDF guide for tournament organizers",
      type: "PDF",
      size: "2.3 MB",
      icon: FileText,
    },
    {
      title: "Player Handbook",
      description: "Everything players need to know about joining tournaments",
      type: "PDF",
      size: "1.8 MB",
      icon: FileText,
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers",
      type: "Web",
      size: "Online",
      icon: ExternalLink,
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = popularArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              Help{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Center
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers, tutorials, and resources to help you make the most
              of Pickleballloveall
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <Input
                placeholder="Search for help articles, tutorials, or FAQs..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-lg py-4"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Contact Support
                </h3>
                <p className="text-gray-600 mb-4">
                  Get personalized help from our support team
                </p>
                <Link to="/contact">
                  <Button variant="outline" size="sm">
                    Contact Us
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Video className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Video Tutorials
                </h3>
                <p className="text-gray-600 mb-4">
                  Watch step-by-step video guides
                </p>
                <Button variant="outline" size="sm">
                  Watch Videos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Book className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Documentation
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse our comprehensive guides
                </p>
                <Button variant="outline" size="sm">
                  Read Docs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Popular Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="info" size="sm">
                        {
                          categories.find((c) => c.id === article.category)
                            ?.name
                        }
                      </Badge>
                      <div className="text-right text-sm text-gray-500">
                        <div>{article.readTime}</div>
                        <div>{article.views}</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{article.description}</p>
                    <Button variant="ghost" size="sm">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Video Tutorials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videoTutorials.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-gray-800 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600">{video.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-0">
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Downloads & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <resource.icon className="w-12 h-12 text-green-600" />
                      <Badge variant="info" size="sm">
                        {resource.type}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {resource.size}
                      </span>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Still Need Help?</h2>
            <p className="text-xl mb-8 text-white/90">
              Our support team is here to help you succeed with your
              tournaments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Contact Support
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Live Chat
              </Button>
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
