// Utility functions for handling image loading with error recovery

export interface ImageLoadOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (url: string, error: Error) => void;
  onSuccess?: (url: string) => void;
}

export const createImageWithRetry = (
  url: string, 
  options: ImageLoadOptions = {}
): Promise<HTMLImageElement> => {
  const { maxRetries = 3, retryDelay = 1000, onError, onSuccess } = options;
  
  return new Promise((resolve, reject) => {
    let retryCount = 0;
    
    const attemptLoad = () => {
      const img = new Image();
      
      img.onload = () => {
        console.log('✅ Image loaded successfully:', url);
        onSuccess?.(url);
        resolve(img);
      };
      
      img.onerror = (error) => {
        retryCount++;
        console.error(`❌ Image load attempt ${retryCount} failed:`, url, error);
        
        if (retryCount < maxRetries) {
          console.log(`🔄 Retrying image load in ${retryDelay}ms... (${retryCount}/${maxRetries})`);
          setTimeout(attemptLoad, retryDelay);
        } else {
          console.error(`❌ Image load failed after ${maxRetries} attempts:`, url);
          onError?.(url, new Error(`Failed to load image after ${maxRetries} attempts`));
          reject(new Error(`Failed to load image: ${url}`));
        }
      };
      
      // Add crossOrigin attribute to handle CORS
      img.crossOrigin = 'anonymous';
      img.src = url;
    };
    
    attemptLoad();
  });
};

// Removed JSX functions from utility file - these should be in components

// Function to test if an image URL is accessible
export const testImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('❌ Image URL test failed:', url, error);
    return false;
  }
};

// Function to create a fallback image URL (e.g., placeholder service)
export const createFallbackImageUrl = (text: string = 'Image'): string => {
  const encodedText = encodeURIComponent(text);
  return `https://via.placeholder.com/300x200/374151/9CA3AF?text=${encodedText}`;
};
