'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LogOut,
  Loader2,
  Edit,
  MessageSquare,
  Camera,
  Image as ImageIcon,
  Images,
  CreditCard,
  Settings as SettingsIcon,
  UserCircle,
  Clock,
  Coins,
  ArrowRight,
  Mail,
  Lock,
  Bell,
  Globe
} from 'lucide-react';
import { AuthService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';

interface UserProfile {
  userId: string;
  email: string;
  name?: string;
  profilePicture?: string;
}

// Mock data - replace with actual API calls
const mockLastChat = {
  preview: "Hey! I'd like to create a new avatar with a professional look...",
  timestamp: "2 hours ago",
  unread: 2
};

const mockLastPhotoshoot = {
  title: "Summer Collection 2024",
  thumbnail: "/Generated Image September 26, 2025 - 6_11PM.png",
  date: "3 days ago",
  images: 12
};

const mockPhotoshootCredits = [
  { id: 1, title: "Summer Collection 2024", credits: 50, date: "3 days ago", status: "completed" },
  { id: 2, title: "Winter Fashion Shoot", credits: 75, date: "1 week ago", status: "completed" },
  { id: 3, title: "Casual Wear Series", credits: 30, date: "2 weeks ago", status: "completed" },
];

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    const userData = await AuthService.getCurrentUser();
    if (!userData) {
      // Clear invalid token before redirecting
      AuthService.logout();
      router.push('/signin');
    } else {
      setUser(userData);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    router.push('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-emerald-300/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400 mb-2">Dashboard</h1>
              <p className="text-emerald-400/80 text-lg">Welcome back, <span className="text-white font-semibold">{user.name || 'User'}</span>!</p>
            </div>

            {/* Last Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">Last Chat</h2>
                </div>
                <Link
                  href="/generate-2"
                  className="text-emerald-300 hover:text-emerald-400 text-sm flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-emerald-500/20">
                <p className="text-gray-300 mb-2">{mockLastChat.preview}</p>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300/60 text-sm">{mockLastChat.timestamp}</span>
                  {mockLastChat.unread > 0 && (
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                      {mockLastChat.unread} new
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Last Photoshoot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 p-6"
            >
              <div className="flex  items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">Last Photoshoot</h2>
                </div>
                <Link
                  href="/generate-2"
                  className="text-emerald-300 hover:text-emerald-400 text-sm flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex gap-4">
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-emerald-500/40">
                  <img
                    src={mockLastPhotoshoot.thumbnail}
                    alt={mockLastPhotoshoot.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{mockLastPhotoshoot.title}</h3>
                  <div className="flex items-center gap-4 text-emerald-300/60 text-sm mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {mockLastPhotoshoot.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      {mockLastPhotoshoot.images} images
                    </span>
                  </div>
                  <Link
                    href="/generate-2"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-lg transition-all"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Credits by Photoshoot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Coins className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Credits by Photoshoot</h2>
              </div>
              <div className="space-y-3">
                {mockPhotoshootCredits.map((photoshoot) => (
                  <div
                    key={photoshoot.id}
                    className="bg-black/30 rounded-lg p-4 border border-emerald-500/20 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-white font-medium mb-1">{photoshoot.title}</h3>
                      <div className="flex items-center gap-4 text-emerald-300/60 text-sm">
                        <span>{photoshoot.date}</span>
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs">
                          {photoshoot.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-emerald-400" />
                      <span className="text-xl font-bold text-emerald-300">{photoshoot.credits}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'avatars':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400 mb-2">My Avatars</h1>
              <p className="text-emerald-400/80 text-lg">Manage and view all your created avatars</p>
            </div>
            <div className="rounded-xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 p-8 text-center">
              <ImageIcon className="w-16 h-16 text-emerald-400/50 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No avatars created yet</p>
              <Link
                href="/generate-2"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all"
              >
                Create Your First Avatar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400 mb-2">Gallery</h1>
              <p className="text-emerald-400/80 text-lg">All your photoshoot results in one place</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden border border-emerald-500/40 bg-gray-800/50"
                >
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-gray-800 flex items-center justify-center">
                    <Images className="w-8 h-8 text-emerald-400/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400 mb-2">Settings</h1>
              <p className="text-emerald-400/80 text-lg">Manage your account preferences</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">Notifications</h2>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-gray-300 group-hover:text-white transition-colors">Email notifications</span>
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded bg-black/30 border-emerald-500/40 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                      defaultChecked
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-gray-300 group-hover:text-white transition-colors">Push notifications</span>
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded bg-black/30 border-emerald-500/40 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">Preferences</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Language</label>
                    <select className="w-full bg-black/30 border border-emerald-500/40 rounded-lg px-4 py-2 text-white">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'subscriptions':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400 mb-2">Subscriptions</h1>
              <p className="text-emerald-400/80 text-lg">Manage your subscription and billing</p>
            </div>
            <div className="rounded-xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Current Plan</h2>
              </div>
              <div className="bg-black/30 rounded-lg p-6 border border-emerald-500/20 mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Free Plan</h3>
                <p className="text-emerald-300/60 mb-4">Basic features with limited credits</p>
                <div className="flex items-center gap-2 mb-4">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  <span className="text-white">100 credits/month</span>
                </div>
                <button className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        );

      case 'my-account':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400 mb-2">My Account</h1>
              <p className="text-emerald-400/80 text-lg">Manage your account information</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <UserCircle className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">Profile Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Name</label>
                    <input
                      type="text"
                      defaultValue={user.name || ''}
                      className="w-full bg-black/30 border border-emerald-500/40 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Email</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="flex-1 bg-black/30 border border-emerald-500/40 rounded-lg px-4 py-2 text-gray-400"
                      />
                      <Mail className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">Security</h2>
                </div>
                <div className="space-y-4">
                  <button className="w-full px-6 py-3 bg-white/10 hover:bg-white/15 border border-emerald-500/40 text-white rounded-lg transition-all text-left">
                    Change Password
                  </button>
                  <button className="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-lg transition-all text-left">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex overflow-hidden">
      {/* Animated background gradients */}
      <motion.div
        className="fixed top-20 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="fixed bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Sidebar */}
      <ProfileSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-emerald-500/20 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <Link
              href="/generate-2"
              className="text-emerald-300 hover:text-emerald-400 transition-colors flex items-center gap-2"
            >
              ← Back to App
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-500/40 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 relative z-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
