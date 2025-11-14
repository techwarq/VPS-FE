'use client';

import { NavMenuItems } from "@/utils/constants";
import Link from "next/link";
import { PanelRight, User } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  isCollapsed = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [user, setUser] = useState<{
    name?: string;
    email: string;
    profilePicture?: string;
  } | null>(null);

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

  if (!isOpen) return null;

  return (
    <nav
      className={`h-full flex flex-col bg-black border-r border-green-500/40 
      transition-all duration-300 relative overflow-y-auto
      ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Close / Collapse Button */}
      {onClose && (
        <button
          onClick={onClose}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="absolute top-4 right-4 z-30 p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600/50"
        >
          <PanelRight
            className={`transition-transform ${
              isCollapsed ? "rotate-180" : ""
            } w-5 h-5`}
          />

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-30">
              {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>
          )}
        </button>
      )}

      {/* Header */}
      <div className="flex items-center justify-center mt-16">
        {isCollapsed ? (
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
        ) : (
          <Link
            className="text-2xl font-bold text-green-200 hover:text-gray-300 transition-colors"
            href="/"
          >
            Tiska
          </Link>
        )}
      </div>

      {/* User Profile - Moved to Top */}
      <div className={`flex justify-center ${isCollapsed ? 'mt-6 mb-4' : 'mt-6 mb-6'}`}>
        {user ? (
          <Link
            href="/profile"
            className="relative group cursor-pointer flex flex-col items-center"
            title={isCollapsed ? (user.name || user.email) : undefined}
          >
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name || 'Profile'}
                className={`rounded-full border-2 border-emerald-500/40 group-hover:border-emerald-500 transition-all ${
                  isCollapsed ? 'w-10 h-10' : 'w-16 h-16'
                }`}
              />
            ) : (
              <div
                className={`bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-full flex items-center justify-center border-2 border-emerald-500/40 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all ${
                  isCollapsed ? 'w-10 h-10' : 'w-16 h-16'
                }`}
              >
                <span className={`text-white font-bold ${isCollapsed ? 'text-base' : 'text-2xl'}`}>
                  {getInitial()}
                </span>
              </div>
            )}
            
            {/* User name tooltip on hover when collapsed */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {user.name || user.email}
                </div>
              </div>
            )}
            
            {/* User name when expanded */}
            {!isCollapsed && (
              <div className="mt-3 text-center">
                <p className="text-white text-sm font-medium truncate max-w-[200px]">
                  {user.name || 'User'}
                </p>
                <p className="text-emerald-300/60 text-xs truncate max-w-[200px]">
                  {user.email}
                </p>
              </div>
            )}
          </Link>
        ) : (
          <div className={`bg-gray-700 rounded-full flex items-center justify-center animate-pulse ${
            isCollapsed ? 'w-10 h-10' : 'w-16 h-16'
          }`}>
            <User className={`text-gray-400 ${isCollapsed ? 'w-5 h-5' : 'w-8 h-8'}`} />
          </div>
        )}
      </div>

      {/* Divider */}
      {!isCollapsed && (
        <div className="mx-4 border-t border-emerald-500/20 mb-4"></div>
      )}

      {/* Menu */}
      <div className="flex flex-col gap-2 mt-4 px-2">
        {NavMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-lg text-white hover:bg-gradient-to-br from-black via-gray-900 to-black border border-gray-800 cursor-pointer transition-all duration-200 group ${
                isCollapsed ? "justify-center p-4" : "p-3"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {Icon && (
                <div
                  className={`${
                    isCollapsed ? "w-8 h-8 rounded-lg flex items-center justify-center" : ""
                  }`}
                >
                  <Icon
                    className={`text-white group-hover:text-white ${
                      isCollapsed ? "w-6 h-6" : "w-5 h-5"
                    }`}
                  />
                </div>
              )}
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </div>
          );
        })}
      </div>
    </nav>
  );
};
