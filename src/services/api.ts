// API service for photoshoot backend integration with streaming support

import { ModelCharacteristics } from '@/components/chatui/components/AvatarFormPopup'; // Import ModelCharacteristics

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Model Generation Types
export interface ModelGenerationRequest {
  gender: 'male' | 'female';
  ethnicity: string;
  age: number;
  skinTone: string;
  eyeColor: string;
  hairStyle: string;
  hairColor: string;
  clothingStyle: string;
  count?: number;
  aspect_ratio?: string;
}

export interface ModelImage {
  mimeType?: string;
  data?: string; // base64
  fileId?: string;
  filename?: string;
  size?: number;
  contentType?: string;
  signedUrl?: string;
}

// Backend streaming response types
export interface StreamingModelResult {
  id: string;
  status: 'completed' | 'failed';
  images?: ModelImage[];
  text?: string;
  error?: string;
  createdAt: Date;
}

export interface StreamingPoseResult {
  id: string;
  status: 'completed' | 'failed';
  images?: ModelImage[];
  text?: string;
  error?: string;
  createdAt: Date;
}

export interface StreamingBackgroundResult {
  id: string;
  status: 'completed' | 'failed';
  images?: ModelImage[];
  text?: string;
  error?: string;
  createdAt: Date;
}

export interface StreamingPhotoshootResult {
  groupIndex: number;
  status: 'completed' | 'failed';
  images?: ModelImage[];
  text?: string;
  error?: string;
  createdAt: Date;
}

export interface StreamingAvatarResult {
  modelIndex: number; // New field
  characteristics: ModelCharacteristics; // Corrected type
  angles: Array<{
    name: string;
    prompt?: string;
    images?: ModelImage[];
    text?: string;
    error?: string;
    storedInGridFS?: boolean; // New field
  }>; // Redefined to contain angles
  text?: string;
  error?: string;
  storedInGridFS?: boolean; // Existing field from previous example
}

export interface StreamingTryOnResult {
  item_index: number;
  step: number;
  total_steps: number;
  images?: ModelImage[];
  text?: string;
  prompt?: string;
  error?: string;
}

export interface StreamingPoseTransferResult {
  item_index: number;
  mode: 'pose_reference' | 'pose_prompt' | 'pose_both';
  images?: ModelImage[];
  text?: string;
  background_prompt?: string;
  pose_prompt?: string;
  error?: string;
}

// Frontend response types (aggregated from streaming)
export interface ModelGenerationResponse {
  results: StreamingModelResult[];
  metadata: {
    totalCount: number;
    completedCount: number;
    failedCount: number;
    timestamp: number;
  };
}

export interface PoseGenerationResponse {
  results: StreamingPoseResult[];
  metadata: {
    totalCount: number;
    completedCount: number;
    failedCount: number;
    timestamp: number;
  };
}

export interface BackgroundGenerationResponse {
  results: StreamingBackgroundResult[];
  metadata: {
    totalCount: number;
    completedCount: number;
    failedCount: number;
    timestamp: number;
  };
}

export interface PhotoshootResponse {
  results: StreamingPhotoshootResult[];
  metadata: {
    totalGroups: number;
    completedGroups: number;
    failedGroups: number;
    timestamp: number;
  };
}

export interface AvatarResponse {
  results: StreamingAvatarResult[];
  metadata: {
    totalAngles: number;
    completedAngles: number;
    failedAngles: number;
    timestamp: number;
  };
}

export interface TryOnResponse {
  results: StreamingTryOnResult[];
  metadata: {
    totalItems: number;
    completedItems: number;
    failedItems: number;
    timestamp: number;
  };
}

export interface PoseTransferResponse {
  results: StreamingPoseTransferResult[];
  metadata: {
    totalItems: number;
    completedItems: number;
    failedItems: number;
    timestamp: number;
  };
}

// Request types
export interface PoseGenerationRequest {
  prompt: string;
  count: number;
  geminiImage: ModelImage;
  aspect_ratio?: string;
}

export interface BackgroundGenerationRequest {
  locationType: string;
  locationDetail: string;
  cameraAngle: string;
  lightingStyle: string;
  mood: string;
  aspect_ratio?: string;
  count?: number;
}

export interface ImageGroup {
  prompt: string;
  images: ModelImage[];
}

export interface PhotoshootRequest {
  groups: ImageGroup[];
}

export interface AvatarGenerationRequest {
  models?: {
    subject?: string;
    hair_color?: string;
    eye_color?: string;
    hairstyle?: string;
    ethnicity?: string;
    age?: number;
    gender?: string;
    clothing?: string;
  }[];
  count?: number; // For Option 2
  subject?: string; // For Option 3
  gender?: string; // For Option 3
  hair_color?: string; // For Option 3
  eye_color?: string; // For Option 3
  hairstyle?: string; // For Option 3
  ethnicity?: string; // For Option 3
  age?: number; // For Option 3
  clothing?: string; // For Option 3
  framing?: string;
  body_scope?: string;
  bodyScope?: string;
  style?: string;
  background?: string;
  aspect_ratio?: string;
  negative_prompt?: string;
}

export interface TryOnItem {
  avatar_image?: ModelImage | string; // Support both ModelImage and URL string (legacy)
  avatar_images?: (ModelImage | string)[]; // Support multiple avatar angles for one model
  garment_images: (ModelImage | string)[]; // Support both ModelImage and URL string
  reference_model_images?: (ModelImage | string)[];
}

export interface TryOnRequest {
  items: TryOnItem[];
  aspect_ratio?: string;
  style?: string;
  negative_prompt?: string;
}

export interface PoseTransferItem {
  image: string; // Signed URL as string
  pose_reference?: string; // Signed URL as string
  background_prompt?: string;
  pose_prompt?: string;
}

export interface PoseTransferRequest {
  items: PoseTransferItem[];
  aspect_ratio?: string;
  negative_prompt?: string;
}

// Base API configuration
// Use NEXT_PUBLIC_API_URL if set, otherwise default to localhost:4000
// Note: Endpoints in this service expect /api prefix, so we add it if not present
const getApiBaseURL = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  // If baseURL doesn't end with /api, add it for this service
  return baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`;
};
const API_BASE_URL = getApiBaseURL();

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL || '') {
    this.baseURL = baseURL;
  }

  private async streamRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    onProgress?: (result: T) => void
  ): Promise<T[]> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      const results: T[] = [];
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last line in buffer (might be incomplete)
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          try {
            const result = JSON.parse(trimmedLine) as T;
            results.push(result);
            
            // Call progress callback if provided
            if (onProgress) {
              onProgress(result);
            }
          } catch (e) {
            console.warn('Failed to parse streaming line:', trimmedLine, e);
          }
        }
      }

      // Process any remaining buffer content
      if (buffer.trim()) {
        try {
          const result = JSON.parse(buffer.trim()) as T;
          results.push(result);
          if (onProgress) {
            onProgress(result);
          }
        } catch (e) {
          console.warn('Failed to parse final buffer:', buffer, e);
        }
      }

      return results;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown streaming error');
    }
  }

  private createMetadata<T extends { status?: string; error?: string }>(
    results: T[], 
    totalExpected?: number
  ) {
    const completed = results.filter(r => r.status === 'completed').length;
    const failed = results.filter(r => r.status === 'failed' || r.error).length;
    const total = totalExpected || results.length;

    return {
      totalCount: total,
      completedCount: completed,
      failedCount: failed,
      timestamp: Date.now(),
    };
  }

  // Photoshoot API endpoints with streaming support
  async generateModels(
    request: ModelGenerationRequest,
    onProgress?: (result: StreamingModelResult) => void
  ): Promise<ApiResponse<ModelGenerationResponse>> {
    try {
      // Add GridFS storage parameters
      const requestWithGridFS = {
        ...request,
        storeInGridFS: true,
        userId: 'user123'
      };
      
      const results = await this.streamRequest<StreamingModelResult>(
        '/photoshoot/models',
        {
          method: 'POST',
          body: JSON.stringify(requestWithGridFS),
        },
        onProgress
      );

      return {
        success: true,
        data: {
          results,
          metadata: this.createMetadata(results, request.count),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async generatePoses(
    request: PoseGenerationRequest,
    onProgress?: (result: StreamingPoseResult) => void
  ): Promise<ApiResponse<PoseGenerationResponse>> {
    try {
      // Add GridFS storage parameters
      const requestWithGridFS = {
        ...request,
        storeInGridFS: true,
        userId: 'user123'
      };
      
      const results = await this.streamRequest<StreamingPoseResult>(
        '/photoshoot/pose',
        {
          method: 'POST',
          body: JSON.stringify(requestWithGridFS),
        },
        onProgress
      );

      return {
        success: true,
        data: {
          results,
          metadata: this.createMetadata(results, request.count),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async generateBackgrounds(
    request: BackgroundGenerationRequest,
    onProgress?: (result: StreamingBackgroundResult) => void
  ): Promise<ApiResponse<BackgroundGenerationResponse>> {
    try {
      // Add GridFS storage parameters
      const requestWithGridFS = {
        ...request,
        storeInGridFS: true,
        userId: 'user123'
      };
      
      const results = await this.streamRequest<StreamingBackgroundResult>(
        '/photoshoot/background',
        {
          method: 'POST',
          body: JSON.stringify(requestWithGridFS),
        },
        onProgress
      );

      return {
        success: true,
        data: {
          results,
          metadata: this.createMetadata(results, request.count),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async generatePhotoshoot(
    request: PhotoshootRequest,
    onProgress?: (result: StreamingPhotoshootResult) => void
  ): Promise<ApiResponse<PhotoshootResponse>> {
    try {
      // Add GridFS storage parameters
      const requestWithGridFS = {
        ...request,
        storeInGridFS: true,
        userId: 'user123'
      };
      
      const results = await this.streamRequest<StreamingPhotoshootResult>(
        '/photoshoot/shoot',
        {
          method: 'POST',
          body: JSON.stringify(requestWithGridFS),
        },
        onProgress
      );

      return {
        success: true,
        data: {
          results,
          metadata: {
            totalGroups: request.groups.length,
            completedGroups: results.filter(r => r.status === 'completed').length,
            failedGroups: results.filter(r => r.status === 'failed').length,
            timestamp: Date.now(),
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async generateFinal(
    request: PhotoshootRequest,
    onProgress?: (result: StreamingPhotoshootResult) => void
  ): Promise<ApiResponse<PhotoshootResponse>> {
    try {
      // Add GridFS storage parameters
      const requestWithGridFS = {
        ...request,
        storeInGridFS: true,
        userId: 'user123'
      };
      
      const results = await this.streamRequest<StreamingPhotoshootResult>(
        '/photoshoot/final',
        {
          method: 'POST',
          body: JSON.stringify(requestWithGridFS),
        },
        onProgress
      );

      return {
        success: true,
        data: {
          results,
          metadata: {
            totalGroups: request.groups.length,
            completedGroups: results.filter(r => r.status === 'completed').length,
            failedGroups: results.filter(r => r.status === 'failed').length,
            timestamp: Date.now(),
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // New endpoints
  async generateAvatar(
    request: AvatarGenerationRequest,
    onProgress?: (result: StreamingAvatarResult) => void
  ): Promise<ApiResponse<AvatarResponse>> {
    try {
      // Add GridFS storage parameters
      const requestWithGridFS = {
        ...request,
        storeInGridFS: true,
        userId: 'user123'
      };
      
      const results = await this.streamRequest<StreamingAvatarResult>(
        '/photoshoot/avatar',
        {
          method: 'POST',
          body: JSON.stringify(requestWithGridFS),
        },
        onProgress
      );

      return {
        success: true,
        data: {
          results,
          metadata: {
            totalAngles: 5, // Always 5 angles
            completedAngles: results.flatMap(r => r.angles).filter(angle => angle.images && angle.images.length > 0).length,
            failedAngles: results.flatMap(r => r.angles).filter(angle => angle.error).length,
            timestamp: Date.now(),
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async tryOn(
    request: TryOnRequest,
    onProgress?: (result: StreamingTryOnResult) => void
  ): Promise<ApiResponse<TryOnResponse>> {
    try {
      // Add GridFS storage parameters
      const requestWithGridFS = {
        ...request,
        storeInGridFS: true,
        userId: 'user123'
      };
      
      const results = await this.streamRequest<StreamingTryOnResult>(
        '/photoshoot/tryon',
        {
          method: 'POST',
          body: JSON.stringify(requestWithGridFS),
        },
        onProgress
      );

      return {
        success: true,
        data: {
          results,
          metadata: {
            totalItems: request.items.length,
            completedItems: results.filter(r => r.images && r.images.length > 0).length,
            failedItems: results.filter(r => r.error).length,
            timestamp: Date.now(),
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async generatePoseTransfer(
    request: PoseTransferRequest,
    onProgress?: (result: StreamingPoseTransferResult) => void
  ): Promise<ApiResponse<PoseTransferResponse>> {
    try {
      // Add GridFS storage parameters
      const requestWithGridFS = {
        ...request,
        storeInGridFS: true,
        userId: 'user123'
      };
      
      const results = await this.streamRequest<StreamingPoseTransferResult>(
        '/photoshoot/pose-transfer',
        {
          method: 'POST',
          body: JSON.stringify(requestWithGridFS),
        },
        onProgress
      );

      return {
        success: true,
        data: {
          results,
          metadata: {
            totalItems: request.items.length,
            completedItems: results.filter(r => r.images && r.images.length > 0).length,
            failedItems: results.filter(r => r.error).length,
            timestamp: Date.now(),
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Utility endpoint
  async healthCheck(): Promise<ApiResponse<{ status: string; version: string }>> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Health check failed',
      };
    }
  }
}

export const apiService = new ApiService();

// Utility functions for common operations
export const convertBase64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

export const createImageUrl = (image: ModelImage): string => {
  // If we have a signedUrl, use it directly
  if (image.signedUrl) {
    return image.signedUrl;
  }
  
  // Fallback to base64 conversion for backward compatibility
  if (image.data && image.mimeType) {
    const blob = convertBase64ToBlob(image.data, image.mimeType);
    return URL.createObjectURL(blob);
  }
  
  // If neither format is available, return empty string
  return '';
};

export const downloadImage = (image: ModelImage, filename: string = 'generated-image.png'): void => {
  // If we have a signedUrl, download directly from it
  if (image.signedUrl) {
    const link = document.createElement('a');
    link.href = image.signedUrl;
    link.download = image.filename || filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }
  
  // Fallback to base64 conversion for backward compatibility
  if (image.data && image.mimeType) {
    const blob = convertBase64ToBlob(image.data, image.mimeType);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Helper function to aggregate all images from streaming results
export const getAllImages = (results: (StreamingModelResult | StreamingPoseResult | StreamingBackgroundResult | StreamingPhotoshootResult)[]): ModelImage[] => {
  return results
    .filter(r => r.images && r.images.length > 0)
    .flatMap(r => r.images!);
};

// Helper function to get successful results only
export const getSuccessfulResults = <T extends { status?: string; images?: ModelImage[]; error?: string }>(results: T[]): T[] => {
  return results.filter(r => r.status === 'completed' && r.images && r.images.length > 0);
};

// Helper function to get failed results only
export const getFailedResults = <T extends { status?: string; error?: string }>(results: T[]): T[] => {
  return results.filter(r => r.status === 'failed' || r.error);
};