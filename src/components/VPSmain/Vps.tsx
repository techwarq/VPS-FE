import React, { useState } from 'react';
import { 
  User, 
  Shirt, 
  Users, 
  Maximize2, 
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { useVPSStore } from '../../store/vpsstore';
import { uploadFile } from '../../services/api/stages';
import { useVPSAPI } from '../hooks/use-vps-api';
import { LeftSidebar } from '../sidebar/left';
import { RightSidebar } from '../sidebar/right';
import { ResultDisplay } from './ResultDisplay';
// import { ImageCarousel } from './imagecaroussel';
import { 
  type StreamingAvatarResult, 
  type StreamingTryOnResult, 
  type StreamingPoseTransferResult,
  createImageUrl
} from '../../services/api';
import { type AvatarImage, type TryOnResult, type PoseResult, type AccessoriesResult } from '../../types';

// Define proper types for uploaded assets
interface UploadedAsset {
  id: string;
  url: string;
  name: string;
  fileId?: string;
  size?: number;
  contentType?: string;
}

export const VPSMain: React.FC = () => {
  // Store state
  const { 
    activeTab, 
    setActiveTab, 
    generatedAvatars,
    setGeneratedAvatars,
    tryonResults,
    setTryonResults,
    poseResults,
    setPoseResults,
    accessoriesResults,
    setAccessoriesResults,
    uploadedGarments,
    addUploadedGarment,
    removeUploadedGarment,
    uploadedPoseReferences,
    addUploadedPoseReference,
    removeUploadedPoseReference
  } = useVPSStore();

  // API hooks (keeping for upload functionality)
  const { 
    uploadGarments, 
    uploadPoseReference
  } = useVPSAPI();

  // UI state
  const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
  const [activeToolTab, setActiveToolTab] = useState<string | null>(null);
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Carousel state
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [carouselZoom, setCarouselZoom] = useState(1);
  const [carouselPosition, setCarouselPosition] = useState({ x: 0, y: 0 });

  // Helper functions to convert streaming results to store format
  const convertAvatarResults = (streamingResults: StreamingAvatarResult[]): AvatarImage[] => {
    return streamingResults
      .filter(result => result.images && result.images.length > 0)
      .map((result, index) => ({
        id: `avatar-${result.angle || index}-${Date.now()}`,
        url: createImageUrl(result.images![0]),
        angle: result.angle,
        isLoading: false // Ensure isLoading is set
      }));
  };

  const convertTryOnResults = (streamingResults: StreamingTryOnResult[]): TryOnResult[] => {
    return streamingResults
      .map((result, index) => {
        // Handle loading placeholders (empty images array)
        if (!result.images || result.images.length === 0) {
          return {
            id: `tryon-loading-${result.item_index || index}-${Date.now()}`,
            url: '',
        item_index: result.item_index,
            isLoading: true
          };
        }
        
        // Handle actual results with images
        const firstImage = result.images[0];
        let imageUrl = '';
        
        // Check if the image is already a URL string
        if (typeof firstImage === 'string') {
          imageUrl = firstImage;
        } else if (firstImage && typeof firstImage === 'object') {
          // Handle ModelImage format - check for signedUrl first
          if ('signedUrl' in firstImage && firstImage.signedUrl) {
            imageUrl = firstImage.signedUrl;
          } else {
            // Fallback to createImageUrl for other formats
            imageUrl = createImageUrl(firstImage);
          }
        }
        
        return {
          id: `tryon-${result.item_index || index}-${Date.now()}`,
          url: imageUrl,
          item_index: result.item_index,
          isLoading: false
        };
      });
  };

  const convertPoseResults = (streamingResults: StreamingPoseTransferResult[]): PoseResult[] => {
    return streamingResults
      .map((result, index) => {
        // Handle loading placeholders (empty images array)
        if (!result.images || result.images.length === 0) {
          return {
            id: `pose-loading-${result.item_index || index}-${Date.now()}`,
            url: '',
            item_index: result.item_index,
            isLoading: true
          };
        }
        
        // Handle actual results with images
        const firstImage = result.images[0];
        let imageUrl = '';
        
        // Check if the image is already a URL string
        if (typeof firstImage === 'string') {
          imageUrl = firstImage;
        } else if (firstImage && typeof firstImage === 'object') {
          // Handle ModelImage format - check for signedUrl first
          if ('signedUrl' in firstImage && firstImage.signedUrl) {
            imageUrl = firstImage.signedUrl;
          } else {
            // Fallback to createImageUrl for other formats
            imageUrl = createImageUrl(firstImage);
          }
        }
        
        return {
        id: `pose-${result.item_index || index}-${Date.now()}`,
          url: imageUrl,
        item_index: result.item_index,
          isLoading: false
        };
      });
  };

  // New API callback handlers
  const handleAvatarGenerated = (avatars: StreamingAvatarResult[]) => {
    console.log('Avatars generated:', avatars);
    const convertedAvatars = convertAvatarResults(avatars);
    setGeneratedAvatars(convertedAvatars);
  };

  // Initialize avatar generation with placeholders
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

  const handleTryOnGenerated = (results: StreamingTryOnResult[]) => {
    console.log('🎯 Try-on results generated (raw):', results);
    const convertedResults = convertTryOnResults(results);
    console.log('🎯 Try-on results converted:', convertedResults);
    console.log('🎯 Setting tryonResults to:', convertedResults);
    setTryonResults(convertedResults);
    
    // Also log the current state after setting
    setTimeout(() => {
      console.log('🎯 tryonResults state after setting:', tryonResults);
    }, 100);
  };

  const handlePoseGenerated = (results: StreamingPoseTransferResult[]) => {
    console.log('🎯 Pose results generated (raw):', results);
    const convertedResults = convertPoseResults(results);
    console.log('🎯 Pose results converted:', convertedResults);
    console.log('🎯 Setting poseResults to:', convertedResults);
    setPoseResults(convertedResults);
  };

  const handleAccessoriesGenerated = (results: unknown) => {
    console.log('Accessories results generated:', results);
    
    // Handle the actual API response format
    if (Array.isArray(results)) {
      const convertedResults: AccessoriesResult[] = [];
      
      results.forEach((item: unknown, itemIndex: number) => {
        const typedItem = item as { images?: unknown[] };
        if (typedItem.images && Array.isArray(typedItem.images)) {
          typedItem.images.forEach((image: unknown, imageIndex: number) => {
            const typedImage = image as { signedUrl?: string; url?: string };
            convertedResults.push({
              id: `accessories-${itemIndex}-${imageIndex}-${Date.now()}`,
              url: typedImage.signedUrl || typedImage.url || '',
              item_index: itemIndex,
              isLoading: false
            });
          });
        }
      });
      
      setAccessoriesResults(convertedResults);
    } else {
      // Fallback for simple format
      const convertedResults = (results as unknown[]).map((result: unknown, index: number) => {
        const typedResult = result as { id?: string; url?: string; isLoading?: boolean };
        return {
          id: typedResult.id || `accessories-${index}-${Date.now()}`,
          url: typedResult.url || '',
          item_index: index,
          isLoading: typedResult.isLoading || false
        };
      });
      setAccessoriesResults(convertedResults);
    }
  };

  const handleAccessoriesProgress = (result: unknown) => {
    console.log('Accessories progress:', result);
    
    // Handle streaming results - add to accessories results in real-time
    const typedResult = result as { images?: unknown[]; item_index?: number };
    if (typedResult.images && Array.isArray(typedResult.images)) {
      const newResults: AccessoriesResult[] = typedResult.images.map((image: unknown, imageIndex: number) => {
        const typedImage = image as { signedUrl?: string; url?: string };
        return {
          id: `accessories-${typedResult.item_index}-${imageIndex}-${Date.now()}`,
          url: typedImage.signedUrl || typedImage.url || '',
          item_index: typedResult.item_index || 0,
          isLoading: false
        };
      });
      
      setAccessoriesResults(prev => [...prev, ...newResults]);
    }
  };

  const handleAvatarProgress = (result: StreamingAvatarResult) => {
    console.log('Avatar progress:', result);
    
    //FIX: Explicitly type prevAvatars to resolve TypeScript errors
    setGeneratedAvatars((prevAvatars: AvatarImage[]) => { 
      const updated = prevAvatars.map(avatar => {
        if (avatar.angle === result.angle) {
          // Replace the placeholder with the actual result
          return {
            ...avatar,
            id: `avatar-${result.angle}-${Date.now()}`,
            url: result.images && result.images.length > 0 ? createImageUrl(result.images[0]) : avatar.url,
            isLoading: false
          };
        }
        return avatar;
      });
      
      // If no existing placeholder found, add new avatar
      const hasExisting = prevAvatars.some(avatar => avatar.angle === result.angle);
      if (!hasExisting && result.images && result.images.length > 0) {
        const newAvatar: AvatarImage = {
          id: `avatar-${result.angle}-${Date.now()}`,
          url: createImageUrl(result.images[0]),
          angle: result.angle,
          isLoading: false
        };
        updated.push(newAvatar);
      }
      
      return updated;
    });
  };

  const handleTryOnProgress = (result: StreamingTryOnResult) => {
    console.log('Try-on progress:', result);
    
    const updated = [...tryonResults];
    const existingIndex = updated.findIndex(item => item.item_index === result.item_index);
    
    if (existingIndex >= 0) {
      updated[existingIndex] = {
        ...updated[existingIndex],
        url: result.images && result.images.length > 0 ? createImageUrl(result.images[0]) : updated[existingIndex].url
      };
    } else if (result.images && result.images.length > 0) {
      const newResult: TryOnResult = {
        id: `tryon-${result.item_index}-${Date.now()}`,
        url: createImageUrl(result.images[0]),
        item_index: result.item_index
      };
      updated.push(newResult);
    }
    
    setTryonResults(updated);
  };
  
  const handlePoseProgress = (result: StreamingPoseTransferResult) => {
    console.log('Pose progress:', result);
    
    const updated = [...poseResults];
    const existingIndex = updated.findIndex(item => item.item_index === result.item_index);
    
    if (existingIndex >= 0) {
      updated[existingIndex] = {
        ...updated[existingIndex],
        url: result.images && result.images.length > 0 ? createImageUrl(result.images[0]) : updated[existingIndex].url
      };
    } else if (result.images && result.images.length > 0) {
      const newResult: PoseResult = {
        id: `pose-${result.item_index}-${Date.now()}`,
        url: createImageUrl(result.images[0]),
        item_index: result.item_index
      };
      updated.push(newResult);
    }
    
    setPoseResults(updated);
  };

  // File upload handlers
  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (file) => {
        const response = await uploadFile(file);
        
        // Handle the response from our upload API
        if (response && response.data && response.data.url) {
          const asset: UploadedAsset = {
            id: `asset-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            url: response.data.url,
            name: response.data.name || file.name
          };
          
          // Add optional properties if they exist
          if (response.data.fileId) asset.fileId = response.data.fileId;
          if (response.data.size) asset.size = response.data.size;
          if (response.data.contentType) asset.contentType = response.data.contentType;
          
          return asset;
        }
        
        return null;
      });
      
      const results = await Promise.all(uploadPromises);
      const validResults = results.filter((result): result is UploadedAsset => result !== null);
      
      setUploadedAssets(prev => [...prev, ...validResults]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGarmentUpload = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      const fileArray = Array.from(files);
      const response = await uploadGarments(fileArray);
      
      if (response.success && response.uploaded) {
        // Store the signed URL returned from the API for each uploaded garment
        response.uploaded.forEach(item => {
          if (item.url) {
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
    
    try {
      const file = files[0];
      console.log('🔍 Uploading pose reference file:', file.name);
      const response = await uploadPoseReference(file);
      console.log('🔍 Pose reference upload response:', response);
      
      if (response.success && response.url) {
        console.log('🔍 Adding pose reference URL to state:', response.url);
        // Store the signed URL returned from the API, not a blob URL
        addUploadedPoseReference(response.url);
      } else {
        console.error('❌ Pose reference upload failed - no URL in response:', response);
      }
    } catch (err) {
      console.error('Pose reference upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop handlers
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Carousel handlers
  const openCarousel = (images: string[]) => {
    setCarouselImages(images);
    setCurrentCarouselSlide(0);
    setCarouselZoom(1);
    setCarouselPosition({ x: 0, y: 0 });
    setCarouselOpen(true);
  };

  const closeCarousel = () => {
    setCarouselOpen(false);
    setCarouselZoom(1);
    setCarouselPosition({ x: 0, y: 0 });
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `result_${index}_${Date.now()}.jpg`;
    link.click();
  };

  const removeAsset = (id: string) => {
    setUploadedAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const getPageTitle = () => {
    const tab = [
      { id: 'avatar', label: 'Create realistic AI avatars' },
      { id: 'tryon', label: 'Try on garments on avatars' },
      { id: 'pose', label: 'Transfer poses from references' },
      { id: 'accessories', label: 'Add accessories to avatars' },
    ].find(t => t.id === activeTab);
    return tab?.label || 'Virtual Photoshoot Studio';
  };

  // Helper function to convert streaming results to display format
  const getDisplayImages = (): string[] => {
    switch (activeTab) {
      case 'avatar':
        return generatedAvatars
          .filter(avatar => avatar.url)
          .map(avatar => avatar.url);
      case 'tryon':
        return tryonResults
          .filter(result => result.url)
          .map(result => result.url);
      case 'pose':
        return poseResults
          .filter(result => result.url)
          .map(result => result.url);
      case 'accessories':
        // For accessories, we'll return empty array for now
        // You can extend this when you add accessories results to the store
        return [];
      default:
        return [];
    }
  };

    function setCurrentSlide(): void {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="h-full flex bg-gray-900">
      {/* Left Sidebar */}
      <LeftSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeToolTab={activeToolTab}
        setActiveToolTab={setActiveToolTab}
        setRightDrawerOpen={setRightDrawerOpen}
        handleFileUpload={handleFileUpload}
        dragActive={dragActive}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-700 p-6 bg-gradient-to-r from-gray-900/50 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
              {activeTab === 'avatar' && <User className="w-6 h-6 text-white" />}
              {activeTab === 'tryon' && <Shirt className="w-6 h-6 text-white" />}
              {activeTab === 'pose' && <Users className="w-6 h-6 text-white" />}
              {activeTab === 'accessories' && <Sparkles className="w-6 h-6 text-white" />}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">{getPageTitle()}</h1>
              <p className="text-sm text-gray-400">Create professional AI-generated avatars and outfits with advanced technology</p>
            </div>
            <div className="ml-auto">
              {getDisplayImages().length > 0 && (
                <button 
                  onClick={() => openCarousel(getDisplayImages())} 
                  className="p-3 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800/50 transition-all duration-200 hover:transform hover:scale-105 backdrop-blur-sm border border-gray-700 hover:border-gray-600"
                  title="Maximize view"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto relative">
          <ResultDisplay
            activeTab={activeTab}
            generatedAvatars={generatedAvatars}
            tryonResults={tryonResults}
            poseResults={poseResults}
            accessoriesResults={accessoriesResults}
            openCarousel={openCarousel}
            handleDownload={handleDownload}
          />
        </div>
      </div>

      {/* Right Sidebar */}
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
        
        // Generated data with new types
        generatedAvatars={generatedAvatars}
        tryonResults={tryonResults}
        poseResults={poseResults}
        accessoriesResults={accessoriesResults}
        
        // New callback handlers
        onAvatarGenerated={handleAvatarGenerated}
        onTryOnGenerated={handleTryOnGenerated}
        onPoseGenerated={handlePoseGenerated}
        onAccessoriesGenerated={handleAccessoriesGenerated}
        
        // Progress handlers
        onAvatarProgress={handleAvatarProgress}
        onTryOnProgress={handleTryOnProgress}
        onPoseProgress={handlePoseProgress}
        onAccessoriesProgress={handleAccessoriesProgress}
        
        // File upload handlers
        handleFileUpload={handleFileUpload}
        handleGarmentUpload={handleGarmentUpload}
        handlePoseReferenceUpload={handlePoseReferenceUpload}
        
        // Add this line in your RightSidebar props
        initializeAvatarGeneration={initializeAvatarGeneration}
        
        // Drag and drop
        dragActive={dragActive}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        
        // Additional data
        uploadedGarments={uploadedGarments}
        addUploadedGarment={addUploadedGarment}
        removeUploadedGarment={removeUploadedGarment}
        uploadedPoseReferences={uploadedPoseReferences}
        addUploadedPoseReference={addUploadedPoseReference}
        removeUploadedPoseReference={removeUploadedPoseReference}
      />

      {/* Toggle for closed right sidebar */}
      {!rightDrawerOpen && (
        <button
          onClick={() => setRightDrawerOpen(true)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-l-md border border-gray-700 border-r-0 text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      
      {/* Image Carousel */}
      {/* {carouselOpen && (
        <ImageCarousel
          images={carouselImages}
          currentSlide={currentCarouselSlide}
          setCurrentSlide={setCurrentSlide}
          zoom={carouselZoom}
          setZoom={setCarouselZoom}
          position={carouselPosition}
          setPosition={setCarouselPosition}
          onClose={closeCarousel}
        />
      )} */}
    </div>
  );
};