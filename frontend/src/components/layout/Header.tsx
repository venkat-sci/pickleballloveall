import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Settings,
  LogOut,
  Trophy,
  Calendar,
  Users,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

export const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Sidebar close on click outside (for sidebar only)
  const sidebarRef = useClickOutside<HTMLDivElement>(
    () => setIsSidebarOpen(false),
    isSidebarOpen
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigation = [
    { name: "Dashboard", href: "/app/dashboard", icon: Trophy },
    { name: "Tournaments", href: "/app/tournaments", icon: Trophy },
    { name: "Matches", href: "/app/matches", icon: Calendar },
    { name: "Players", href: "/app/players", icon: Users },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/app/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Pickleballloveall
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop user menu with dropdown */}
            <div className="hidden md:block relative">
              <Button
                variant="ghost"
                className="flex items-center space-x-2"
                onClick={() => setIsSidebarOpen((open) => !open)}
                aria-label="Open user menu"
              >
                <Avatar src={user?.profileImage} name={user?.name} size="sm" />
                <span className="text-sm font-medium">{user?.name}</span>
              </Button>
              {/* Dropdown menu for desktop */}
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                >
                  <Link
                    to="/app/profile"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </motion.div>
              )}
            </div>
            {/* Mobile: single sidebar button (only opens sidebar on mobile) */}
            <Button
              variant="ghost"
              className="md:hidden flex items-center"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(true);
                }
              }}
            >
              <Avatar src={user?.profileImage} name={user?.name} size="sm" />
              <Menu className="ml-2" />
            </Button>
          </div>
        </div>

        {/* Mobile Sidebar Navigation (only render on mobile) */}
        {typeof window !== "undefined" && window.innerWidth < 768 && (
          <motion.div
            initial={false}
            animate={isSidebarOpen ? "open" : "closed"}
            variants={{}}
            style={{ pointerEvents: isSidebarOpen ? "auto" : "none" }}
          >
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isSidebarOpen ? 0.5 : 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Sidebar */}
            <motion.div
              ref={sidebarRef}
              initial={false}
              animate={isSidebarOpen ? "open" : "closed"}
              variants={{
                open: {
                  x: 0,
                  transition: { type: "spring", stiffness: 400, damping: 32 },
                },
                closed: {
                  x: -320,
                  transition: { type: "spring", stiffness: 400, damping: 32 },
                },
              }}
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col"
              style={{
                transform: isSidebarOpen
                  ? "translateX(0)"
                  : "translateX(-320px)",
              }}
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Avatar
                    src={user?.profileImage}
                    name={user?.name}
                    size="sm"
                  />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <Button variant="ghost" onClick={() => setIsSidebarOpen(false)}>
                  <X />
                </Button>
              </div>
              <nav className="flex-1 py-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <hr className="my-2 border-t border-gray-200" />
                {/* Settings and Logout moved here, right after nav list */}
                <Link
                  to="/app/profile"
                  className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>Profile Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 text-sm w-full text-left rounded"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </div>
    </header>
  );
};
