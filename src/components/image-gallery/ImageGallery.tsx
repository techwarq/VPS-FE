import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useImageStore, GeneratedImage } from '@/store/imageStore';

export const ImageGallery: React.FC = () => {
  const { 
    filteredImages, 
    selectedImage, 
    selectImage, 
    removeImage, 
    searchQuery, 
    setSearchQuery 
  } = useImageStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleImageClick = (image: GeneratedImage) => {
    selectImage(image);
  };

  const handleDeleteImage = (imageId: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      removeImage(imageId);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black matrix-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-400 mb-2 glow-green">
              Image Gallery
            </h1>
            <p className="text-gray-400">
              {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} generated
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              onClick={() => setViewMode('grid')}
              size="sm"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              onClick={() => setViewMode('list')}
              size="sm"
            >
              List
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by prompt or tags..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-green-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Images Grid/List */}
        {filteredImages.length === 0 ? (
          <Card variant="outlined" className="text-center py-12">
            <div className="text-gray-500">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-medium text-gray-400 mb-2">No images found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search terms' : 'Generate your first image to get started'}
              </p>
            </div>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredImages.map((image) => (
              <Card
                key={image.id}
                variant={selectedImage?.id === image.id ? 'glow' : 'default'}
                className={`cursor-pointer transition-all duration-200 hover:glow-green ${
                  viewMode === 'list' ? 'flex flex-row' : ''
                }`}
                onClick={() => handleImageClick(image)}
              >
                {viewMode === 'grid' ? (
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-green-400 mb-2 line-clamp-2">
                        {image.prompt}
                      </h3>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{formatDate(image.timestamp)}</span>
                        <span>{image.type}</span>
                      </div>
                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {image.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {image.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{image.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 w-full">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-green-400 mb-1 line-clamp-1">
                        {image.prompt}
                      </h3>
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                        <span>{formatDate(image.timestamp)}</span>
                        <span>{image.type}</span>
                      </div>
                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {image.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(image.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
