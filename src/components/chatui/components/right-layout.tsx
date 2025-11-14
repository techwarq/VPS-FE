'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Shrink, Maximize2 } from 'lucide-react';
import ImageGrid from './image-grid';
import ImageCarousel from './image-carroussel';
import { GeneratedModel } from '@/components/chatui/chatui'; // Import GeneratedModel interface

interface ModelPreviewProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  models?: GeneratedModel[]; // Changed images to models
  isLoading?: boolean;
}

export default function ModelPreview({ isMinimized, onToggleMinimize, models: propModels, isLoading = false }: ModelPreviewProps) {
  const [selectedModelIndex, setSelectedModelIndex] = useState(0); // New state for selected model
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0); // Existing state renamed
  
  // Use propModels if available, otherwise fallback to default
  const models = propModels && propModels.length > 0 ? propModels : [];

  // When models change, reset selected indices
  useEffect(() => {
    setSelectedModelIndex(0);
    setSelectedAngleIndex(0);
    if (propModels && propModels.length > 0) {
      console.log('ModelPreview received models:', propModels);
    }
  }, [propModels]);

  // Get the angles for the currently selected model
  const currentModelAngles = models[selectedModelIndex]?.angles || [];
  
  // Get a representative image for the grid (first angle's image of each model)
  const modelGridImages = models.map((model) => {
    // Try to find the first angle that has an image
    const firstImageAngle = model.angles.find(angle => angle.url);
    return {
      id: model.modelIndex, // Use modelIndex as ID for the grid item
      url: firstImageAngle?.url || '',
      // You can add more properties here if needed for the grid display (e.g., model characteristics)
    };
  }).filter(img => img.url);

  return (
    <motion.div
      className={`rounded-2xl border border-emerald-700 flex flex-col bg-black relative overflow-hidden ${
        isMinimized 
          ? 'fixed top-4 right-4 w-80 h-20 z-50' 
          : 'h-full'
      }`}
      initial={false}
      animate={{
        width: isMinimized ? '320px' : '100%',
        height: isMinimized ? '80px' : '100%',
        top: isMinimized ? '16px' : 'auto',
        right: isMinimized ? '16px' : 'auto',
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className={`flex items-center justify-between relative z-20 ${isMinimized ? 'p-4 mb-0' : 'p-6 mb-6'}`}>
        <motion.h2
          className='text-2xl font-bold text-emerald-400'
          animate={{
            fontSize: isMinimized ? '16px' : '24px',
          }}
          transition={{ duration: 0.3 }}
        >
          Photoshoot Review
        </motion.h2>
        <motion.button
          onClick={onToggleMinimize}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer"
        >
          {isMinimized ? (
            <Maximize2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Shrink className="w-6 h-6 text-emerald-400" />
          )}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col px-6 pb-6"
          >
            {isLoading ? (
              /* Loading State */
              <div className="flex-1 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-emerald-400 text-lg font-semibold">Generating your avatars...</p>
                  <p className="text-white/60 text-sm mt-2">This may take a few moments</p>
                </motion.div>
              </div>
            ) : (
              <>
                {/* Carousel - takes remaining space but leaves room for grid */}
                <div className='flex-1 relative mb-[22%] min-h-0'>
                  <ImageCarousel 
                    images={currentModelAngles}
                    currentIndex={selectedAngleIndex}
                    setCurrentIndex={setSelectedAngleIndex}
                  />
                </div>
                
                {/* Grid - absolutely positioned at bottom */}
                <ImageGrid 
                  images={modelGridImages}
                  selectedIndex={selectedModelIndex}
                  onImageSelect={setSelectedModelIndex}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}