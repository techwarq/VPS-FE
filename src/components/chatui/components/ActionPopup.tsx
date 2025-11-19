'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
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
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          />

          {/* Popup Container */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div className="pointer-events-auto relative rounded-3xl border border-emerald-500/30 backdrop-blur-2xl bg-gray-900/80 shadow-[0_8px_32px_0_rgba(16,185,129,0.2),inset_0_1px_0_0_rgba(255,255,255,0.1)] p-12 max-w-3xl w-full overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

              {/* Title */}
              <motion.h2
                variants={itemVariants}
                className="relative text-4xl md:text-5xl font-bold text-white text-center mb-12 tracking-tight"
              >
                {title}
              </motion.h2>

              {/* Buttons Grid */}
              <div className="relative flex flex-col items-center gap-6">
                {/* Top Row - Primary and Secondary Actions */}
                <div className="flex flex-wrap justify-center gap-6 w-full">
                  {/* Primary Button - Upload */}
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPrimaryAction}
                    className="group relative px-8 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-lg font-semibold hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 overflow-hidden min-w-[200px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center gap-3">
                      <Upload className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>{primaryLabel}</span>
                    </div>
                  </motion.button>

                  {/* Secondary Button - Generate (Primary Action) */}
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSecondaryAction}
                    className="group relative px-8 py-5 bg-emerald-600 border border-emerald-500 rounded-2xl text-white text-lg font-semibold hover:bg-emerald-500 transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.5)] overflow-hidden min-w-[200px]"
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
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onTertiaryAction}
                    className="group relative px-8 py-4 bg-transparent border border-white/10 rounded-xl text-gray-400 text-base font-medium hover:text-white hover:border-white/30 transition-all duration-300 min-w-[180px]"
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

