
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ImageGridImage {
  id: number | string;
  url: string;
}

interface ImageGridProps {
  images?: ImageGridImage[];
  selectedIndex?: number;
  onImageSelect?: (index: number) => void;
}

export default function ImageGrid({ 
  images = [], 
  selectedIndex = 0, 
  onImageSelect 
}: ImageGridProps) {
  // If no images provided, show empty state
  if (images.length === 0) {
    return (
      <div className='absolute bottom-5 left-6 right-6 h-[20%] rounded-2xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 shadow-[0_8px_32px_0_rgba(16,185,129,0.2),inset_0_1px_0_0_rgba(255,255,255,0.3)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none p-4'>
        <div className='relative z-10 h-full flex items-center justify-center'>
          <p className='text-emerald-400/60 text-sm'>No models available</p>
        </div>
      </div>
    );
  }

  // Determine grid layout based on number of images
  const getGridLayout = () => {
    if (images.length === 1) {
      return 'justify-start items-center'; // Left align, center vertically for single model
    } else if (images.length === 2) {
      return 'justify-start'; // Left align for 2 models
    } else if (images.length === 3) {
      return 'justify-start'; // Left align for 3 models
    } else {
      return 'justify-between'; // Spread out for 4+ models
    }
  };

  // Determine item sizing based on number of images
  const getItemClasses = (index: number) => {
    if (images.length === 1) {
      return 'w-auto h-full'; // Auto width, full height for single model
    } else if (images.length === 2) {
      return 'flex-1 max-w-[calc(50%-6px)] h-full'; // Flexible with max constraint for 2 models
    } else if (images.length === 3) {
      return 'flex-1 max-w-[calc(33.333%-8px)] h-full'; // Flexible with max constraint for 3 models
    } else {
      return 'flex-1 h-full'; // Fully flexible for 4+ models
    }
  };

  return (
    <div className='absolute bottom-5 left-6 right-6 h-[20%] rounded-2xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 shadow-[0_8px_32px_0_rgba(16,185,129,0.2),inset_0_1px_0_0_rgba(255,255,255,0.3)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none p-4'>
      
      <div className={`relative z-10 h-full flex gap-3 ${getGridLayout()}`}>
        {images.map((image, idx) => (
          <motion.div
            key={image.id || idx}
            onClick={() => onImageSelect?.(idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${getItemClasses(idx)} rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
              selectedIndex === idx
                ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'border-white/20 hover:border-emerald-500/50'
            }`}
            style={{
              aspectRatio: images.length === 1 ? '3/4' : undefined, // Maintain portrait aspect ratio for single model
              minWidth: images.length === 1 ? '120px' : undefined, // Minimum width for single model
              maxWidth: images.length === 1 ? '180px' : undefined // Maximum width for single model
            }}
          >
            <img 
              src={image.url} 
              alt={`Model ${idx + 1}`}
              className='w-full h-full object-cover'
              onError={(e) => {
                console.error('Failed to load image:', image.url);
                // Optionally show a placeholder
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.div>
        ))}
      </div>

    </div>
  );
}