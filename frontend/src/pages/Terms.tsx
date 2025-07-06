import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  FileText,
  Mail,
  Scale,
  Shield,
  Trophy,
  Users,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";

export const Terms: React.FC = () => {
  const lastUpdated = "December 15, 2024";

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: FileText,
      content: [
        {
          text: 'By accessing and using Pickleballloveall ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
        },
        {
          text: 'These Terms of Service ("Terms") govern your use of our tournament management platform and services. We may update these Terms from time to time, and your continued use of the Platform constitutes acceptance of any changes.',
        },
      ],
    },
    {
      title: "User Accounts and Registration",
      icon: Users,
      content: [
        {
          subtitle: "Account Creation",
          text: "To use certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.",
        },
        {
          subtitle: "Account Security",
          text: "You are responsible for safeguarding the password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.",
        },
        {
          subtitle: "Account Types",
          text: "We offer different account types (Free and Pro) with varying features and limitations. You may upgrade or downgrade your account at any time, subject to our pricing terms.",
        },
      ],
    },
    {
      title: "Platform Usage",
      icon: Trophy,
      content: [
        {
          subtitle: "Permitted Use",
          text: "You may use the Platform for organizing and participating in pickleball tournaments, managing player registrations, tracking scores, and related tournament management activities.",
        },
        {
          subtitle: "Prohibited Activities",
          text: "You agree not to use the Platform for any unlawful purpose, to transmit harmful content, to interfere with the Platform's operation, or to violate any applicable laws or regulations.",
        },
        {
          subtitle: "Content Standards",
          text: "All content you submit must be accurate, respectful, and appropriate for a sports community. We reserve the right to remove content that violates our community standards.",
        },
      ],
    },
    {
      title: "Tournament Organization",
      icon: Scale,
      content: [
        {
          subtitle: "Organizer Responsibilities",
          text: "Tournament organizers are responsible for ensuring fair play, following applicable rules and regulations, managing disputes, and providing accurate tournament information.",
        },
        {
          subtitle: "Player Registration",
          text: "Organizers may set registration requirements, fees, and deadlines. Players agree to abide by tournament rules and organizer decisions regarding their participation.",
        },
        {
          subtitle: "Dispute Resolution",
          text: "While we provide tools for tournament management, disputes between players or organizers should be resolved according to established tournament rules and procedures.",
        },
      ],
    },
    {
      title: "Payment Terms",
      icon: Shield,
      content: [
        {
          subtitle: "Subscription Fees",
          text: "Pro subscriptions are billed monthly or annually as selected. All fees are non-refundable except as required by law or as specifically stated in our refund policy.",
        },
        {
          subtitle: "Tournament Fees",
          text: "Tournament entry fees are processed through our payment system. We may charge processing fees for payment transactions. Refund policies for tournament fees are set by individual tournament organizers.",
        },
        {
          subtitle: "Price Changes",
          text: "We reserve the right to change our pricing with 30 days' notice. Price changes will not affect existing subscription periods but will apply to subsequent renewals.",
        },
      ],
    },
    {
      title: "Intellectual Property",
      icon: FileText,
      content: [
        {
          subtitle: "Platform Ownership",
          text: "The Platform, including all software, designs, text, graphics, and other content, is owned by Pickleballloveall and protected by intellectual property laws.",
        },
        {
          subtitle: "User Content",
          text: "You retain ownership of content you submit but grant us a license to use, display, and distribute such content as necessary to provide our services.",
        },
        {
          subtitle: "Trademark Usage",
          text: "You may not use our trademarks, logos, or brand names without our prior written consent.",
        },
      ],
    },
    {
      title: "Privacy and Data Protection",
      icon: Shield,
      content: [
        {
          subtitle: "Data Collection",
          text: "Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.",
        },
        {
          subtitle: "Data Security",
          text: "We implement appropriate security measures to protect your data, but cannot guarantee absolute security of information transmitted over the internet.",
        },
        {
          subtitle: "Data Retention",
          text: "We retain your data as long as your account is active or as needed to provide services, comply with legal obligations, or resolve disputes.",
        },
      ],
    },
    {
      title: "Limitation of Liability",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "Service Availability",
          text: "While we strive for high availability, we do not guarantee uninterrupted access to the Platform and are not liable for any downtime or service interruptions.",
        },
        {
          subtitle: "Damages Limitation",
          text: "Our liability for any damages arising from your use of the Platform is limited to the amount you paid for our services in the 12 months preceding the claim.",
        },
        {
          subtitle: "Third-Party Content",
          text: "We are not responsible for content, actions, or omissions of third parties, including other users of the Platform.",
        },
      ],
    },
    {
      title: "Termination",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "Account Termination",
          text: "You may terminate your account at any time. We may terminate or suspend your account for violation of these Terms or for any other reason with appropriate notice.",
        },
        {
          subtitle: "Effect of Termination",
          text: "Upon termination, your right to use the Platform ceases immediately. We may retain certain information as required by law or for legitimate business purposes.",
        },
        {
          subtitle: "Data Export",
          text: "Before account termination, you may export your data using our provided tools. After termination, we are not obligated to maintain or provide access to your data.",
        },
      ],
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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Terms of{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              These terms govern your use of Pickleballloveall and outline the
              rights and responsibilities of all users.
            </p>
            <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      {/* Terms Overview */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Terms Overview
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                By using Pickleballloveall, you agree to these terms which
                ensure a fair, safe, and enjoyable experience for all users in
                our pickleball community.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Fair Play</h3>
                  <p className="text-sm text-gray-600">
                    Respectful community standards
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Protection</h3>
                  <p className="text-sm text-gray-600">
                    Rights and responsibilities
                  </p>
                </div>
                <div className="text-center">
                  <Scale className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">
                    Legal Framework
                  </h3>
                  <p className="text-sm text-gray-600">
                    Clear guidelines and rules
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <section.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {section.title}
                      </h2>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {section.content.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          {"subtitle" in item && item.subtitle && (
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {item.subtitle}
                            </h3>
                          )}
                          <p className="text-gray-700 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Governing Law */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Governing Law and Jurisdiction
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  These Terms are governed by and construed in accordance with
                  the laws of the State of California, United States, without
                  regard to its conflict of law provisions.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Any disputes arising from these Terms or your use of the
                  Platform will be resolved through binding arbitration in
                  accordance with the rules of the American Arbitration
                  Association, conducted in San Francisco, California.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If any provision of these Terms is found to be unenforceable,
                  the remaining provisions will remain in full force and effect.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                If you have any questions about these Terms of Service or need
                clarification on any provisions, please contact our legal team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Contact Legal Team
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Email: legal@pickleballloveall.com
                </Button>
              </div>
            </CardContent>
          </Card>
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
