import React, { useState } from 'react';
import { RightSidebar } from './right';
import { type AvatarImage, type TryOnResult, type PoseResult } from '../../types';
import { type StreamingAvatarResult, type StreamingTryOnResult, type StreamingPoseTransferResult, createImageUrl } from '../../services/api';
import { useVPSAPI } from '../hooks/use-vps-api';
import { useVPSStore } from '../../store/vpsstore';
import { uploadFile as apiUploadFile } from '../../services/api/stages';

interface Asset { // Re-define Asset interface here or import from types/index.ts
  id: string;
  url: string;
  name: string;
}

interface RightSideBarProps {
  uploadedAssets: Asset[];
  setUploadedAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
}

export const RightSideBar: React.FC<RightSideBarProps> = ({
  uploadedAssets,
  setUploadedAssets,
}) => {
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'avatar' | 'tryon' | 'pose' | 'accessories'>('avatar');
  const [activeToolTab, setActiveToolTab] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { 
    uploadedGarments,
    addUploadedGarment,
    removeUploadedGarment,
    uploadedPoseReferences,
    addUploadedPoseReference,
    removeUploadedPoseReference,
    generatedAvatars,
    setGeneratedAvatars,
    tryonResults,
    setTryonResults,
    poseResults,
    setPoseResults
  } = useVPSStore();

  const { 
    uploadGarments, 
    uploadPoseReference 
  } = useVPSAPI();

  const removeAsset = (id: string) => {
    setUploadedAssets((prev: Asset[]) => prev.filter((asset: Asset) => asset.id !== id));
  };

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    console.log('📤 Starting handleFileUpload for files:', files);
    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (file) => {
        try {
          const response = await apiUploadFile(file);
          console.log('📦 apiUploadFile response for', file.name, ':', response);
          if (response && response.data && response.data.url) {
            return {
              id: response.data.fileId || `asset-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              url: response.data.url,
              name: response.data.name || file.name
            };
          }
        } catch (fileUploadError) {
          console.error('❌ Error uploading single file', file.name, ':', fileUploadError);
        }
        return null;
      });
      const results = await Promise.all(uploadPromises);
      const validResults = results.filter((result): result is Asset => result !== null);
      console.log('✅ Valid uploaded assets after filter:', validResults);
      setUploadedAssets(prev => [...prev, ...validResults]);
    } catch (error) {
      console.error('❌ Error in handleFileUpload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGarmentUpload = async (files: FileList) => {
    setIsUploading(true);
    console.log('👕 Starting handleGarmentUpload for files:', files);
    try {
      const fileArray = Array.from(files);
      const response = await uploadGarments(fileArray);
      console.log('👗 uploadGarments response:', response);
      if (response.success && response.uploaded) {
        response.uploaded.forEach(item => {
          if (item.url) {
            console.log('➕ Adding garment with URL:', item.url);
            addUploadedGarment(item.url);
          }
        });
      } else {
        console.error('Garment upload failed: Invalid response format or no uploaded items', response);
      }
    } catch (err) {
      console.error('Garment upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePoseReferenceUpload = async (files: FileList) => {
    setIsUploading(true);
    console.log('🕺 Starting handlePoseReferenceUpload for files:', files);
    try {
      const file = files[0];
      const response = await uploadPoseReference(file);
      console.log('💃 uploadPoseReference response:', response);
      if (response.success && response.url) {
        console.log('➕ Adding pose reference with URL:', response.url);
        addUploadedPoseReference(response.url);
      } else {
        console.error('Pose reference upload failed: Invalid response format or no URL', response);
      }
    } catch (err) {
      console.error('Pose reference upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const initializeAvatarGeneration = () => {
    const angles = ['front', 'left-3/4', 'right-3/4', 'profile-left', 'profile-right'];
    const placeholders = angles.map(angle => ({
      id: `placeholder-${angle}`,
      angle: angle,
      url: '',
      isLoading: true
    }));
    setGeneratedAvatars(placeholders);
  };

  const onAvatarGenerated = (avatars: StreamingAvatarResult[]) => {
    setGeneratedAvatars(avatars.map((avatar, index) => ({
      id: `avatar-${avatar.angle || index}-${Date.now()}`,
      url: avatar.images && avatar.images.length > 0 ? createImageUrl(avatar.images[0]) : '',
      angle: avatar.angle,
      isLoading: false
    })));
  };

  const onTryOnGenerated = (results: StreamingTryOnResult[]) => {
    setTryonResults(results.map((result, index) => ({
      id: `tryon-${result.item_index || index}-${Date.now()}`,
      url: result.images && result.images.length > 0 ? createImageUrl(result.images[0]) : '',
      item_index: result.item_index
    })));
  };

  const onPoseGenerated = (results: StreamingPoseTransferResult[]) => {
    setPoseResults(results.map((result, index) => ({
      id: `pose-${result.item_index || index}-${Date.now()}`,
      url: result.images && result.images.length > 0 ? createImageUrl(result.images[0]) : '',
      item_index: result.item_index
    })));
  };

  const onAccessoriesGenerated = (results: Array<{ url: string; id?: string }>) => {
    console.log('Accessories generated:', results);
    // Implement logic to store accessories results if needed
  };

  const onAvatarProgress = (result: StreamingAvatarResult) => {
    setGeneratedAvatars(prevAvatars => {
      const updated = prevAvatars.map(avatar => {
        if (avatar.angle === result.angle) {
          return {
            ...avatar,
            url: result.images && result.images.length > 0 ? createImageUrl(result.images[0]) : avatar.url,
            isLoading: false
          };
        }
        return avatar;
      });

      const hasExisting = prevAvatars.some(avatar => avatar.angle === result.angle);
      if (!hasExisting && result.images && result.images.length > 0) {
        updated.push({
          id: `avatar-${result.angle}-${Date.now()}`,
          url: createImageUrl(result.images[0]),
          angle: result.angle,
          isLoading: false
        });
      }
      return updated;
    });
  };

  const onTryOnProgress = (result: StreamingTryOnResult) => {
    setTryonResults(prevResults => {
      const updated = [...prevResults];
      const existingIndex = updated.findIndex(item => item.item_index === result.item_index);
      if (existingIndex >= 0) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          url: result.images && result.images.length > 0 ? createImageUrl(result.images[0]) : updated[existingIndex].url
        };
      } else if (result.images && result.images.length > 0) {
        updated.push({
          id: `tryon-${result.item_index}-${Date.now()}`,
          url: createImageUrl(result.images[0]),
          item_index: result.item_index
        });
      }
      return updated;
    });
  };

  const onPoseProgress = (result: StreamingPoseTransferResult) => {
    setPoseResults(prevResults => {
      const updated = [...prevResults];
      const existingIndex = updated.findIndex(item => item.item_index === result.item_index);
      if (existingIndex >= 0) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          url: result.images && result.images.length > 0 ? createImageUrl(result.images[0]) : updated[existingIndex].url
        };
      } else if (result.images && result.images.length > 0) {
        updated.push({
          id: `pose-${result.item_index}-${Date.now()}`,
          url: createImageUrl(result.images[0]),
          item_index: result.item_index
        });
      }
      return updated;
    });
  };

  return (
    <RightSidebar
      rightDrawerOpen={rightDrawerOpen}
      setRightDrawerOpen={setRightDrawerOpen}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      activeToolTab={activeToolTab}
      setActiveToolTab={setActiveToolTab}
      uploadedAssets={uploadedAssets}
      setUploadedAssets={setUploadedAssets}
      isUploading={isUploading}
      removeAsset={removeAsset}
      generatedAvatars={generatedAvatars}
      tryonResults={tryonResults}
      poseResults={poseResults}
      onAvatarGenerated={onAvatarGenerated}
      onTryOnGenerated={onTryOnGenerated}
      onPoseGenerated={onPoseGenerated}
      onAccessoriesGenerated={onAccessoriesGenerated}
      onAvatarProgress={onAvatarProgress}
      onTryOnProgress={onTryOnProgress}
      onPoseProgress={onPoseProgress}
      initializeAvatarGeneration={initializeAvatarGeneration}
      handleFileUpload={handleFileUpload}
      handleGarmentUpload={handleGarmentUpload}
      handlePoseReferenceUpload={handlePoseReferenceUpload}
      dragActive={dragActive}
      handleDrag={handleDrag}
      handleDrop={handleDrop}
      uploadedGarments={uploadedGarments}
      addUploadedGarment={addUploadedGarment}
      removeUploadedGarment={removeUploadedGarment}
      uploadedPoseReferences={uploadedPoseReferences}
      removeUploadedPoseReference={removeUploadedPoseReference}
    />
  );
};


