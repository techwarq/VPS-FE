'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Loader2, Edit, Shield } from 'lucide-react';
import { AuthService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  userId: string;
  email: string;
  name?: string;
  profilePicture?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    const userData = await AuthService.getCurrentUser();
    if (!userData) {
      router.push('/signin');
    } else {
      setUser(userData);
      setEditName(userData.name || '');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    router.push('/signin');
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    
    try {
      await AuthService.updateProfile(editName);
      setUser(prev => prev ? { ...prev, name: editName } : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      {/* Animated background gradients */}
      <motion.div 
        className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
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
        className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
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

      {/* Header */}
      <div className="max-w-4xl mx-auto relative z-10 mb-8">
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

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="rounded-3xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 shadow-[0_8px_32px_0_rgba(16,185,129,0.2),inset_0_1px_0_0_rgba(255,255,255,0.3)] p-8">
          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-8">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="relative"
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name || 'Profile'}
                  className="w-24 h-24 rounded-full border-4 border-emerald-500/40"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500/40 flex items-center justify-center">
                  <User className="w-12 h-12 text-emerald-400" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            {/* User Info */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isEditing ? (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-3xl font-bold text-white bg-white/10 backdrop-blur-sm border border-emerald-500/40 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-400/60 transition-all"
                      placeholder="Your Name"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(user.name || '');
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      {user.name || 'Anonymous User'}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Edit className="w-5 h-5 text-emerald-400" />
                    </button>
                  </div>
                )}
                <p className="text-emerald-300/60 text-sm mb-1">Member since {new Date().toLocaleDateString()}</p>
                <div className="flex items-center gap-2 text-emerald-300/80">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40">
              <p className="text-emerald-300/60 text-sm mb-1">Total Generations</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40">
              <p className="text-emerald-300/60 text-sm mb-1">Avatars Created</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40">
              <p className="text-emerald-300/60 text-sm mb-1">Photoshoots</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
          </motion.div>

          {/* Account Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Account Details</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40">
                <p className="text-emerald-300/60 text-sm mb-1">User ID</p>
                <p className="text-white font-mono text-sm">{user.userId}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40">
                <p className="text-emerald-300/60 text-sm mb-1">Email Address</p>
                <p className="text-white">{user.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-8 border-t border-emerald-500/20"
          >
            <div className="flex flex-wrap gap-4">
              <Link
                href="/generate-2"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.5)]"
              >
                Create New Photoshoot
              </Link>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white rounded-xl font-medium hover:bg-white/15 transition-all">
                View History
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white rounded-xl font-medium hover:bg-white/15 transition-all">
                Settings
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

