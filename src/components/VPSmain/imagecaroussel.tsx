import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  onClose: () => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  currentSlide,
  setCurrentSlide,
  zoom,
  setZoom,
  position,
  setPosition,
  onClose
}) => {
  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % images.length);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + images.length) % images.length);
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

  if (images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-medium text-white">Image Gallery</h2>
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
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
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