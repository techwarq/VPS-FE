import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  onClose: () => void;
  onDownload?: (imageUrl: string, index: number) => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  currentSlide,
  setCurrentSlide,
  zoom,
  setZoom,
  position,
  setPosition,
  onClose,
  onDownload
}) => {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % images.length;
    console.log('🔍 Next slide:', newSlide);
    setCurrentSlide(newSlide);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const prevSlide = () => {
    const newSlide = (currentSlide - 1 + images.length) % images.length;
    console.log('🔍 Previous slide:', newSlide);
    setCurrentSlide(newSlide);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoom(Math.min(zoom + 0.5, 3));
  };

  const zoomOut = () => {
    setZoom(Math.max(zoom - 0.5, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleImageDrag = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (images.length === 0) {
    console.log('🔍 ImageCarousel: No images to display');
    return null;
  }

  console.log('🔍 ImageCarousel: Rendering with', images.length, 'images, current slide:', currentSlide);
  
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium text-white">Image Gallery</h2>
          <p className="text-sm text-gray-400 mt-1">
            Use arrow keys to navigate, +/- to zoom, 0 to reset, ESC to close
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={zoomOut}
              className="p-2 bg-gray-800/70 rounded-full text-white hover:bg-gray-700 transition-colors"
              title="Zoom Out"
            >
              <span className="text-lg font-bold">-</span>
            </button>
            <span className="text-white text-sm min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={zoomIn}
              className="p-2 bg-gray-800/70 rounded-full text-white hover:bg-gray-700 transition-colors"
              title="Zoom In"
            >
              <span className="text-lg font-bold">+</span>
            </button>
            <button 
              onClick={resetZoom}
              className="px-3 py-1 bg-gray-800/70 rounded text-white hover:bg-gray-700 transition-colors text-sm"
              title="Reset Zoom"
            >
              Reset
            </button>
          </div>
          <div className="flex items-center gap-2">
            {onDownload && (
              <button 
                onClick={() => onDownload(images[currentSlide], currentSlide)}
                className="text-gray-400 hover:text-white"
                title="Download image"
              >
                <Download className="w-6 h-6" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Image Display */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {images.length > 1 && (
          <button 
            onClick={prevSlide}
            className="absolute left-6 p-2 bg-gray-800/70 rounded-full text-white hover:bg-gray-700 transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}
        
        <div 
          className="flex items-center justify-center w-full h-full cursor-move"
          onMouseDown={handleImageDrag}
        >
          <img 
            src={images[currentSlide]} 
            alt={`Image ${currentSlide + 1}`} 
            className="max-h-full max-w-full object-contain select-none"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transition: zoom === 1 ? 'transform 0.3s ease' : 'none'
            }}
            draggable={false}
          />
        </div>
        
        {images.length > 1 && (
          <button 
            onClick={nextSlide}
            className="absolute right-6 p-2 bg-gray-800/70 rounded-full text-white hover:bg-gray-700 transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
      
      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="p-4 flex justify-center">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setZoom(1);
                  setPosition({ x: 0, y: 0 });
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-white' : 'bg-gray-500 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};