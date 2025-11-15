'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, ArrowRight } from 'lucide-react';

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
                  {/* Primary Button - Upload */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPrimaryAction}
                    className="group relative px-8 py-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-emerald-500/50 rounded-2xl text-white text-lg font-semibold hover:border-emerald-400/80 transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] overflow-hidden min-w-[200px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center gap-3">
                      <Upload className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>{primaryLabel}</span>
                    </div>
                  </motion.button>

                  {/* Secondary Button - Generate (Primary Action) */}
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSecondaryAction}
                    className="group relative px-8 py-5 bg-gradient-to-br from-emerald-600 to-emerald-500 border-2 border-emerald-400/60 rounded-2xl text-white text-lg font-semibold hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-[0_4px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_8px_35px_rgba(16,185,129,0.6)] overflow-hidden min-w-[200px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center gap-3">
                      <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                      <span>{secondaryLabel}</span>
                    </div>
                  </motion.button>
                </div>

                {/* Bottom Row - Tertiary Action (Optional) */}
                {showTertiary && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onTertiaryAction}
                    className="group relative px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white/80 text-base font-medium hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.3)] overflow-hidden min-w-[180px]"
                  >
                    <div className="relative flex items-center justify-center gap-2">
                      <span>{tertiaryLabel}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
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

