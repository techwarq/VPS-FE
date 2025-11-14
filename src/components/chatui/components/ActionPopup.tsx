'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionPopupProps {
  isOpen: boolean;
  title: string;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  tertiaryLabel?: string;
  showTertiary?: boolean;
}

export default function ActionPopup({
  isOpen,
  title,
  onClose,
  onPrimaryAction,
  onSecondaryAction,
  onTertiaryAction,
  primaryLabel = 'upload ur owns',
  secondaryLabel = 'generate',
  tertiaryLabel = 'proceed',
  showTertiary = true,
}: ActionPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="relative rounded-3xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 shadow-[0_8px_32px_0_rgba(16,185,129,0.2),inset_0_1px_0_0_rgba(255,255,255,0.3)] p-12 max-w-3xl w-full">
              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
              >
                {title}
              </motion.h2>

              {/* Buttons Grid */}
              <div className="flex flex-col items-center gap-6">
                {/* Top Row - Primary and Secondary Actions */}
                <div className="flex flex-wrap justify-center gap-6 w-full">
                  {/* Primary Button */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onPrimaryAction}
                    className="px-12 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/40 rounded-2xl text-white text-xl font-medium hover:border-emerald-400/60 transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
                  >
                    {primaryLabel}
                  </motion.button>

                  {/* Secondary Button */}
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSecondaryAction}
                    className="px-12 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/40 rounded-2xl text-white text-xl font-medium hover:border-emerald-400/60 transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
                  >
                    {secondaryLabel}
                  </motion.button>
                </div>

                {/* Bottom Row - Tertiary Action (Optional) */}
                {showTertiary && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onTertiaryAction}
                    className="px-12 py-4 bg-white/10 backdrop-blur-sm border border-emerald-500/40 rounded-2xl text-white text-xl font-medium hover:border-emerald-400/60 transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
                  >
                    {tertiaryLabel}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

