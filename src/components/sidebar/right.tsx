import React from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { AvatarParameters } from '../avatar/avatar';
import { TryOnParameters } from '../tryon/tryon';
import { PoseParameters } from '../pose/pose';
import { AccessoriesParameters } from '../accessories/accessories';
import { 
  type StreamingAvatarResult, 
  type StreamingTryOnResult, 
  type StreamingPoseTransferResult 
} from '../../services/api';
// FIX: Import the AvatarImage type to use it in props
import { 
  type AvatarImage,
  type TryOnResult, 
  type PoseResult 
} from '../../types';

interface Asset {
  id: string;
  url: string;
  name: string;
}

interface RightSidebarProps {
  rightDrawerOpen: boolean;
  setRightDrawerOpen: (open: boolean) => void;
  activeTab: 'avatar' | 'tryon' | 'pose' | 'accessories';
  setActiveTab: (tab: 'avatar' | 'tryon' | 'pose' | 'accessories') => void;
  activeToolTab: string | null;
  setActiveToolTab: (tab: string | null) => void;
  uploadedAssets: Asset[];
  setUploadedAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  isUploading: boolean;
  removeAsset: (id: string) => void;
  
  
  // FIX: Change generatedAvatars type to match the state from the store
  generatedAvatars: AvatarImage[];
  tryonResults: TryOnResult[];
  poseResults: PoseResult[];  
  
  // Result handlers - new callbacks for receiving API results
  onAvatarGenerated?: (avatars: StreamingAvatarResult[]) => void;
  onTryOnGenerated?: (results: StreamingTryOnResult[]) => void;
  onPoseGenerated?: (results: StreamingPoseTransferResult[]) => void;
  onAccessoriesGenerated?: (results: Array<{ url: string; id?: string }>) => void;
  
  // Progress handlers - optional callbacks for real-time updates
  onAvatarProgress?: (result: StreamingAvatarResult) => void;
  onTryOnProgress?: (result: StreamingTryOnResult) => void;
  onPoseProgress?: (result: StreamingPoseTransferResult) => void;
  
  // FIX: Add the missing prop to the interface
  initializeAvatarGeneration?: () => void;

  // File upload handlers
  handleFileUpload: (files: FileList) => void;
  handleGarmentUpload: (files: FileList) => void;
  handlePoseReferenceUpload: (files: FileList) => void;
  
  // Drag and drop
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  
  // Additional data
  uploadedGarments: string[];
  addUploadedGarment: (url: string) => void; // Add this prop
  removeUploadedGarment: (url: string) => void;
  uploadedPoseReferences: string[];
  removeUploadedPoseReference: (url: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  rightDrawerOpen,
  setRightDrawerOpen,
  activeTab,
  activeToolTab,
  setActiveToolTab,
  uploadedAssets,
  isUploading,
  removeAsset,
  generatedAvatars,
  tryonResults,
  poseResults,
  onAvatarGenerated,
  onTryOnGenerated,
  onPoseGenerated,
  onAccessoriesGenerated,
  onAvatarProgress,
  onTryOnProgress,
  onPoseProgress,
  initializeAvatarGeneration, // FIX: Destructure the new prop
  handleFileUpload,
  handleGarmentUpload,
  handlePoseReferenceUpload,
  dragActive,
  handleDrag,
  handleDrop,
  uploadedGarments,
  addUploadedGarment, // Destructure the new prop
  removeUploadedGarment,
  uploadedPoseReferences,
  removeUploadedPoseReference
}) => {
  const getSidebarTitle = () => {
    if (activeToolTab === 'upload') return 'Asset Management';
    if (activeToolTab === 'export') return 'Export Options';
    if (!activeToolTab && activeTab === 'avatar') return 'Avatar Parameters';
    if (!activeToolTab && activeTab === 'tryon') return 'Try-On Parameters';
    if (!activeToolTab && activeTab === 'pose') return 'Pose Parameters';
    if (!activeToolTab && activeTab === 'accessories') return 'Accessories Parameters';
    return 'Parameters';
  };

  const renderSidebarContent = () => {
    // Tool tabs content
    if (activeToolTab) {
      switch (activeToolTab) {
        case 'upload':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Asset Management</h3>
              <div className="space-y-2">
                <p className="text-gray-400">Upload and manage your assets</p>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                    dragActive ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Drag & drop files here</p>
                  <p className="text-xs text-gray-500 mt-1">or click to browse</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center cursor-pointer transition-colors"
                >
                  Choose Files
                </label>
              </div>
            </div>
          );
        case 'export':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Export Options</h3>
              <div className="space-y-3">
                <p className="text-gray-400">Export your generated content</p>
                
                {/* Export buttons based on generated content */}
                {generatedAvatars.length > 0 && (
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Export Avatars ({generatedAvatars.length})
                  </button>
                )}
                
                {tryonResults.length > 0 && (
                  <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    Export Try-On Results ({tryonResults.length})
                  </button>
                )}
                
                {poseResults.length > 0 && (
                  <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                    Export Pose Results ({poseResults.length})
                  </button>
                )}
                
                {generatedAvatars.length === 0 && tryonResults.length === 0 && poseResults.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No content available to export
                  </p>
                )}
              </div>
            </div>
          );
        default:
          return null;
      }
    }

    // Main tab parameters - now with API integration
    switch (activeTab) {
      case 'avatar':
        return (
          <AvatarParameters
            onAvatarGenerated={onAvatarGenerated}
            onProgress={onAvatarProgress}
            // FIX: Pass the function down to the component that will use it
            initializeAvatarGeneration={initializeAvatarGeneration}
          />
        );
      case 'tryon':
        return (
          <TryOnParameters
             // FIX: Update mapping to use AvatarImage[] type. Filter out loading placeholders.
            generatedAvatars={generatedAvatars
              .filter(avatar => avatar.url && !avatar.isLoading)
              .map(avatar => ({
                url: avatar.url,
                angle: avatar.angle,
              }))
            }
            uploadedAssets={uploadedAssets}
            uploadedGarments={uploadedGarments}
            addUploadedGarment={addUploadedGarment} // Pass the prop down
            removeUploadedGarment={removeUploadedGarment}
            handleGarmentUpload={handleGarmentUpload}
            onTryOnGenerated={onTryOnGenerated}
            onProgress={onTryOnProgress}
          />
        );
      case 'pose':
          return (
            <PoseParameters
              tryonResults={tryonResults.map(result => ({ 
                image_url: result.url,
                item_index: result.item_index
              }))}
              uploadedAssets={uploadedAssets}
              uploadedPoseReferences={uploadedPoseReferences}
              removeUploadedPoseReference={removeUploadedPoseReference}
              handlePoseReferenceUpload={handlePoseReferenceUpload}
              onPoseGenerated={onPoseGenerated}
              onProgress={onPoseProgress}
            />
          );
      case 'accessories':
        return (
          <AccessoriesParameters
            generatedAvatars={generatedAvatars
              .filter(avatar => avatar.url && !avatar.isLoading)
              .map(avatar => ({
                url: avatar.url,
                angle: avatar.angle,
              }))
            }
            uploadedAssets={uploadedAssets}
            onAccessoriesGenerated={onAccessoriesGenerated}
          />
        );
      default:
        return null;
    }
  };

  if (!rightDrawerOpen) {
    return null;
  }

  console.log("RightSidebar - uploadedGarments (before TryOnParameters):", uploadedGarments);

  return (
    <div className="w-96 min-w-96 bg-black/95 backdrop-blur-md border-l border-gray-700 shadow-lg">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gradient-to-r from-gray-900/50 to-transparent">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {getSidebarTitle()}
          </h2>
          <button 
            onClick={() => {
              setRightDrawerOpen(false);
              setActiveToolTab(null);
            }}
            className="text-gray-400 hover:text-white transition-all duration-200 p-1 rounded-lg hover:bg-gray-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {renderSidebarContent()}
        </div>
        
        {/* Generation Statistics */}
        {!activeToolTab && (generatedAvatars.length > 0 || tryonResults.length > 0 || poseResults.length > 0) && (
          <div className="p-4 border-t border-gray-700 bg-gray-900/50">
            <h3 className="text-sm font-medium text-white mb-2">Generation Stats</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-purple-400 font-medium">{generatedAvatars.length}</div>
                <div className="text-gray-400">Avatars</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-medium">{tryonResults.length}</div>
                <div className="text-gray-400">Try-Ons</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-medium">{poseResults.length}</div>
                <div className="text-gray-400">Poses</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Uploaded assets preview */}
        {uploadedAssets.length > 0 && (
          <div className="p-4 border-t border-gray-700">
            <h3 className="text-sm font-medium text-white mb-3">Uploaded Assets ({uploadedAssets.length})</h3>
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {uploadedAssets.map((asset) => (
                <div key={asset.id} className="relative group">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-16 object-cover rounded border border-gray-600"
                  />
                  <button
                    onClick={() => removeAsset(asset.id)}
                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p className="text-xs text-gray-400 truncate mt-1" title={asset.name}>
                    {asset.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Upload indicator */}
        {isUploading && (
          <div className="p-4 border-t border-gray-700 bg-gray-700/50 text-center">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">Uploading assets...</p>
          </div>
        )}
      </div>
    </div>
  );
};