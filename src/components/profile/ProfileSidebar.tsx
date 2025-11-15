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
  ChevronRight
} from 'lucide-react';
import { AuthService } from '@/services/auth.service';
import Link from 'next/link';

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
  const [userRole, setUserRole] = useState<string>('Creative Professional'); // This could come from user data

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
    <div className="w-72 h-full bg-black border-r border-emerald-500/40 flex flex-col">
      {/* User Profile Section */}
      <div className="p-6 border-b border-emerald-500/20">
        <div className="flex flex-col items-center mb-4">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name || 'Profile'}
              className="w-20 h-20 rounded-full border-2 border-emerald-500/40 mb-3"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-full flex items-center justify-center border-2 border-emerald-500/40 mb-3">
              <span className="text-white font-bold text-2xl">
                {getInitial()}
              </span>
            </div>
          )}
          <h2 className="text-xl font-bold text-white text-center">
            {user?.name || 'User'}
          </h2>
          <p className="text-emerald-300/60 text-sm text-center mt-1">
            {userRole}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {profileSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-emerald-400'}`} />
                <span className="flex-1 text-left font-medium">{section.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Stats Footer */}
      <div className="p-4 border-t border-emerald-500/20 bg-gray-900/30">
        <Link
          href="/generate-2"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 transition-all group"
        >
          <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">New Photoshoot</span>
        </Link>
      </div>
    </div>
  );
};

