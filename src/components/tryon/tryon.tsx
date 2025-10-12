import React, { useState } from 'react';
import { Loader2, Users, Shirt, Upload, X } from 'lucide-react';
import { useVPSStore } from '../../store/vpsstore';
import { apiService, type StreamingTryOnResult } from '../../services/api';
import { ASPECT_RATIOS } from '../../types/index';

interface TryOnParametersProps {
  generatedAvatars: Array<{ url: string; angle?: string }>;
  uploadedAssets: Array<{ id: string; url: string; name: string }>;
  setUploadedAssets: React.Dispatch<React.SetStateAction<Array<{ id: string; url: string; name: string }>>>; // Add this prop
  uploadedGarments: string[];
  addUploadedGarment: (url: string) => void; // Explicitly pass it as a prop
  removeUploadedGarment: (url: string) => void;
  handleGarmentUpload: (files: FileList) => void;
  onTryOnGenerated?: (results: StreamingTryOnResult[]) => void;
  onProgress?: (result: StreamingTryOnResult) => void;
}

export const TryOnParameters: React.FC<TryOnParametersProps> = ({
  generatedAvatars,
  uploadedAssets,
  uploadedGarments,
  addUploadedGarment,
  removeUploadedGarment,
  handleGarmentUpload,
  onTryOnGenerated,
  onProgress
}) => {
  const { tryonForm, updateTryonForm } = useVPSStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<StreamingTryOnResult[]>([]);

  console.log("TryOnParameters - uploadedGarments:", uploadedGarments);

  // REMOVED: Local addUploadedGarment function. Now using the prop directly.

  const handleTryOnGenerate = async () => {
    if (!tryonForm.items?.length || !uploadedGarments.length) {
      setError('Please select avatars and garments for try-on');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGenerationProgress([]);

    // Add loading placeholder to show in results area
    if (onTryOnGenerated) {
      const loadingPlaceholders: StreamingTryOnResult[] = tryonForm.items.map((_, index) => ({
        item_index: index,
        step: 0,
        total_steps: 1,
        images: [],
        error: undefined
      }));
      onTryOnGenerated(loadingPlaceholders);
    }

    try {
      // Convert form data to API format - use URLs directly instead of base64
      const tryOnItems = tryonForm.items.map((item: { image: string; garment: string; prompt?: string; background_prompt?: string; reference_images?: string[]; style?: string }) => {
        return {
          avatar_image: item.image, // Use the signed URL directly
          garment_images: uploadedGarments, // Use the signed URLs directly
          // Add reference model images if available
          reference_model_images: item.reference_images || undefined
        };
      });

      const request = {
        items: tryOnItems,
        aspect_ratio: tryonForm.aspect_ratio,
        style: tryonForm.style,
        negative_prompt: tryonForm.negative_prompt
      };

      const response = await apiService.tryOn(
        request,
        (result) => {
          setGenerationProgress(prev => [...prev, result]);
          onProgress?.(result);
        }
      );

      console.log('API Response for Try-On:', response);
      
      if (response.success && response.data) {
        const { results } = response.data;
        // Convert final results to the expected format
        const finalResults: StreamingTryOnResult[] = results.map((result: unknown, index: number) => {
          const typedResult = result as { item_index?: number; step?: number; total_steps?: number; images?: string[]; error?: string };
          return {
            item_index: typedResult.item_index || index,
            step: typedResult.step || 1,
            total_steps: typedResult.total_steps || 1,
            images: typedResult.images?.map(url => ({ data: url })) || [],
            error: typedResult.error
          };
        });
        onTryOnGenerated?.(finalResults);
        console.log(`Try-on completed: ${response.data.metadata.completedItems}/${response.data.metadata.totalItems} items`);
      } else {
        console.error('API failed for Try-On:', response.error);
        setError(response.error || 'Failed to generate try-on images');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (tryonForm.items && tryonForm.items.length > 0) && uploadedGarments.length > 0;
  };

  return (
    <div className="space-y-4">
      {/* Garment Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Garment Selection
        </label>
        
        {/* Show uploaded assets if available */}
        {uploadedAssets.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-2">From uploaded assets:</p>
            <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
              {uploadedAssets.map((asset) => (
                <div 
                  key={asset.id} 
                  onClick={() => addUploadedGarment(asset.url)}
                  className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-gray-600 hover:border-purple-500"
                >
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-24 object-cover"
                  />
                  <p className="text-xs text-gray-400 truncate p-1">{asset.name}</p>
                  {uploadedGarments.includes(asset.url) && (
                    <div className="absolute top-1 right-1 bg-purple-600 rounded-full w-5 h-5 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show uploaded garments */}
        {uploadedGarments.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-2">Selected garments:</p>
            <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
              {uploadedGarments.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Garment ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-600"
                  />
                  <button
                    onClick={() => removeUploadedGarment(url)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload new garment */}
        <div className="mt-3">
          <label 
            htmlFor="garment-upload"
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer w-full justify-center"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Garment</span>
          </label>
          <input
            id="garment-upload"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleGarmentUpload(e.target.files)}
          />
        </div>

        {/* Empty state */}
        {uploadedAssets.length === 0 && uploadedGarments.length === 0 && (
          <div className="p-3 bg-gray-700/30 rounded-lg flex flex-col items-center justify-center h-32">
            <Shirt className="w-8 h-8 text-gray-500 mb-2" />
            <p className="text-sm text-gray-400 text-center mb-2">No garments available</p>
            <p className="text-xs text-gray-400 text-center">Upload assets or garments first</p>
          </div>
        )}
      </div>

      {/* Avatar Selection for Try-On */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Avatar for Try-On
        </label>
        {generatedAvatars.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {generatedAvatars.map((avatar, index) => {
              const isSelected = tryonForm.items?.some((item: { image: string; garment: string; prompt?: string; background_prompt?: string; reference_images?: string[]; style?: string }) => item.image === avatar.url);
              
              return (
                <div 
                  key={index} 
                  onClick={() => {
                    const currentItems = tryonForm.items || [];
                    const updatedItems = [...currentItems];
                    const existingIndex = updatedItems.findIndex(item => item.image === avatar.url);
                    
                    if (existingIndex >= 0) {
                      updatedItems.splice(existingIndex, 1);
                    } else {
                      updatedItems.push({
                        image: avatar.url,
                        garment: '',
                        background_prompt: ''
                      });
                    }
                    
                    updateTryonForm({ items: updatedItems });
                  }}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                    isSelected ? 'border-purple-500' : 'border-gray-600'
                  }`}
                >
                  <img
                    src={avatar.url}
                    alt={`Avatar ${index}`}
                    className="w-full h-32 object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-purple-600 rounded-full w-5 h-5 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3 bg-gray-700/30 rounded-lg flex flex-col items-center justify-center h-32">
            <Users className="w-6 h-6 text-gray-500 mb-2" />
            <p className="text-xs text-gray-400 text-center">No avatars generated yet</p>
            <p className="text-xs text-gray-400 text-center">Generate avatars in the Avatar tab first</p>
          </div>
        )}
      </div>

      {/* Try-On Configuration */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Try-On Configuration
        </label>
        {tryonForm.items && tryonForm.items.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {tryonForm.items.map((item: { image: string; garment: string; prompt?: string; background_prompt?: string; reference_images?: string[]; style?: string }, index: number) => (
              <div key={index} className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={item.image}
                    alt={`Selected avatar ${index + 1}`}
                    className="w-12 h-12 object-cover rounded border border-gray-600"
                  />
                  <div className="flex-1">
                    <div className="mb-2">
                      <label className="block text-xs text-gray-400 mb-1">
                        Style Prompt (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.style || ''}
                        onChange={(e) => {
                          if (tryonForm.items) {
                            const updatedItems = [...tryonForm.items];
                            updatedItems[index] = { ...item, style: e.target.value };
                            updateTryonForm({ items: updatedItems });
                          }
                        }}
                        placeholder="e.g., casual style, professional look"
                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Background (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.background_prompt || ''}
                        onChange={(e) => {
                          if (tryonForm.items) {
                            const updatedItems = [...tryonForm.items];
                            updatedItems[index] = { ...item, background_prompt: e.target.value };
                            updateTryonForm({ items: updatedItems });
                          }
                        }}
                        placeholder="e.g., studio white backdrop"
                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (tryonForm.items) {
                        const updatedItems = [...tryonForm.items];
                        updatedItems.splice(index, 1);
                        updateTryonForm({ items: updatedItems });
                      }
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-gray-700/30 rounded-lg flex items-center justify-center h-24">
            <p className="text-sm text-gray-400">Select avatars to configure try-on settings</p>
          </div>
        )}
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Aspect Ratio
        </label>
        <select
          value={tryonForm.aspect_ratio || ''}
          onChange={(e) => updateTryonForm({ aspect_ratio: e.target.value })}
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

      {/* Style & Negative Prompt */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Overall Style (Optional)
          </label>
          <input
            type="text"
            value={tryonForm.style || ''}
            onChange={(e) => updateTryonForm({ style: e.target.value })}
            placeholder="e.g., photorealistic, high fashion"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Negative Prompt (Optional)
          </label>
          <input
            type="text"
            value={tryonForm.negative_prompt || ''}
            onChange={(e) => updateTryonForm({ negative_prompt: e.target.value })}
            placeholder="e.g., blurry, low quality, deformed"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Generation Progress */}
      {isLoading && (
        <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-400 mb-2">
            {generationProgress.length > 0 
              ? `Processing try-on... (${generationProgress.filter(r => !r.error).length} steps completed)`
              : 'Starting try-on generation...'
            }
          </p>
          {generationProgress.length > 0 && (
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {generationProgress.map((result, index) => (
                <div key={index} className="text-xs text-gray-400">
                  {result.error ? (
                    <span className="text-red-400">❌ Item {result.item_index + 1}, Step {result.step}: {result.error}</span>
                  ) : (
                    <span className="text-green-400">✅ Item {result.item_index + 1}, Step {result.step}/{result.total_steps}: Complete</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Generate Button */}
      <div className="pt-4 mt-4 border-t border-gray-700">
        <button
          onClick={handleTryOnGenerate}
          disabled={isLoading || !isFormValid()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Shirt className="w-5 h-5" />
          )}
          {isLoading ? 'Generating...' : 'Generate Try-On'}
        </button>
        {!isFormValid() && (
          <p className="text-xs text-gray-400 mt-1 text-center">
            Please select avatars and upload garments first
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