'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: Array<{ id: number; url: string }>;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export default function ImageCarousel({ images, currentIndex, setCurrentIndex }: ImageCarouselProps) {
  // Ensure currentIndex is within bounds
  const safeIndex = images.length > 0 ? Math.max(0, Math.min(currentIndex, images.length - 1)) : 0;
  const currentImage = images[safeIndex];

  // Update currentIndex if it was out of bounds
  useEffect(() => {
    if (images.length > 0 && currentIndex !== safeIndex) {
      setCurrentIndex(safeIndex);
    }
  }, [images.length, currentIndex, safeIndex, setCurrentIndex]);

  const goToNext = () => {
    if (images.length > 0) {
      setCurrentIndex((safeIndex + 1) % images.length);
    }
  };

  const goToPrevious = () => {
    if (images.length > 0) {
      setCurrentIndex((safeIndex - 1 + images.length) % images.length);
    }
  };

  // Show empty state if no images
  if (!images || images.length === 0 || !currentImage) {
    return (
      <div className='relative rounded-xl overflow-hidden border border-emerald-700/40 bg-gradient-to-br from-emerald-950/30 to-black/50 h-full flex items-center justify-center'>
        <div className='text-center text-white/60'>
          <p className='text-lg font-semibold'>No images available</p>
          <p className='text-sm mt-2'>Images will appear here once generated</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative rounded-xl overflow-hidden border border-emerald-700/40 bg-gradient-to-br from-emerald-950/30 to-black/50 h-full flex items-center justify-center'>
      {/* Main Image Display */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={safeIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className='absolute inset-0 flex items-center justify-center'
        >
          <img 
            src={currentImage.url} 
            alt={`Slide ${safeIndex + 1}`}
            className='max-w-full max-h-full w-auto h-auto object-contain'
          />
          {/* Gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none'></div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrevious}
            className='absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full backdrop-blur-xl bg-black/40 border border-white/20 hover:bg-black/60 transition-all'
          >
            <ChevronLeft className='w-6 h-6 text-white' />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNext}
            className='absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full backdrop-blur-xl bg-black/40 border border-white/20 hover:bg-black/60 transition-all'
          >
            <ChevronRight className='w-6 h-6 text-white' />
          </motion.button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2'>
          {images.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              whileHover={{ scale: 1.2 }}
              className={`h-2 rounded-full transition-all ${
                idx === safeIndex 
                  ? 'w-8 bg-emerald-400' 
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className='absolute top-6 right-6 z-10 px-4 py-2 rounded-full backdrop-blur-xl bg-black/40 border border-white/20'>
        <span className='text-white text-sm font-semibold'>
          {safeIndex + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}