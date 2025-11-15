'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Upload, Image as ImageIcon, Trash2, Plus, Check, ArrowRight } from 'lucide-react';
import { GeneratedModel } from '@/components/chatui/chatui';
import { useVPSAPI } from '@/components/hooks/use-vps-api';
import Uploader from './uploader';

interface TryonPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: TryonFormData) => void;
  onContinueInChat?: () => void;
  generatedModels?: GeneratedModel[];
}

export interface Garment {
  id: string;
  url: string;
  label: string;
  file?: File;
}

export interface AvatarGarmentAssignment {
  avatarIndex: number;
  garmentIds: string[];
}

export interface TryonFormData {
  selectedAvatarIndices: number[]; // Allow multiple avatars
  selectedAvatars: GeneratedModel[]; // Array of selected avatars
  selectedGarments: Garment[];
  garmentAssignments: AvatarGarmentAssignment[]; // Which garments are assigned to which avatars
  aspect_ratio?: string;
  style?: string;
  negative_prompt?: string;
}

export default function TryonPopup({
  isOpen,
  onClose,
  onSubmit,
  onContinueInChat,
  generatedModels = [],
}: TryonPopupProps) {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [selectedAvatarIndices, setSelectedAvatarIndices] = useState<number[]>([]);
  const [garmentAssignments, setGarmentAssignments] = useState<Map<number, string[]>>(new Map()); // avatarIndex -> garmentIds[]
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedGarmentId, setDraggedGarmentId] = useState<string | null>(null);
  const [dragOverAvatarIndex, setDragOverAvatarIndex] = useState<number | null>(null);
  const { uploadGarments } = useVPSAPI();

  // Reset selected avatars when models change
  useEffect(() => {
    if (generatedModels.length > 0 && selectedAvatarIndices.length === 0) {
      setSelectedAvatarIndices([0]); // Select first avatar by default
    }
  }, [generatedModels, selectedAvatarIndices.length]);

  const handleFileSelect = async (files: File[] | FileList | null) => {
    if (!files || (Array.isArray(files) ? files.length === 0 : files.length === 0)) return;

    setIsUploading(true);
    try {
      const fileArray = Array.isArray(files) ? files : Array.from(files);
      const uploadResult = await uploadGarments(fileArray);
      
      if (uploadResult.success && uploadResult.uploaded) {
        const newGarments: Garment[] = uploadResult.uploaded.map((uploaded, index) => ({
          id: `garment-${Date.now()}-${index}`,
          url: uploaded.url,
          label: uploaded.name || `Garment ${garments.length + index + 1}`,
        }));
        setGarments(prev => [...prev, ...newGarments]);
      }
    } catch (error) {
      console.error('Failed to upload garments:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleRemoveGarment = (id: string) => {
    setGarments(prev => prev.filter(g => g.id !== id));
  };

  const handleGarmentLabelChange = (id: string, label: string) => {
    setGarments(prev => prev.map(g => g.id === id ? { ...g, label } : g));
  };

  const handleAvatarToggle = (index: number) => {
    setSelectedAvatarIndices(prev => {
      if (prev.includes(index)) {
        // Remove avatar and its garment assignments
        setGarmentAssignments(prevAssignments => {
          const newAssignments = new Map(prevAssignments);
          newAssignments.delete(index);
          return newAssignments;
        });
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const toggleGarmentAssignment = (avatarIndex: number, garmentId: string) => {
    setGarmentAssignments(prev => {
      const newAssignments = new Map(prev);
      const currentGarments = newAssignments.get(avatarIndex) || [];
      
      if (currentGarments.includes(garmentId)) {
        // Remove garment from avatar
        newAssignments.set(avatarIndex, currentGarments.filter(id => id !== garmentId));
      } else {
        // Add garment to avatar
        newAssignments.set(avatarIndex, [...currentGarments, garmentId]);
      }
      
      return newAssignments;
    });
  };

  const handleGarmentDragStart = (garmentId: string) => {
    setDraggedGarmentId(garmentId);
  };

  const handleGarmentDragEnd = () => {
    setDraggedGarmentId(null);
  };

  const handleAvatarDrop = (avatarIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedGarmentId) {
      toggleGarmentAssignment(avatarIndex, draggedGarmentId);
      setDraggedGarmentId(null);
    }
  };

  const handleAvatarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getAssignedGarments = (avatarIndex: number): Garment[] => {
    const garmentIds = garmentAssignments.get(avatarIndex) || [];
    return garments.filter(g => garmentIds.includes(g.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedAvatarIndices.length === 0) {
      alert('Please select at least one avatar');
      return;
    }

    if (garments.length === 0) {
      alert('Please upload at least one garment');
      return;
    }

    // Check if each selected avatar has at least one garment assigned
    const avatarsWithoutGarments = selectedAvatarIndices.filter(
      index => !garmentAssignments.get(index) || garmentAssignments.get(index)!.length === 0
    );

    if (avatarsWithoutGarments.length > 0) {
      alert('Please assign at least one garment to each selected avatar');
      return;
    }

    if (onSubmit) {
      const selectedAvatars = selectedAvatarIndices
        .map(index => generatedModels[index])
        .filter(Boolean);
      
      const assignments: AvatarGarmentAssignment[] = selectedAvatarIndices.map(index => ({
        avatarIndex: index,
        garmentIds: garmentAssignments.get(index) || [],
      }));
      
      onSubmit({
        selectedAvatarIndices,
        selectedAvatars,
        selectedGarments: garments,
        garmentAssignments: assignments,
      });
    }
    onClose();
  };

  const handleContinueInChat = () => {
    if (onContinueInChat) {
      onContinueInChat();
    }
    onClose();
  };

  // Get first image URL for each model
  const getModelPreviewUrl = (model: GeneratedModel): string => {
    const firstAngle = model.angles.find(angle => angle.url) || model.angles[0];
    return firstAngle?.url || '';
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-3xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 shadow-[0_8px_32px_0_rgba(16,185,129,0.2),inset_0_1px_0_0_rgba(255,255,255,0.3)] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex items-center justify-center gap-3 mb-8"
              >
                <Sparkles className="w-8 h-8 text-emerald-400" />
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
                  Try On Garments
                </h2>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Selection Grid */}
                {generatedModels.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="block text-sm font-medium text-emerald-300 mb-3">
                      Select Avatar
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {generatedModels.map((model, index) => {
                        const previewUrl = getModelPreviewUrl(model);
                        const isSelected = selectedAvatarIndices.includes(index);
                        return (
                          <motion.button
                            key={`avatar-select-${index}-${model.modelIndex}`}
                            type="button"
                            onClick={() => handleAvatarToggle(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                              isSelected
                                ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                                : 'border-emerald-500/30 hover:border-emerald-500/60'
                            }`}
                          >
                            {previewUrl ? (
                              <img
                                src={previewUrl}
                                alt={`Model ${index + 1}`}
                                className="w-full h-48 object-cover"
                              />
                            ) : (
                              <div className="w-full h-48 bg-slate-700/50 flex items-center justify-center">
                                <ImageIcon className="w-12 h-12 text-emerald-400/50" />
                              </div>
                            )}
                            {isSelected && (
                              <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                  <Sparkles className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-xs font-medium text-center">
                              Model {index + 1} ({model.angles.length} angles)
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    {selectedAvatarIndices.length > 0 && (
                      <p className="text-emerald-300/60 text-sm mt-2">
                        {selectedAvatarIndices.length} avatar{selectedAvatarIndices.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Garment Upload Section - Using Uploader Component */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-emerald-300 mb-3">
                    Upload Garments
                  </label>
                  
                  {/* Use Uploader Component */}
                  <Uploader
                    onFilesUploaded={handleFileSelect}
                    multiple={true}
                    accept="image/*"
                    className="mb-4"
                    showButtons={false}
                  />

                  {/* Uploaded Garments List */}
                  {garments.length > 0 && (
                    <div className="space-y-3 mt-4">
                      <h3 className="text-sm font-medium text-emerald-300">
                        Uploaded Garments ({garments.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {garments.map((garment) => (
                          <motion.div
                            key={garment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            draggable
                            onDragStart={() => handleGarmentDragStart(garment.id)}
                            onDragEnd={handleGarmentDragEnd}
                            className="relative p-3 rounded-xl bg-white/5 border border-emerald-500/30 cursor-move hover:border-emerald-400/60 transition-all"
                          >
                            <img
                              src={garment.url}
                              alt={garment.label}
                              className="w-full h-32 object-cover rounded-lg mb-2"
                            />
                            <input
                              type="text"
                              value={garment.label}
                              onChange={(e) => handleGarmentLabelChange(garment.id, e.target.value)}
                              className="w-full px-2 py-1 text-xs rounded-lg bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/60 transition-all"
                              placeholder="Enter garment label..."
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveGarment(garment.id)}
                              className="absolute top-2 right-2 p-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                            <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 text-white text-xs">
                              Drag to match
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Matching Box - Drag garments to avatars */}
                {selectedAvatarIndices.length > 0 && garments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-4 p-4 rounded-xl bg-white/5 border-2 border-emerald-500/30"
                  >
                    <label className="block text-sm font-medium text-emerald-300 mb-3">
                      Match Garments to Avatars
                    </label>
                    <p className="text-emerald-300/60 text-xs mb-4">
                      Drag garments from above and drop them on avatars below
                    </p>
                    
                    <div className="space-y-4">
                      {selectedAvatarIndices.map((avatarIndex) => {
                        const model = generatedModels[avatarIndex];
                        const previewUrl = getModelPreviewUrl(model);
                        const assignedGarments = getAssignedGarments(avatarIndex);
                        const isDragOver = dragOverAvatarIndex === avatarIndex;
                        
                        return (
                          <motion.div
                            key={`avatar-match-${avatarIndex}-${model?.modelIndex || avatarIndex}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOverAvatarIndex(null);
                              handleAvatarDrop(avatarIndex, e);
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOverAvatarIndex(avatarIndex);
                            }}
                            onDragLeave={() => setDragOverAvatarIndex(null)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              isDragOver
                                ? 'border-emerald-400 bg-emerald-500/20'
                                : 'border-emerald-500/30 bg-white/5'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              {/* Avatar Preview */}
                              <div className="relative flex-shrink-0">
                                {previewUrl ? (
                                  <img
                                    src={previewUrl}
                                    alt={`Model ${avatarIndex + 1}`}
                                    className="w-20 h-28 object-cover rounded-lg border-2 border-emerald-500/40"
                                  />
                                ) : (
                                  <div className="w-20 h-28 bg-slate-700/50 rounded-lg flex items-center justify-center border-2 border-emerald-500/40">
                                    <ImageIcon className="w-8 h-8 text-emerald-400/50" />
                                  </div>
                                )}
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                                  {avatarIndex + 1}
                                </div>
                              </div>
                              
                              {/* Assigned Garments */}
                              <div className="flex-1">
                                <h4 className="text-white font-semibold mb-2 text-sm">
                                  Model {avatarIndex + 1}
                                </h4>
                                <div className="flex flex-wrap gap-2 min-h-[80px] p-2 rounded-lg bg-black/20 border border-emerald-500/20">
                                  {assignedGarments.length > 0 ? (
                                    assignedGarments.map((garment) => (
                                      <motion.div
                                        key={garment.id}
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="relative group"
                                      >
                                        <img
                                          src={garment.url}
                                          alt={garment.label}
                                          className="w-16 h-16 object-cover rounded border-2 border-emerald-400"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => toggleGarmentAssignment(avatarIndex, garment.id)}
                                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3 text-white" />
                                        </button>
                                        <p className="text-xs text-white mt-1 truncate w-16 text-center">
                                          {garment.label}
                                        </p>
                                      </motion.div>
                                    ))
                                  ) : (
                                    <div className="flex items-center justify-center w-full h-full text-emerald-300/40 text-xs">
                                      Drop garments here
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
                >
                  {/* Continue in Chat Link */}
                  <button
                    type="button"
                    onClick={handleContinueInChat}
                    className="text-emerald-300/80 hover:text-emerald-300 text-sm underline transition-colors"
                  >
                    Want to continue in the chat?
                  </button>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={selectedAvatarIndices.length === 0 || garments.length === 0 || isUploading}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.5)] flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Try-On
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
