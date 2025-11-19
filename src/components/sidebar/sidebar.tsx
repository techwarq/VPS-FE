'use client';

import { NavMenuItems } from "@/utils/constants";
import Link from "next/link";
import Image from "next/image";
import { PanelRight, User, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.nav
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 280,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }}
      className="h-full flex flex-col bg-black/40 backdrop-blur-xl border-r border-white/10 relative z-40 overflow-hidden"
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

      {/* Close / Collapse Button */}
      {onClose && (
        <motion.button
          onClick={onClose}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <PanelRight className="w-5 h-5" />
          </motion.div>

          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 px-3 py-1.5 bg-gray-900/90 backdrop-blur-md text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap border border-white/10"
              >
                {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                <div className="absolute right-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900/90 rotate-45 border-r border-t border-white/10"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}

      {/* Header */}
      <div className="flex items-center justify-center mt-8 mb-8 h-12 relative">
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
            >
              <span className="text-white font-bold text-lg">T</span>
            </motion.div>
          ) : (
            <motion.div
              key="expanded-logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Link
                className="flex items-center justify-center hover:opacity-80 transition-opacity"
                href="/"
              >
                <Image
                  src="/logo3.png"
                  alt="Tiska Logo"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Profile */}
      <div className={`flex justify-center transition-all duration-300 ${isCollapsed ? 'mb-6' : 'mb-8'}`}>
        {user ? (
          <Link
            href="/profile"
            className="relative group cursor-pointer flex flex-col items-center"
          >
            <motion.div
              layout
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              {/* Glowing ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-0 group-hover:opacity-70 blur transition duration-500" />

              {user.profilePicture ? (
                <motion.img
                  layoutId="profile-img"
                  src={user.profilePicture}
                  alt={user.name || 'Profile'}
                  className={`relative rounded-full border-2 border-white/10 object-cover bg-black ${isCollapsed ? 'w-12 h-12' : 'w-20 h-20'
                    }`}
                />
              ) : (
                <motion.div
                  layoutId="profile-img"
                  className={`relative bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border-2 border-white/10 ${isCollapsed ? 'w-12 h-12' : 'w-20 h-20'
                    }`}
                >
                  <span className={`text-emerald-400 font-bold ${isCollapsed ? 'text-lg' : 'text-2xl'}`}>
                    {getInitial()}
                  </span>
                </motion.div>
              )}

              {/* Status indicator */}
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full" />
            </motion.div>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 text-center"
                >
                  <p className="text-white font-medium truncate max-w-[200px]">
                    {user.name || 'User'}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <p className="text-emerald-400/70 text-xs font-medium">
                      Creative Pro
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                <div className="bg-gray-900/90 backdrop-blur-md text-white text-sm px-3 py-1.5 rounded-lg shadow-xl border border-white/10 whitespace-nowrap">
                  <p className="font-medium">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            )}
          </Link>
        ) : (
          <div className={`bg-white/5 rounded-full flex items-center justify-center animate-pulse ${isCollapsed ? 'w-12 h-12' : 'w-20 h-20'
            }`}>
            <User className="text-gray-600 w-1/2 h-1/2" />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

      {/* Menu */}
      <div className="flex flex-col gap-2 px-3 flex-1 overflow-y-auto custom-scrollbar">
        {NavMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href || '#'}
              className="relative group"
            >
              <div
                className={`flex items-center gap-3 rounded-xl transition-all duration-300 group-hover:bg-white/5 ${isCollapsed ? "justify-center p-3" : "px-4 py-3"
                  }`}
              >
                {/* Active indicator background (optional logic can be added here) */}

                {Icon && (
                  <div className={`relative z-10 text-gray-400 group-hover:text-emerald-400 transition-colors duration-300`}>
                    <Icon className={isCollapsed ? "w-6 h-6" : "w-5 h-5"} />
                  </div>
                )}

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex-1 overflow-hidden whitespace-nowrap"
                    >
                      <span className="text-gray-300 group-hover:text-white font-medium transition-colors ml-1">
                        {item.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hover arrow */}
                {!isCollapsed && (
                  <ChevronRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                )}
              </div>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  <div className="bg-gray-900/90 backdrop-blur-md text-white text-sm px-3 py-1.5 rounded-lg shadow-xl border border-white/10 whitespace-nowrap flex items-center gap-2">
                    <span>{item.label}</span>
                    <ChevronRight className="w-3 h-3 text-emerald-500" />
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer area (optional) */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 mt-auto"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/10 to-black/50 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-emerald-400">Pro Plan</span>
              <span className="text-xs text-gray-500">Active</span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            </div>
            <p className="text-xs text-gray-500 mt-2">750 / 1000 credits used</p>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
