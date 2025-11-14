
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ImageGrid() {
  const [selectedImage, setSelectedImage] = useState(0);
  
  const images = [
    { id: 1, url: 'https://i.pinimg.com/1200x/64/f1/68/64f16895a20a3ee2e4bbcbe3a3343057.jpg' },
    { id: 2, url: 'https://i.pinimg.com/1200x/0f/5a/0f/0f5a0f471e36cf19524d435b31f84624.jpg' },
    { id: 3, url: 'https://i.pinimg.com/736x/06/1e/0f/061e0f4d77fa2e91fe7022f5a44a3ff8.jpg' },
    { id: 4, url: 'https://i.pinimg.com/1200x/68/fc/a4/68fca438ce1dd7a2310deeb35d92a51e.jpg' },
  ];

  return (
    <div className='absolute bottom-5 left-6 right-6 h-[20%] rounded-2xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 shadow-[0_8px_32px_0_rgba(16,185,129,0.2),inset_0_1px_0_0_rgba(255,255,255,0.3)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none p-4'>
      
      <div className='relative z-10 h-full flex gap-3'>
        {images.map((image, idx) => (
          <motion.div
            key={image.id}
            onClick={() => setSelectedImage(idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
              selectedImage === idx
                ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'border-white/20 hover:border-emerald-500/50'
            }`}
          >
            <img 
              src={image.url} 
              alt={`Image ${idx + 1}`}
              className='w-full h-full object-cover'
            />
          </motion.div>
        ))}
      </div>

    </div>
  );
}