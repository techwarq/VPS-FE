import React from 'react';
import { Download, Maximize2, Loader2 } from 'lucide-react';

interface ResultDisplayProps {
  activeTab: 'avatar' | 'tryon' | 'pose';
  generatedAvatars: Array<{ id: string; url: string; angle?: string; isLoading?: boolean }>;
  tryonResults: Array<{ id: string; url: string; item_index?: number }>;
  poseResults: Array<{ id: string; url: string; item_index?: number }>;
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
  const getCurrentResults = () => {
    switch (activeTab) {
      case 'avatar':
        return generatedAvatars;
      case 'tryon':
        return tryonResults;
      case 'pose':
        return poseResults;
      default:
        return [];
    }
  };

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 'avatar':
        return 'No avatars generated yet. Configure parameters and click Generate Avatar.';
      case 'tryon':
        return 'No try-on results yet. Generate avatars first, then try on garments.';
      case 'pose':
        return 'No pose transfers yet. Generate try-on results first, then transfer poses.';
      default:
        return 'No results to display.';
    }
  };

  const results = getCurrentResults();

  if (!results || results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Maximize2 className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No Results Yet</h3>
          <p className="text-gray-400 max-w-md">
            {getEmptyStateMessage()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((result, index) => {
          const imageUrl = result.url;
          const isLoading = 'isLoading' in result ? result.isLoading : false;
          
          return (
            <div key={result.id || index} className="relative group">
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  </div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`Result ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Maximize2 className="w-8 h-8" />
                  </div>
                )}
              </div>
              
              {/* Overlay actions */}
              {!isLoading && imageUrl && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDownload(imageUrl, index)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => openCarousel([imageUrl])}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    title="View full size"
                  >
                    <Maximize2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
              
              {/* Result info */}
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-300">
                  {'angle' in result ? result.angle : `Result ${index + 1}`}
                </p>
                {isLoading && (
                  <p className="text-xs text-gray-400">Generating...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

