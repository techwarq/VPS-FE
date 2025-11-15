'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image } from 'lucide-react';

interface UploaderProps {
  isOpen?: boolean;
  onClose?: () => void;
  onFilesUploaded?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  className?: string;
  showButtons?: boolean;
}

export default function Uploader({ 
  isOpen = true, 
  onClose, 
  onFilesUploaded,
  multiple = true,
  accept = 'image/*',
  className = '',
  showButtons = true
}: UploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    if (onFilesUploaded) {
      onFilesUploaded(fileArray);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const uploadContent = (
    <>
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 mb-6 transition-all ${
          isDragging
            ? 'border-emerald-400 bg-emerald-500/10'
            : 'border-white/30 hover:border-emerald-500/50'
        }`}
      >
        <div className='flex flex-col items-center gap-4'>
          <div className='p-4 rounded-full bg-emerald-500/20'>
            <Image className='w-8 h-8 text-emerald-400' />
          </div>
          <div className='text-center'>
            <p className='text-white font-semibold mb-1'>
              Drag & drop images here
            </p>
            <p className='text-emerald-300/60 text-sm'>
              or click to browse
            </p>
          </div>
          <label className='px-6 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all text-sm font-medium cursor-pointer'>
            <input
              type="file"
              multiple={multiple}
              accept={accept}
              onChange={handleFileInputChange}
              className="hidden"
            />
            Browse Files
          </label>
        </div>
      </div>

      {/* Info */}
      <p className='text-emerald-300/60 text-xs text-center mb-4'>
        Supports: JPG, PNG, WebP • Max 10MB per file
      </p>
    </>
  );

  // If used as modal (with isOpen and onClose)
  if (onClose) {
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
              className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[500px] rounded-2xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 shadow-[0_8px_32px_0_rgba(16,185,129,0.2),inset_0_1px_0_0_rgba(255,255,255,0.3)] p-6'
            >
              {/* Header */}
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-xl font-bold text-white flex items-center gap-2'>
                  <Upload className='w-5 h-5 text-emerald-400' />
                  Upload Images
                </h3>
                <button
                  onClick={onClose}
                  className='p-2 rounded-lg hover:bg-white/10 transition-colors'
                >
                  <X className='w-5 h-5 text-white' />
                </button>
              </div>

              {uploadContent}

              {/* Buttons */}
              {showButtons && (
                <div className='flex gap-3'>
                  <button
                    onClick={onClose}
                    className='flex-1 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/15 transition-all font-medium'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onClose}
                    className='flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all font-medium shadow-[0_4px_20px_rgba(16,185,129,0.3)]'
                  >
                    Upload
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // If used as inline component (without modal)
  return (
    <div className={className}>
      {uploadContent}
    </div>
  );
}
