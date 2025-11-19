'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  Image,
  Settings,
  CreditCard,
  UserCircle,
  MessageSquare,
  Camera,
  Images,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { AuthService } from '@/services/auth.service';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface UserProfile {
  name?: string;
  email: string;
  profilePicture?: string;
}

const profileSections = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'avatars', label: 'Avatars', icon: Image },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'my-account', label: 'My Account', icon: UserCircle },
];

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<string>('Creative Professional');

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AuthService.getCurrentUser();
      if (userData) {
        setUser(userData);
      }
    };
    loadUser();
  }, []);

  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-72 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col relative overflow-hidden"
    >
      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

      {/* User Profile Section */}
      <div className="p-6 relative z-10">
        <div className="flex flex-col items-center mb-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer"
          >
            {/* Glowing ring effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-500" />

            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name || 'Profile'}
                className="relative w-24 h-24 rounded-full border-2 border-black object-cover"
              />
            ) : (
              <div className="relative w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border-2 border-emerald-500/30">
                <span className="text-emerald-400 font-bold text-3xl">
                  {getInitial()}
                </span>
              </div>
            )}

            <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-1.5 border-2 border-black">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </motion.div>

          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-white">
              {user?.name || 'User'}
            </h2>
            <p className="text-emerald-400/70 text-sm font-medium mt-1">
              {userRole}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent my-2" />

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <nav className="space-y-1">
          {profileSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <motion.button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group overflow-hidden ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-3 w-full">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'
                    }`} />
                  <span className="flex-1 text-left font-medium tracking-wide">{section.label}</span>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <ChevronRight className="w-4 h-4 text-emerald-400" />
                    </motion.div>
                  )}
                </span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Quick Stats Footer */}
      <div className="p-4 relative z-10">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/20 to-black border border-emerald-500/20 backdrop-blur-md">
          <Link
            href="/generate-2"
            className="group flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium shadow-lg shadow-emerald-900/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Camera className="w-4 h-4" />
            <span>New Photoshoot</span>
          </Link>
          <p className="text-center text-xs text-emerald-500/40 mt-3">
            3 credits remaining
          </p>
        </div>
      </div>
    </motion.div>
  );
};
