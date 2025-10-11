import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { uploadFile } from '../../services/api/stages';

interface Accessory {
  id: string;
  url: string;
  name: string;
}

interface AccessoriesParametersProps {
  generatedAvatars: Array<{ url: string; angle?: string }>;
  uploadedAssets: Array<{ id: string; url: string; name: string }>;
  setUploadedAssets: React.Dispatch<React.SetStateAction<Array<{ id: string; url: string; name: string }>>>; // Add this prop
  onAccessoriesGenerated?: (results: Array<{ url: string; id?: string }>) => void;
  onProgress?: (result: { url: string; id?: string }) => void;
}

export const AccessoriesParameters: React.FC<AccessoriesParametersProps> = ({
  generatedAvatars,
  onAccessoriesGenerated
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [aspectRatio, setAspectRatio] = useState<string>('3:4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAccessoryUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      const newAccessories: Accessory[] = [];
      
      // Upload files using the upload API
      const uploadPromises = Array.from(files).map(async (file, index) => {
        try {
          const uploadResult = await uploadFile(file);
          return {
            id: `accessory_${Date.now()}_${index}`,
            url: uploadResult.data.url,
            name: uploadResult.data.name || file.name
          };
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(uploadPromises);
      const validAccessories = results.filter((accessory): accessory is Accessory => accessory !== null);
      
      setAccessories(prev => [...prev, ...validAccessories]);
    } catch (error) {
      console.error('Error uploading accessories:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAccessory = (id: string) => {
    setAccessories(prev => prev.filter(accessory => accessory.id !== id));
  };

  const generateAccessories = async () => {
    if (!selectedAvatar || accessories.length === 0) {
      alert('Please select an avatar and add at least one accessory');
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('🔍 Selected avatar:', selectedAvatar);
      console.log('🔍 Accessories:', accessories);
      
      // Use the selected avatar directly (it's already a signed URL from the UI)
      const requestBody = {
        items: [
          {
            image: selectedAvatar, // Use the signed URL directly
            accessories: accessories.map(accessory => ({
              url: accessory.url // These are already signed URLs from upload
            }))
          }
        ],
        aspect_ratio: aspectRatio
      };

      console.log('🚀 Add accessories request payload:', JSON.stringify(requestBody, null, 2));

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_BASE_URL}/photoshoot/add-accessories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();
      
      if (onAccessoriesGenerated) {
        onAccessoriesGenerated(results);
      }
      
      console.log('Accessories generated successfully:', results);
    } catch (error) {
      console.error('Error generating accessories:', error);
      alert('Failed to generate accessories. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Add Accessories</h3>
        <p className="text-gray-400 text-sm mb-6">
          Select an avatar and add accessories like sunglasses, jewelry, and more.
        </p>
      </div>

      {/* Avatar Selection */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">
          Select Avatar
        </label>
        <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
          {generatedAvatars.map((avatar, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedAvatar === avatar.url
                  ? 'border-green-500 ring-2 ring-green-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setSelectedAvatar(avatar.url)}
            >
              <img
                src={avatar.url}
                alt={`Avatar ${index + 1}`}
                className="w-full h-20 object-cover"
              />
              {selectedAvatar === avatar.url && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {generatedAvatars.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No avatars available. Generate some avatars first.
          </p>
        )}
      </div>

      {/* Accessories Upload */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">
          Upload Accessories
        </label>
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-300 text-sm mb-1">Click to upload accessories</p>
          <p className="text-gray-500 text-xs">Sunglasses, jewelry, hats, etc.</p>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleAccessoryUpload(e.target.files)}
          />
        </div>
        
        {isUploading && (
          <div className="mt-3 p-3 bg-gray-700/50 rounded-lg text-center">
            <Loader2 className="w-5 h-5 animate-spin text-green-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">Uploading accessories...</p>
          </div>
        )}
      </div>

      {/* Accessories Preview */}
      {accessories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Selected Accessories ({accessories.length})
          </label>
          <div className="grid grid-cols-3 gap-3 max-h-40 overflow-y-auto">
            {accessories.map((accessory) => (
              <div key={accessory.id} className="relative group">
                <img
                  src={accessory.url}
                  alt={accessory.name}
                  className="w-full h-16 object-cover rounded-lg border border-gray-600"
                />
                <button
                  onClick={() => removeAccessory(accessory.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-xs text-gray-400 truncate mt-1" title={accessory.name}>
                  {accessory.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aspect Ratio Selection */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">
          Aspect Ratio
        </label>
        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="1:1">1:1 (Square)</option>
          <option value="3:4">3:4 (Portrait)</option>
          <option value="4:3">4:3 (Landscape)</option>
          <option value="16:9">16:9 (Widescreen)</option>
        </select>
      </div>

      {/* Generate Button */}
      <div className="pt-4">
        <Button
          onClick={generateAccessories}
          disabled={!selectedAvatar || accessories.length === 0 || isGenerating}
          className="w-full bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Adding Accessories...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Add Accessories
            </>
          )}
        </Button>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-white mb-2">Instructions</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Select an avatar from your generated avatars</li>
          <li>• Upload accessory images (sunglasses, jewelry, etc.)</li>
          <li>• Choose your preferred aspect ratio</li>
          <li>• Click &quot;Add Accessories&quot; to generate the result</li>
        </ul>
      </div>
    </div>
  );
};
