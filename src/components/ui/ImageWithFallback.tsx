import React, { useState, useEffect } from 'react';
import { createImageWithRetry, testImageUrl, createFallbackImageUrl } from '../../utils/imageUtils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  showLoadingState?: boolean;
  onError?: (url: string, error: Error) => void;
  onSuccess?: (url: string) => void;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackText = 'Failed to load',
  showLoadingState = true,
  onError,
  onSuccess
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    if (!src) {
      setImageState('error');
      return;
    }

    setImageState('loading');
    setCurrentSrc(src);

    // Test if the image URL is accessible
    testImageUrl(src)
      .then((isAccessible) => {
        if (isAccessible) {
          setImageState('loaded');
          onSuccess?.(src);
        } else {
          throw new Error('Image URL not accessible');
        }
      })
      .catch((error) => {
        console.error('❌ Image URL test failed:', src, error);
        setImageState('error');
        onError?.(src, error);
      });
  }, [src, onError, onSuccess]);

  const handleImageError = () => {
    console.error('❌ Image failed to load:', currentSrc);
    setImageState('error');
    onError?.(currentSrc, new Error('Image failed to load'));
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', currentSrc);
    setImageState('loaded');
    onSuccess?.(currentSrc);
  };

  if (imageState === 'loading' && showLoadingState) {
    return (
      <div className={`${className} bg-gray-700 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
      </div>
    );
  }

  if (imageState === 'error') {
    return (
      <div className={`${className} bg-gray-700 flex items-center justify-center`}>
        <span className="text-gray-400 text-xs text-center px-2">{fallbackText}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      crossOrigin="anonymous"
      onError={handleImageError}
      onLoad={handleImageLoad}
    />
  );
};
