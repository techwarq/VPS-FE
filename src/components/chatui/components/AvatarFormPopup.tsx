'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface AvatarFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: AvatarFormData) => void;
  onContinueInChat?: () => void;
}

export interface ModelCharacteristics {
  description: string;
  gender: string;
  hairstyle: string;
  ethnicity: string;
  age: string;
  bodyType: string;
}

export interface AvatarFormData {
  numModels: number;
  models: ModelCharacteristics[];
  style: string;
  background: string;
  aspect_ratio: string;
  framing: string;
}

export default function AvatarFormPopup({
  isOpen,
  onClose,
  onSubmit,
  onContinueInChat,
}: AvatarFormPopupProps) {
  const [numModels, setNumModels] = useState(1);
  const [modelsData, setModelsData] = useState<ModelCharacteristics[]>([{
    description: '',
    gender: '',
    hairstyle: '',
    ethnicity: '',
    age: '',
    bodyType: '',
  }]);
  const [globalSettings, setGlobalSettings] = useState({
    style: '',
    background: '',
    aspect_ratio: '',
    framing: '',
  });

  useEffect(() => {
    // Adjust modelsData array size when numModels changes
    setModelsData(prevModels => {
      const newModels = Array.from({ length: numModels }, (_, i) => {
        return prevModels[i] || {
          description: '',
          gender: '',
          hairstyle: '',
          ethnicity: '',
          age: '',
          bodyType: '',
        };
      });
      return newModels;
    });
  }, [numModels]);

  const handleModelChange = (index: number, field: keyof ModelCharacteristics, value: string) => {
    setModelsData(prevModels => {
      const newModels = [...prevModels];
      newModels[index] = { ...newModels[index], [field]: value };
      return newModels;
    });
  };

  const handleGlobalSettingChange = (field: keyof typeof globalSettings, value: string) => {
    setGlobalSettings(prevSettings => ({ ...prevSettings, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        numModels,
        models: modelsData,
        ...globalSettings,
      });
    }
    onClose();
  };

  const handleNumModelsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setNumModels(isNaN(value) || value < 1 ? 1 : value);
  };

  const handleContinueInChat = () => {
    if (onContinueInChat) {
      onContinueInChat();
    }
    onClose();
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
            <div className="relative rounded-3xl border border-emerald-600/45 backdrop-blur-2xl bg-gradient-to-br from-white/15 via-emerald-500/5 to-white/10 shadow-[0_8px_32px_0_rgba(16,185,129,0.2),inset_0_1px_0_0_rgba(255,255,255,0.3)] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  Generate Avatar
                </h2>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Number of Models */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block text-sm font-medium text-emerald-300 mb-2">
                    Number of Models
                  </label>
                  <input
                    type="number"
                    value={numModels}
                    onChange={handleNumModelsChange}
                    min="1"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/60 transition-all"
                  />
                </motion.div>

                {/* Model Characteristics Forms */}
                {modelsData.map((model, modelIndex) => (
                  <div key={modelIndex} className="space-y-5 border-t border-emerald-500/30 pt-5 mt-5">
                    <h3 className="text-xl font-semibold text-emerald-400">Model {modelIndex + 1}</h3>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + modelIndex * 0.1 }}
                    >
                      <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={model.description}
                        onChange={(e) => handleModelChange(modelIndex, 'description', e.target.value)}
                        placeholder="Describe your ideal avatar..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/60 transition-all resize-none"
                      />
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + modelIndex * 0.1 }}
                      >
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                          Gender
                        </label>
                        <select
                          value={model.gender}
                          onChange={(e) => handleModelChange(modelIndex, 'gender', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white focus:outline-none focus:border-emerald-400/60 transition-all"
                        >
                          <option value="" className="bg-slate-900">Select...</option>
                          <option value="male" className="bg-slate-900">Male</option>
                          <option value="female" className="bg-slate-900">Female</option>
                          <option value="non-binary" className="bg-slate-900">Non-binary</option>
                          <option value="other" className="bg-slate-900">Other</option>
                        </select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + modelIndex * 0.1 }}
                      >
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                          Age Range
                        </label>
                        <select
                          value={model.age}
                          onChange={(e) => handleModelChange(modelIndex, 'age', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white focus:outline-none focus:border-emerald-400/60 transition-all"
                        >
                          <option value="" className="bg-slate-900">Select...</option>
                          <option value="18-25" className="bg-slate-900">18-25</option>
                          <option value="26-35" className="bg-slate-900">26-35</option>
                          <option value="36-45" className="bg-slate-900">36-45</option>
                          <option value="46-55" className="bg-slate-900">46-55</option>
                          <option value="56+" className="bg-slate-900">56+</option>
                        </select>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + modelIndex * 0.1 }}
                    >
                      <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Hairstyle
                      </label>
                      <input
                        type="text"
                        value={model.hairstyle}
                        onChange={(e) => handleModelChange(modelIndex, 'hairstyle', e.target.value)}
                        placeholder="e.g., Long curly, Short fade, Bob cut..."
                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/60 transition-all"
                      />
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + modelIndex * 0.1 }}
                      >
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                          Ethnicity
                        </label>
                        <input
                          type="text"
                          value={model.ethnicity}
                          onChange={(e) => handleModelChange(modelIndex, 'ethnicity', e.target.value)}
                          placeholder="e.g., Asian, European..."
                          className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/60 transition-all"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + modelIndex * 0.1 }}
                      >
                        <label className="block text-sm font-medium text-emerald-300 mb-2">
                          Body Type
                        </label>
                        <select
                          value={model.bodyType}
                          onChange={(e) => handleModelChange(modelIndex, 'bodyType', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white focus:outline-none focus:border-emerald-400/60 transition-all"
                        >
                          <option value="" className="bg-slate-900">Select...</option>
                          <option value="slim" className="bg-slate-900">Slim</option>
                          <option value="athletic" className="bg-slate-900">Athletic</option>
                          <option value="average" className="bg-slate-900">Average</option>
                          <option value="curvy" className="bg-slate-900">Curvy</option>
                          <option value="plus-size" className="bg-slate-900">Plus Size</option>
                        </select>
                      </motion.div>
                    </div>
                  </div>
                ))}

                {/* Global Settings for all Models */}
                <div className="space-y-5 border-t border-emerald-500/30 pt-5 mt-5">
                  <h3 className="text-xl font-semibold text-emerald-400">Global Settings (for all models)</h3>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-emerald-300 mb-2">
                      Style
                    </label>
                    <input
                      type="text"
                      value={globalSettings.style}
                      onChange={(e) => handleGlobalSettingChange('style', e.target.value)}
                      placeholder="e.g., studio photo, outdoor, cinematic..."
                      className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/60 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <label className="block text-sm font-medium text-emerald-300 mb-2">
                      Background
                    </label>
                    <input
                      type="text"
                      value={globalSettings.background}
                      onChange={(e) => handleGlobalSettingChange('background', e.target.value)}
                      placeholder="e.g., white, black, city street..."
                      className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/60 transition-all"
                    />
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Aspect Ratio
                      </label>
                      <select
                        value={globalSettings.aspect_ratio}
                        onChange={(e) => handleGlobalSettingChange('aspect_ratio', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white focus:outline-none focus:border-emerald-400/60 transition-all"
                      >
                        <option value="" className="bg-slate-900">Select...</option>
                        <option value="1:1" className="bg-slate-900">1:1 (Square)</option>
                        <option value="3:4" className="bg-slate-900">3:4 (Portrait)</option>
                        <option value="4:3" className="bg-slate-900">4:3 (Landscape)</option>
                        <option value="9:16" className="bg-slate-900">9:16 (Vertical Full)</option>
                        <option value="16:9" className="bg-slate-900">16:9 (Horizontal Full)</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 }}
                    >
                      <label className="block text-sm font-medium text-emerald-300 mb-2">
                        Framing
                      </label>
                      <input
                        type="text"
                        value={globalSettings.framing}
                        onChange={(e) => handleGlobalSettingChange('framing', e.target.value)}
                        placeholder="e.g., headshot, full body, waist up..."
                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-emerald-500/40 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/60 transition-all"
                      />
                    </motion.div>
                  </div>
                </div>

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
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.5)] flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Avatar
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

