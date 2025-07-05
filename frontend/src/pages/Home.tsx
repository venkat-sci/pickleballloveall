import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Calendar,
  Play,
  ArrowRight,
  Zap,
  Star,
  Award,
  BarChart3,
  Sparkles,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { PickleballAnimation } from "../components/animations/PickleballAnimation";
import { useAuthStore } from "../store/authStore";

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  const stats = [
    { icon: Trophy, value: "50K+", label: "Active Players" },
    { icon: Calendar, value: "1.2K+", label: "Tournaments" },
    { icon: Users, value: "200+", label: "Communities" },
    { icon: Award, value: "99.9%", label: "Uptime" },
  ];

  const features = [
    {
      icon: Trophy,
      title: "Tournament Management",
      description:
        "Create and manage professional tournaments with advanced bracket systems.",
      image:
        "https://images.unsplash.com/photo-1593088132292-c3b3de10d5c8?w=400&h=300&fit=crop&crop=center",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Users,
      title: "Community Building",
      description:
        "Connect with players worldwide and build lasting pickleball relationships.",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop&crop=center",
      color: "from-blue-400 to-purple-500",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Track your progress with detailed statistics and improvement insights.",
      image:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center",
      color: "from-green-400 to-teal-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tournament Director",
      content:
        "PicklePro transformed how we organize tournaments. The automation saves us hours!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b4a4?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Mike Chen",
      role: "Pro Player",
      content:
        "The analytics feature helped me identify weaknesses and improve my game significantly.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Lisa Rodriguez",
      role: "Club Owner",
      content:
        "Best investment we made for our club. Players love the community features!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      {/* Animated Pickleball Background */}
      <PickleballAnimation />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                PicklePro
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#community"
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                Community
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                Reviews
              </a>
              <Link
                to="/pricing"
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                Pricing
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm" className="font-medium">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/app/dashboard">
                  <Button variant="primary" size="sm" className="font-medium">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.05),transparent_50%)]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <Badge className="mb-6 inline-flex items-center space-x-2 bg-green-50 text-green-700 border-green-200">
                <Sparkles className="w-4 h-4" />
                <span>#1 Pickleball Platform</span>
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Elevate Your{" "}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Pickleball
                </span>{" "}
                Experience
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                Join the most comprehensive pickleball community. Compete in
                tournaments, track your progress, and connect with players
                worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                {!isAuthenticated ? (
                  <>
                    <Link to="/register">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto text-lg px-8 py-4"
                      >
                        Start Playing Free
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto text-lg px-8 py-4"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Watch Demo
                    </Button>
                  </>
                ) : (
                  <Link to="/app/dashboard">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto text-lg px-8 py-4"
                    >
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    className="text-center lg:text-left"
                  >
                    <div className="flex items-center justify-center lg:justify-start mb-2">
                      <stat.icon className="w-5 h-5 text-green-600 mr-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/mainpage/mainpageheader.png"
                  alt="Pickleball Tournament Action"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                {/* Floating Stats Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Live Tournament
                      </div>
                      <div className="text-xs text-gray-600">
                        156 Players Active
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Player Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                      alt="Player"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Alex Chen
                      </div>
                      <div className="text-xs text-gray-600 flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                        4.8 Rating
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
                <Zap className="w-4 h-4 mr-2" />
                Powerful Features
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Everything You Need to Excel
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From tournament management to player development, our platform
                provides comprehensive tools for every aspect of competitive
                pickleball.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                  <div className="relative">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-80`}
                    ></div>
                    <div className="absolute top-6 left-6">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    <Button
                      variant="ghost"
                      className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-700"
                    >
                      Learn more <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 bg-purple-50 text-purple-700 border-purple-200">
                <Heart className="w-4 h-4 mr-2" />
                Community Driven
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Connect with Players Worldwide
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join a vibrant community of pickleball enthusiasts. Find playing
                partners, share experiences, and grow together in the sport you
                love.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: Users,
                    text: "Connect with local and global players",
                  },
                  { icon: MessageCircle, text: "Share tips and strategies" },
                  { icon: Calendar, text: "Organize casual games and meetups" },
                  { icon: Award, text: "Celebrate achievements together" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <Button size="lg" className="text-lg px-8 py-4">
                Join Community
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=500&fit=crop&crop=center"
                  alt="Pickleball Community"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Community Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "50K+", label: "Players" },
                      { value: "200+", label: "Cities" },
                      { value: "95%", label: "Satisfaction" },
                    ].map((stat, index) => (
                      <div key={index} className="text-center text-white">
                        <div className="text-xl font-bold">{stat.value}</div>
                        <div className="text-sm opacity-90">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-24 bg-gradient-to-br from-green-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-yellow-50 text-yellow-700 border-yellow-200">
              <Star className="w-4 h-4 mr-2" />
              Customer Love
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by Players Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our community members say about their experience with
              PicklePro.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Elevate Your Game?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of players who have already transformed their
              pickleball experience. Start your journey today with a free
              account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link to="/register">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto text-lg px-8 py-4"
                    >
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-white text-white hover:bg-white/10 text-lg px-8 py-4"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Contact Sales
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/app/dashboard">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-4"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">PicklePro</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The ultimate platform for pickleball enthusiasts. Join, compete,
                and grow with the best community in the sport.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Tournaments
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <Link
                    to="/help"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 PicklePro. All rights reserved. Made with ❤️ for the
              pickleball community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
