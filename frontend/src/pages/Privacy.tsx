import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Shield,
  Lock,
  Eye,
  Users,
  Database,
  Globe,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";

export const Privacy: React.FC = () => {
  const lastUpdated = "December 15, 2024";

  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect information you provide directly to us, such as when you create an account, join a tournament, or contact us for support. This includes your name, email address, and tournament preferences.",
        },
        {
          subtitle: "Tournament Data",
          text: "When you participate in or organize tournaments, we collect match results, scores, player statistics, and tournament-related communications.",
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect information about how you use our platform, including pages visited, features used, and time spent on the platform.",
        },
        {
          subtitle: "Device Information",
          text: "We collect information about the device you use to access our platform, including IP address, browser type, operating system, and mobile device identifiers.",
        },
      ],
    },
    {
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        {
          subtitle: "Platform Services",
          text: "We use your information to provide, maintain, and improve our tournament management platform, including creating tournaments, managing registrations, and tracking results.",
        },
        {
          subtitle: "Communication",
          text: "We use your contact information to send you tournament updates, match notifications, and important platform announcements.",
        },
        {
          subtitle: "Analytics and Improvement",
          text: "We analyze usage patterns to improve our platform features, user experience, and develop new functionality.",
        },
        {
          subtitle: "Legal Compliance",
          text: "We may use your information to comply with legal obligations, resolve disputes, and enforce our terms of service.",
        },
      ],
    },
    {
      title: "Information Sharing",
      icon: Users,
      content: [
        {
          subtitle: "Tournament Participants",
          text: "Your name, rating, and tournament results may be visible to other participants in the same tournament for competitive purposes.",
        },
        {
          subtitle: "Service Providers",
          text: "We may share information with trusted third-party service providers who help us operate our platform, such as payment processors and email services.",
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information if required by law, court order, or to protect the rights, property, or safety of Pickleballloveall, our users, or others.",
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the business transaction.",
        },
      ],
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        {
          subtitle: "Encryption",
          text: "We use industry-standard SSL encryption to protect data transmitted between your device and our servers.",
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls to ensure only authorized personnel can access user data, and only when necessary for platform operations.",
        },
        {
          subtitle: "Regular Audits",
          text: "We conduct regular security audits and assessments to identify and address potential vulnerabilities in our systems.",
        },
        {
          subtitle: "Data Backup",
          text: "We maintain secure backups of user data to prevent loss and ensure platform continuity in case of technical issues.",
        },
      ],
    },
    {
      title: "Your Rights and Choices",
      icon: Shield,
      content: [
        {
          subtitle: "Account Access",
          text: "You can access and update your account information at any time through your profile settings.",
        },
        {
          subtitle: "Data Portability",
          text: "You can request a copy of your personal data in a machine-readable format by contacting our support team.",
        },
        {
          subtitle: "Account Deletion",
          text: "You can request deletion of your account and associated data. Note that some information may be retained for legal or legitimate business purposes.",
        },
        {
          subtitle: "Communication Preferences",
          text: "You can control the types of communications you receive from us through your notification settings.",
        },
      ],
    },
    {
      title: "International Data Transfers",
      icon: Globe,
      content: [
        {
          subtitle: "Global Operations",
          text: "Pickleballloveall operates globally, and your information may be transferred to and processed in countries other than your country of residence.",
        },
        {
          subtitle: "Adequate Protection",
          text: "We ensure that international data transfers are protected by appropriate safeguards, including standard contractual clauses and adequacy decisions.",
        },
        {
          subtitle: "EU Users",
          text: "For users in the European Union, we comply with GDPR requirements for international data transfers and provide appropriate protections.",
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Privacy{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Privacy Commitment
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                At Pickleballloveall, we believe in transparency and giving you
                control over your personal information. We only collect data
                that helps us provide better tournament experiences and never
                sell your personal information to third parties.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Secure</h3>
                  <p className="text-sm text-gray-600">
                    Enterprise-grade security
                  </p>
                </div>
                <div className="text-center">
                  <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Transparent</h3>
                  <p className="text-sm text-gray-600">Clear data practices</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">User Control</h3>
                  <p className="text-sm text-gray-600">You own your data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Privacy Sections */}
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
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <section.icon className="w-6 h-6 text-green-600" />
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
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.subtitle}
                          </h3>
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

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Questions About Your Privacy?
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                If you have any questions about this Privacy Policy or how we
                handle your data, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Contact Privacy Team
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Email: privacy@pickleballloveall.com
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
