'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Image as ImageIcon } from 'lucide-react';

interface UploadedImage {
  id: number;
  url: string;
  name: string;
}

interface UploadedGridProps {
  isOpen: boolean;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  uploadedImages?: UploadedImage[];
  onRemoveImage?: (id: number) => void;
  onModelSelect?: (imageId: number) => void;
}

export default function UploadedGrid({ 
  isOpen, 
  isMaximized, 
  onToggleMaximize,
  uploadedImages = [],
  onRemoveImage,
  onModelSelect
}: UploadedGridProps) {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`rounded-2xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 shadow-[0_8px_32px_0_rgba(16,185,129,0.2),inset_0_1px_0_0_rgba(255,255,255,0.3)] flex flex-col overflow-hidden ${
        isMaximized ? 'h-full' : 'h-[300px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">
            Uploaded Images
            {uploadedImages.length > 0 && (
              <span className="ml-2 text-sm font-normal text-emerald-300/60">
                ({uploadedImages.length})
              </span>
            )}
          </h3>
        </div>
        <motion.button
          onClick={onToggleMaximize}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isMaximized ? (
            <Minimize2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Maximize2 className="w-5 h-5 text-emerald-400" />
          )}
        </motion.button>
      </div>

      {/* Images Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {uploadedImages.length === 0 ? (
          // Empty State
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-emerald-500/20 mb-4">
              <ImageIcon className="w-8 h-8 text-emerald-400/50" />
            </div>
            <p className="text-white/60 text-sm">No images uploaded yet</p>
            <p className="text-emerald-300/40 text-xs mt-1">
              Click the + icon to upload images
            </p>
          </div>
        ) : (
          // Grid of Images
          <div className={`grid gap-4 ${
            isMaximized 
              ? 'grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-2'
          }`}>
            <AnimatePresence>
              {uploadedImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    const newSelectedId = selectedImageId === image.id ? null : image.id;
                    setSelectedImageId(newSelectedId);
                    // Call onModelSelect when an image is clicked
                    if (newSelectedId !== null && onModelSelect) {
                      onModelSelect(newSelectedId);
                    }
                  }}
                  className="relative group"
                >
                  {/* Image Container */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                      selectedImageId === image.id
                        ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                        : 'border-white/20 hover:border-emerald-500/50'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-xs truncate px-2 max-w-full">
                        {image.name}
                      </div>
                    </div>
                  </motion.div>

                  {/* Remove Button */}
                  {onRemoveImage && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveImage(image.id);
                      }}
                      className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X className="w-3 h-3 text-white" />
                    </motion.button>
                  )}

                  {/* Selected Indicator */}
                  {selectedImageId === image.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 left-2 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center z-10"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer with info */}
      {uploadedImages.length > 0 && (
        <div className="p-3 border-t border-emerald-500/20 bg-black/20">
          <p className="text-emerald-300/60 text-xs text-center">
            Click image to select • Hover to remove
          </p>
        </div>
      )}
    </motion.div>
  );
}