import React, { useState } from 'react';
import { Loader2, Wand2, Settings } from 'lucide-react';
import { useVPSStore } from '../../store/vpsstore';
import { apiService, type StreamingAvatarResult } from '../../services/api';
import {
  HAIR_COLORS,
  EYE_COLORS,
  ETHNICITIES,
  GENDERS,
  FRAMING_OPTIONS,
  ASPECT_RATIOS,
  STYLE_PRESETS,
  BACKGROUND_PRESETS,
} from '../../types/index';

// FIX: Add the new prop to the interface
interface AvatarParametersProps {
  onAvatarGenerated?: (avatars: StreamingAvatarResult[]) => void;
  onProgress?: (result: StreamingAvatarResult) => void;
  initializeAvatarGeneration?: () => void;
}

export const AvatarParameters: React.FC<AvatarParametersProps> = ({
  onAvatarGenerated,
  onProgress,
  initializeAvatarGeneration // FIX: Destructure the new prop
}) => {
  const { avatarForm, updateAvatarForm } = useVPSStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<StreamingAvatarResult[]>([]);

  const handleGenerate = async () => {
    console.log('🚀 Generate button clicked!');
    console.log('📝 Form data:', avatarForm);
    console.log('✅ Form valid:', isFormValid());
    
    // FIX: Call the initialization function here to set up placeholders
    initializeAvatarGeneration?.(); 

    setIsLoading(true);
    setError(null);
    setGenerationProgress([]);
  
    try {
      console.log('📡 Calling API...');
      const response = await apiService.generateAvatar(
        avatarForm,
        (result) => {
          console.log('📈 Progress callback received:', result);
          setGenerationProgress(prev => [...prev, result]);
          onProgress?.(result);
        }
      );
  
      console.log('🎯 API Response:', response);
      
      if (response.success && response.data) {
        const { results } = response.data;
        console.log('✅ Calling onAvatarGenerated with:', results);
        onAvatarGenerated?.(results);
      } else {
        console.error('❌ API failed:', response.error);
        setError(response.error || 'Failed to generate avatars');
      }
    } catch (err) {
      console.error('💥 Exception caught:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
      console.log('🏁 Generation finished');
    }
  };

  const isFormValid = () => {
    // Basic validation - at least some key fields should be filled
    return avatarForm.gender && avatarForm.ethnicity && avatarForm.age;
  };

  return (
    <div className="space-y-4">
      {/* Subject Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Subject Description (Optional)
        </label>
        <input
          type="text"
          value={avatarForm.subject || ''}
          onChange={(e) => updateAvatarForm({ subject: e.target.value })}
          placeholder="e.g., 26-year-old male with black hair"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
        <p className="text-xs text-gray-400 mt-1">
          Leave empty to auto-generate from attributes
        </p>
      </div>

      {/* Hair Color & Eye Color */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hair Color
          </label>
          <select
            value={avatarForm.hair_color || ''}
            onChange={(e) => updateAvatarForm({ hair_color: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="">Select...</option>
            {HAIR_COLORS.map((color) => (
              <option key={color} value={color.toLowerCase()}>
                {color}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Eye Color
          </label>
          <select
            value={avatarForm.eye_color || ''}
            onChange={(e) => updateAvatarForm({ eye_color: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="">Select...</option>
            {EYE_COLORS.map((color) => (
              <option key={color} value={color.toLowerCase()}>
                {color}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ethnicity & Gender */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ethnicity *
          </label>
          <select
            value={avatarForm.ethnicity || ''}
            onChange={(e) => updateAvatarForm({ ethnicity: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="">Select...</option>
            {ETHNICITIES.map((ethnicity) => (
              <option key={ethnicity} value={ethnicity.toLowerCase()}>
                {ethnicity}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gender *
          </label>
          <select
            value={avatarForm.gender || ''}
            onChange={(e) => updateAvatarForm({ gender: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="">Select...</option>
            {GENDERS.map((gender) => (
              <option key={gender} value={gender.toLowerCase()}>
                {gender}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Age & Hairstyle */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Age *
          </label>
          <input
            type="number"
            value={avatarForm.age || ''}
            onChange={(e) => updateAvatarForm({ age: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            min={18}
            max={100}
            placeholder="25"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hairstyle
          </label>
          <input
            type="text"
            value={avatarForm.hairstyle || ''}
            onChange={(e) => updateAvatarForm({ hairstyle: e.target.value })}
            placeholder="e.g., short wavy, long straight"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Clothing */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Clothing
        </label>
        <input
          type="text"
          value={avatarForm.clothing || ''}
          onChange={(e) => updateAvatarForm({ clothing: e.target.value })}
          placeholder="e.g., plain black crew neck t-shirt"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
      </div>

      {/* Framing */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Framing
        </label>
        <select
          value={avatarForm.framing || ''}
          onChange={(e) => updateAvatarForm({ framing: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        >
          <option value="">Select...</option>
          {FRAMING_OPTIONS.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Style Preset */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Style Preset
        </label>
        <select
          value={avatarForm.style || ''}
          onChange={(e) => updateAvatarForm({ style: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        >
          <option value="">Select...</option>
          {STYLE_PRESETS.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>
      </div>

      {/* Background */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Background
        </label>
        <select
          value={avatarForm.background || ''}
          onChange={(e) => updateAvatarForm({ background: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        >
          <option value="">Select...</option>
          {BACKGROUND_PRESETS.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Aspect Ratio
        </label>
        <select
          value={avatarForm.aspect_ratio || ''}
          onChange={(e) => updateAvatarForm({ aspect_ratio: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        >
          <option value="">Auto</option>
          {ASPECT_RATIOS.map((ratio) => (
            <option key={ratio} value={ratio}>
              {ratio}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
      >
        <Settings className="w-4 h-4" />
        {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
      </button>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="space-y-3 pt-3 border-t border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Negative Prompt
            </label>
            <input
              type="text"
              value={avatarForm.negative_prompt || ''}
              onChange={(e) => updateAvatarForm({ negative_prompt: e.target.value })}
              placeholder="e.g., blurry, low quality, deformed hands"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
        </div>
      )}

      {/* Generation Progress */}
      {isLoading && generationProgress.length > 0 && (
        <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-400 mb-2">
            Generating avatars... ({generationProgress.reduce((total, result) => total + (result.angles?.length || 0), 0)} angles completed)
          </p>
          <div className="space-y-1">
            {generationProgress.map((result, resultIndex) => 
              result.angles?.map((angle, angleIndex) => (
                <div key={`${resultIndex}-${angleIndex}`} className="text-xs text-gray-400">
                  {angle.error ? (
                    <span className="text-red-400">❌ {angle.name}: {angle.error}</span>
                  ) : (
                    <span className="text-green-400">✅ {angle.name}: Generated</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="pt-4 mt-4 border-t border-gray-700">
        <button
          onClick={handleGenerate}
          disabled={isLoading || !isFormValid()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Wand2 className="w-5 h-5" />
          )}
          {isLoading ? 'Generating...' : 'Generate Avatar'}
        </button>
        {!isFormValid() && (
          <p className="text-xs text-gray-400 mt-1 text-center">
            Please fill in required fields (Gender, Ethnicity, Age)
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};