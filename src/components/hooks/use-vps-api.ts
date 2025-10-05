import { useState } from 'react';

// API base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Mock API functions - replace with actual API calls
export const useVPSAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAvatar = async (formData: Record<string, unknown>, onProgress?: (data: Record<string, unknown>) => void) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock progress updates
      if (onProgress) {
        onProgress({
          id: `avatar-${Date.now()}`,
          angle: 'Front view',
          url: 'https://via.placeholder.com/400x600/6366f1/ffffff?text=Avatar+Generated',
          isLoading: false
        });
      }
    } catch (err) {
      setError('Failed to generate avatar');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const tryOn = async (formData: Record<string, unknown>, avatarUrls: string[], onProgress?: (data: Record<string, unknown>) => void) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock progress updates
      if (onProgress) {
        onProgress({
          id: `tryon-${Date.now()}`,
          image_url: 'https://via.placeholder.com/400x600/10b981/ffffff?text=Try-On+Generated',
          isLoading: false
        });
      }
    } catch (err) {
      setError('Failed to generate try-on');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const transferPose = async (formData: Record<string, unknown>, avatarUrls: string[], onProgress?: (data: Record<string, unknown>) => void) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock progress updates
      if (onProgress) {
        onProgress({
          id: `pose-${Date.now()}`,
          image_url: 'https://via.placeholder.com/400x600/f59e0b/ffffff?text=Pose+Transferred',
          isLoading: false
        });
      }
    } catch (err) {
      setError('Failed to transfer pose');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadGarments = async (files: File[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Upload files using the new upload API endpoint
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.url && !result.signedUrl) {
          throw new Error('File upload failed: No valid URL returned.');
        }

        return {
          url: result.url || result.signedUrl,
          name: file.name,
          fileId: result.fileId,
          size: result.size,
          contentType: result.contentType
        };
      });
      
      const uploadedFiles = await Promise.all(uploadPromises);
      
      return {
        success: true,
        uploaded: uploadedFiles
      };
    } catch (err) {
      setError('Failed to upload garments');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPoseReference = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Upload file using the new upload API endpoint
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();

      if (!result.url && !result.signedUrl) {
        throw new Error('Pose reference upload failed: No valid URL returned.');
      }
      
      return {
        success: true,
        url: result.url || result.signedUrl,
        fileId: result.fileId,
        size: result.size,
        contentType: result.contentType
      };
    } catch (err) {
      setError('Failed to upload pose reference');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // General file upload function
  const uploadFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();

      if (!result.url && !result.signedUrl) {
        throw new Error('File upload failed: No valid URL returned.');
      }
      
      return {
        success: true,
        url: result.url || result.signedUrl,
        fileId: result.fileId,
        size: result.size,
        contentType: result.contentType,
        filename: result.filename || file.name
      };
    } catch (err) {
      setError('Failed to upload file');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateAvatar,
    tryOn,
    transferPose,
    uploadGarments,
    uploadPoseReference,
    uploadFile,
    isLoading,
    error
  };
};

