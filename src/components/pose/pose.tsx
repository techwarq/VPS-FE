import React, { useState } from 'react';
import { Loader2, Users, Shirt, Upload, X } from 'lucide-react';
import { useVPSStore } from '../../store/vpsstore';
import { apiService, type StreamingPoseTransferResult } from '../../services/api';
import { ASPECT_RATIOS } from '../../types/index';

interface PoseParametersProps {
  tryonResults: Array<{ image_url: string; item_index?: number }>;
  uploadedAssets: Array<{ id: string; url: string; name: string }>;
  setUploadedAssets: React.Dispatch<React.SetStateAction<Array<{ id: string; url: string; name: string }>>>; // Add this prop
  uploadedPoseReferences: string[];
  addUploadedPoseReference: (url: string) => void; // Add this to props
  removeUploadedPoseReference: (url: string) => void;
  handlePoseReferenceUpload: (files: FileList) => void;
  onPoseGenerated?: (results: StreamingPoseTransferResult[]) => void;
  onProgress?: (result: StreamingPoseTransferResult) => void;
}

export const PoseParameters: React.FC<PoseParametersProps> = ({
  tryonResults,
  uploadedAssets,
  uploadedPoseReferences,
  addUploadedPoseReference,
  removeUploadedPoseReference,
  handlePoseReferenceUpload,
  onPoseGenerated,
  onProgress
}) => {
  const { poseForm, updatePoseForm } = useVPSStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<StreamingPoseTransferResult[]>([]);

  // Removed: Local addUploadedPoseReference function. Now using the prop directly.

  const handlePoseGenerate = async () => {
    if (!poseForm.items?.length) {
      setError('Please select avatars for pose transfer');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGenerationProgress([]);

    // Add loading placeholders for each avatar
    if (onPoseGenerated) {
      const loadingPlaceholders: StreamingPoseTransferResult[] = poseForm.items.map((_, index) => ({
        item_index: index,
        mode: 'pose_both' as const,
        images: [],
        error: undefined
      }));
      onPoseGenerated(loadingPlaceholders);
    }

    try {
      console.log('🔍 Pose form items before processing:', poseForm.items);
      console.log('🔍 Uploaded pose references:', uploadedPoseReferences);
      
      // Convert form data to API format - send simple payload with signed URLs
      const poseItems = poseForm.items.map((item: { image: string; poseref?: string; pose_prompt?: string; background_prompt?: string }) => {
        const poseItem: {
          image: string;
          pose_reference?: string;
          background_prompt?: string;
          pose_prompt?: string;
        } = {
          image: item.image, // Send signed URL directly as string
        };
        
        // Only include pose_reference if it's not empty
        if (item.poseref && item.poseref.trim() !== '') {
          poseItem.pose_reference = item.poseref;
        }
        
        // Only include other fields if they have values
        if (item.background_prompt && item.background_prompt.trim() !== '') {
          poseItem.background_prompt = item.background_prompt;
        }
        
        if (item.pose_prompt && item.pose_prompt.trim() !== '') {
          poseItem.pose_prompt = item.pose_prompt;
        }
        
        return poseItem;
      });

      console.log('🔍 Processed pose items:', poseItems);

      const request = {
        items: poseItems,
        aspect_ratio: poseForm.aspect_ratio,
        negative_prompt: "blurry, low quality" // Add default negative prompt
      };

      console.log('🚀 Final pose transfer request:', JSON.stringify(request, null, 2));

      const response = await apiService.generatePoseTransfer(
        request,
        (result) => {
          setGenerationProgress(prev => [...prev, result]);
          onProgress?.(result);
        }
      );

      if (response.success && response.data) {
        const { results } = response.data;
        // Convert final results to the expected format
        const finalResults: StreamingPoseTransferResult[] = results.map((result: unknown, index: number) => {
          const typedResult = result as { 
            item_index?: number; 
            step?: number; 
            total_steps?: number; 
            images?: Array<{ signedUrl?: string; fileId?: string; filename?: string; size?: number; contentType?: string }>; 
            error?: string 
          };
          
          console.log('🔍 Processing pose result:', typedResult);
          
          return {
            item_index: typedResult.item_index || index,
            mode: 'pose_both' as const,
            images: typedResult.images || [],
            error: typedResult.error
          };
        });
        onPoseGenerated?.(finalResults);
        console.log(`Pose transfer completed: ${response.data.metadata.completedItems}/${response.data.metadata.totalItems} items`);
      } else {
        setError(response.error || 'Failed to generate pose transfers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return poseForm.items && poseForm.items.length > 0;
  };

  return (
    <div className="space-y-4">
      {/* Pose Reference Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Pose Reference Selection
        </label>
        
        {/* Show uploaded assets if available */}
        {uploadedAssets.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-2">From uploaded assets:</p>
            <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
              {uploadedAssets.map((asset) => (
                <div 
                  key={asset.id} 
                  onClick={() => addUploadedPoseReference(asset.url)}
                  className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-gray-600 hover:border-purple-500"
                >
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-24 object-cover"
                  />
                  <p className="text-xs text-gray-400 truncate p-1">{asset.name}</p>
                  {uploadedPoseReferences.includes(asset.url) && (
                    <div className="absolute top-1 right-1 bg-purple-600 rounded-full w-5 h-5 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show uploaded pose references */}
        {uploadedPoseReferences.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-2">Selected pose references:</p>
            <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
              {uploadedPoseReferences.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Pose reference ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-600"
                  />
                  <button
                    onClick={() => removeUploadedPoseReference(url)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload new pose reference */}
        <div className="mt-3">
          <label 
            htmlFor="pose-upload"
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer w-full justify-center"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Pose Reference</span>
          </label>
          <input
            id="pose-upload"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handlePoseReferenceUpload(e.target.files)}
          />
        </div>

        {/* Empty state */}
        {uploadedAssets.length === 0 && uploadedPoseReferences.length === 0 && (
          <div className="p-3 bg-gray-700/30 rounded-lg flex flex-col items-center justify-center h-32">
            <Users className="w-8 h-8 text-gray-500 mb-2" />
            <p className="text-sm text-gray-400 text-center mb-2">No pose references available</p>
            <p className="text-xs text-gray-400 text-center">Upload assets or pose references first</p>
          </div>
        )}
      </div>

      {/* Avatar Selection for Pose Transfer */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Avatar for Pose Transfer
        </label>
        {tryonResults.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {tryonResults.map((result, index) => {
              const isSelected = poseForm.items?.some((item: { image: string; poseref: string; pose_prompt?: string; background_prompt?: string }) => item.image === result.image_url);
              
              return (
                <div 
                  key={index} 
                  onClick={() => {
                    const currentItems = poseForm.items || [];
                    const updatedItems = [...currentItems];
                    const existingIndex = updatedItems.findIndex(item => item.image === result.image_url);
                    
                    if (existingIndex >= 0) {
                      updatedItems.splice(existingIndex, 1);
                    } else {
                      updatedItems.push({
                        image: result.image_url,
                        poseref: uploadedPoseReferences[0] || '',
                        pose_prompt: '',
                        background_prompt: ''
                      });
                    }
                    
                    updatePoseForm({ items: updatedItems });
                  }}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                    isSelected ? 'border-purple-500' : 'border-gray-600'
                  }`}
                >
                  <img
                    src={result.image_url}
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
            <Shirt className="w-6 h-6 text-gray-500 mb-2" />
            <p className="text-xs text-gray-400 text-center">No try-on results generated yet</p>
            <p className="text-xs text-gray-400 text-center">Generate try-on images in the Try-On tab first</p>
          </div>
        )}
      </div>

      {/* Pose Configuration */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Pose Configuration
        </label>
        {poseForm.items && poseForm.items.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {poseForm.items.map((item: { image: string; poseref: string; pose_prompt?: string; background_prompt?: string }, index: number) => (
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
                        Pose Reference (Optional)
                      </label>
                      <select
                        value={item.poseref || ''}
                        onChange={(e) => {
                          if (poseForm.items) {
                            const updatedItems = [...poseForm.items];
                            updatedItems[index] = { ...item, poseref: e.target.value };
                            updatePoseForm({ items: updatedItems });
                          }
                        }}
                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                      >
                        <option value="">None (use text prompt only)</option>
                        {uploadedPoseReferences.map((url, refIndex) => (
                          <option key={refIndex} value={url}>
                            Pose Reference {refIndex + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-2">
                      <label className="block text-xs text-gray-400 mb-1">
                        Pose Prompt (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.pose_prompt || ''}
                        onChange={(e) => {
                          if (poseForm.items) {
                            const updatedItems = [...poseForm.items];
                            updatedItems[index] = { ...item, pose_prompt: e.target.value };
                            updatePoseForm({ items: updatedItems });
                          }
                        }}
                        placeholder="e.g., arms crossed, confident stance"
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
                          if (poseForm.items) {
                            const updatedItems = [...poseForm.items];
                            updatedItems[index] = { ...item, background_prompt: e.target.value };
                            updatePoseForm({ items: updatedItems });
                          }
                        }}
                        placeholder="e.g., studio white backdrop"
                        className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (poseForm.items) {
                        const updatedItems = [...poseForm.items];
                        updatedItems.splice(index, 1);
                        updatePoseForm({ items: updatedItems });
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
            <p className="text-sm text-gray-400">Select avatars to configure pose settings</p>
          </div>
        )}
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Aspect Ratio
        </label>
        <select
          value={poseForm.aspect_ratio || ''}
          onChange={(e) => updatePoseForm({ aspect_ratio: e.target.value })}
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

      {/* Negative Prompt */}
      

      {/* Generation Progress */}
      {isLoading && generationProgress.length > 0 && (
        <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-400 mb-2">
            Processing pose transfer... ({generationProgress.filter(r => !r.error).length} completed)
          </p>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {generationProgress.map((result, index) => (
              <div key={index} className="text-xs text-gray-400">
                {result.error ? (
                  <span className="text-red-400">❌ Item {result.item_index + 1}: {result.error}</span>
                ) : (
                  <span className="text-green-400">✅ Item {result.item_index + 1} ({result.mode}): Complete</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="pt-4 mt-4 border-t border-gray-700">
        <button
          onClick={handlePoseGenerate}
          disabled={isLoading || !isFormValid()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Users className="w-5 h-5" />
          )}
          {isLoading ? 'Generating...' : 'Generate Pose Transfer'}
        </button>
        {!isFormValid() && (
          <p className="text-xs text-gray-400 mt-1 text-center">
            Please select avatars for pose transfer
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