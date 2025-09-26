import React from 'react';
import { User, Shirt, Users, Maximize2, Download, Loader2 } from 'lucide-react';

interface ResultDisplayProps {
  activeTab: 'avatar' | 'tryon' | 'pose' | 'accessories';
  generatedAvatars: any[];
  tryonResults: any[];
  poseResults: any[];
  openCarousel: (images: string[]) => void;
  handleDownload: (imageUrl: string, index: number) => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  activeTab,
  generatedAvatars,
  tryonResults,
  poseResults,
  openCarousel,
  handleDownload
}) => {
  // Create loading placeholders for avatar generation
  const createAvatarPlaceholders = () => {
    const angles = ['front', 'left-3/4', 'right-3/4', 'profile-left', 'profile-right'];
    const placeholders = [];
    
    for (let i = 0; i < 5; i++) {
      const angle = angles[i];
      const existing = generatedAvatars.find(avatar => avatar.angle === angle);
      
      if (existing) {
        // Show the actual generated image
        placeholders.push(existing);
      } else {
        // Show loading placeholder
        placeholders.push({
          id: `placeholder-${angle}`,
          angle: angle,
          isLoading: true,
          url: null
        });
      }
    }
    
    return placeholders;
  };

  const renderImageGrid = (
    items: any[], 
    urlKey: string, 
    labelPrefix: string,
    emptyIcon: React.ComponentType<any>,
    emptyTitle: string,
    emptyDescription: string,
    showPlaceholders: boolean = false
  ) => {
    // For avatars, show placeholders during generation
    const displayItems = showPlaceholders && activeTab === 'avatar' 
      ? createAvatarPlaceholders() 
      : items;

    // Show empty state only if no items and no generation in progress
    if (!Array.isArray(displayItems) || displayItems.length === 0) {
      const EmptyIcon = emptyIcon;
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <EmptyIcon className="w-12 h-12 text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">{emptyTitle}</h3>
          <p className="text-gray-500">{emptyDescription}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 bg-black">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">
            {labelPrefix}
            {showPlaceholders && activeTab === 'avatar' && (
              <span className="text-sm text-gray-400 ml-2">
                ({displayItems.filter(item => !item.isLoading).length}/5 generated)
              </span>
            )}
          </h3>
          <button
            onClick={() => {
              const urls = displayItems
                .filter(item => !item.isLoading && item[urlKey])
                .map(item => item[urlKey]);
              if (urls.length > 0) {
                openCarousel(urls);
              }
            }}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            disabled={displayItems.every(item => item.isLoading)}
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayItems.map((item, index) => {
            // Loading placeholder
            if (item.isLoading) {
              return (
                <div 
                  key={item.id || `loading-${index}`} 
                  className="relative group w-full h-64 bg-gray-800 rounded-lg flex flex-col items-center justify-center animate-pulse border border-gray-700"
                >
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-2" />
                  <div className="text-gray-400 text-sm">Generating...</div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-white text-xs rounded-b-lg text-center">
                    {item.angle || `Image ${index + 1}`}
                  </div>
                </div>
              );
            }
            
            // Actual result
            const imageUrl = item[urlKey];
            if (!imageUrl) return null;
            
            return (
              <div key={item.id || imageUrl || index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`${labelPrefix} ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg border border-gray-700"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg">
                  <button
                    onClick={() => handleDownload(imageUrl, index)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm rounded-b-lg text-center">
                  {item.angle || `${labelPrefix} ${index + 1}`}
                </div>
                {/* Success indicator */}
                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'avatar':
        // Show placeholders if generation has started (even if generatedAvatars is empty)
        const hasAvatarGeneration = generatedAvatars.length > 0;
        return renderImageGrid(
          generatedAvatars,
          'url',
          'Generated Avatars',
          User,
          'No Avatars Generated Yet',
          'Configure parameters in the right sidebar and click Generate to create avatars',
          hasAvatarGeneration // Show placeholders only if generation has started
        );
      
      case 'tryon':
        return renderImageGrid(
          tryonResults,
          'url', // Updated to use 'url' instead of 'image_url'
          'Try-On Results',
          Shirt,
          'No Try-On Results Yet',
          'Configure parameters in the right sidebar and click Generate to try on garments'
        );
      
      case 'pose':
        return renderImageGrid(
          poseResults,
          'url', // Updated to use 'url' instead of 'image_url'
          'Pose Transfer Results',
          Users,
          'No Pose Results Yet',
          'Configure parameters in the right sidebar and click Generate to transfer poses'
        );
      
      case 'accessories':
        return renderImageGrid(
          [], // Empty array for now - you can add accessories results later
          'url',
          'Accessories Results',
          Users, // You can import Sparkles icon if needed
          'No Accessories Results Yet',
          'Configure parameters in the right sidebar and click Generate to add accessories'
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};