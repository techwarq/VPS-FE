import { useState } from 'react';
import { AuthService } from '@/services/auth.service';
import { apiService, AvatarGenerationRequest, StreamingAvatarResult, StreamingTryOnResult } from '@/services/api'; // Import apiService and types
import { AvatarFormData, ModelCharacteristics } from '@/components/chatui/components/AvatarFormPopup'; // Import AvatarFormData and ModelCharacteristics

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
        
        const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Access the URL from the nested 'file' object if it exists, otherwise assume top-level
        const fileUrl = result.file?.url || result.file?.signedUrl || result.url || result.signedUrl;
        const fileName = result.file?.filename || result.file?.name || file.name;
        const fileId = result.file?.fileId || result.fileId;
        const fileSize = result.file?.size || result.size;
        const fileContentType = result.file?.contentType || result.contentType;

        if (!fileUrl) {
          throw new Error('File upload failed: No valid URL returned.');
        }

        return {
          url: fileUrl,
          name: fileName,
          fileId: fileId,
          size: fileSize,
          contentType: fileContentType
        };
      });
      
      const uploadedFiles = await Promise.all(uploadPromises);
      
      return {
        success: true,
        uploaded: uploadedFiles
      };
    } catch (err) {
      setError(`Failed to upload garments: ${err instanceof Error ? err.message : String(err)}`);
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
      
      const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();

      // Access the URL from the nested 'file' object if it exists, otherwise assume top-level
      const fileUrl = result.file?.url || result.file?.signedUrl || result.url || result.signedUrl;
      const fileId = result.file?.fileId || result.fileId;
      const fileSize = result.file?.size || result.size;
      const fileContentType = result.file?.contentType || result.contentType;

      if (!fileUrl) {
        throw new Error('Pose reference upload failed: No valid URL returned.');
      }
      
      return {
        success: true,
        url: fileUrl,
        fileId: fileId,
        size: fileSize,
        contentType: fileContentType
      };
    } catch (err) {
      setError(`Failed to upload pose reference: ${err instanceof Error ? err.message : String(err)}`);
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
      
      const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();

      // Access the URL from the nested 'file' object if it exists, otherwise assume top-level
      const fileUrl = result.file?.url || result.file?.signedUrl || result.url || result.signedUrl;
      const fileId = result.file?.fileId || result.fileId;
      const fileSize = result.file?.size || result.size;
      const fileContentType = result.file?.contentType || result.contentType;
      const fileName = result.file?.filename || result.file?.name || file.name;

      if (!fileUrl) {
        throw new Error('File upload failed: No valid URL returned.');
      }
      
      return {
        success: true,
        url: fileUrl,
        fileId: fileId,
        size: fileSize,
        contentType: fileContentType,
        filename: fileName
      };
    } catch (err) {
      setError(`Failed to upload file: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const chatPhotoshoot = async (
    userQuery: string,
    queryId?: number,
    onProgress?: (data: Record<string, unknown>) => void
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const requestBody = {
        userQuery,
        query_id: queryId || Date.now(),
        createdAt: new Date().toISOString()
      };

      const response = await AuthService.authenticatedFetch(
        `${API_BASE_URL}/api/photoshoot/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to send chat message' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Call progress callback if provided
      if (onProgress && result) {
        onProgress(result);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send chat message';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateAvatarAPI = async (
    formData: AvatarFormData, // Changed to new AvatarFormData interface
    onProgress?: (result: StreamingAvatarResult) => void
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const requestBody: AvatarGenerationRequest = {
        models: formData.models.map((model: ModelCharacteristics) => ({
          subject: model.description,
          gender: model.gender === '' ? undefined : model.gender,
          hairstyle: model.hairstyle === '' ? undefined : model.hairstyle,
          ethnicity: model.ethnicity === '' ? undefined : model.ethnicity,
          age: model.age === '' ? undefined : parseInt(model.age.split('-')[0]),
          clothing: model.bodyType === '' ? undefined : model.bodyType,
        })),
        style: formData.style === '' ? undefined : formData.style,
        background: formData.background === '' ? undefined : formData.background,
        aspect_ratio: formData.aspect_ratio === '' ? undefined : formData.aspect_ratio,
        framing: formData.framing === '' ? undefined : formData.framing,
      };

      console.log('Sending Avatar Generation Request:', requestBody); // Debug log

      const response = await apiService.generateAvatar(requestBody, onProgress);

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate avatar');
      }
      
      return response.data; // Return the aggregated data from apiService
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const tryOnAPI = async (
    formData: { 
      selectedAvatarIndices: number[];
      selectedAvatars: Array<{ modelIndex: number; characteristics: unknown; angles: Array<{ id: number; url: string; angle: string }> }>; 
      selectedGarments: Array<{ id: string; url: string; label: string }>;
      garmentAssignments: Array<{ avatarIndex: number; garmentIds: string[] }>;
    },
    onProgress?: (result: StreamingTryOnResult) => void
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare try-on request - one item per avatar/model
      // Each item contains all angles for that avatar + only the garments assigned to it
      // Structure: items[avatar1 {avatar_images: [...], garment_images: [...]}, avatar2 {...}, ...]
      const tryOnItems = formData.selectedAvatars.map((avatar, index: number) => {
        // Get the original avatar index from generatedModels array
        const originalAvatarIndex = formData.selectedAvatarIndices[index];
        
        // Find the garment assignment for this avatar using the original index
        const assignment = formData.garmentAssignments.find(
          a => a.avatarIndex === originalAvatarIndex
        );
        
        // Get the garment URLs for assigned garments
        const assignedGarmentUrls = assignment && assignment.garmentIds.length > 0
          ? formData.selectedGarments
              .filter(g => assignment.garmentIds.includes(g.id))
              .map(g => g.url)
          : [];

        return {
          avatar_images: avatar.angles.map((angle) => angle.url),
          garment_images: assignedGarmentUrls,
        };
      });

      const request = {
        items: tryOnItems,
        aspect_ratio: '3:4', // Default, can be made configurable
        style: undefined,
        negative_prompt: undefined,
      };

      const response = await apiService.tryOn(request, onProgress);

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate try-on');
      }
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate try-on';
      setError(errorMessage);
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
    chatPhotoshoot,
    generateAvatarAPI,
    tryOnAPI,
    isLoading,
    error
  };
};

