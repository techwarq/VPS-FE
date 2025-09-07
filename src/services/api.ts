// API service for photoshoot backend integration

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
  count: number;
}

export interface ModelImage {
  mimeType: string;
  data: string; // base64
}

export interface ModelGenerationResponse {
  images: ModelImage[];
  metadata: {
    count: number;
    timestamp: number;
  };
}

// Pose Generation Types
export interface PoseGenerationRequest {
  prompt: string;
  count: number;
  geminiImage: ModelImage;
  runwayImageUrl: string;
  ratio: string;
  runwayModel: string;
}

export interface PoseGenerationResponse {
  geminiResults: ModelImage[];
  runwayTaskIds: string[];
  metadata: {
    count: number;
    timestamp: number;
  };
}

// Background Generation Types
export interface BackgroundGenerationRequest {
  locationType: string;
  locationDetail: string;
  cameraAngle: string;
  lightingStyle: string;
  mood: string;
  aspect_ratio: string;
  count: number;
}

export interface BackgroundGenerationResponse {
  taskIds: string[];
  pollingUrls: string[];
  metadata: {
    count: number;
    timestamp: number;
  };
}

// Photoshoot/Final Generation Types
export interface ImageGroup {
  prompt: string;
  images: ModelImage[];
}

export interface PhotoshootRequest {
  groups: ImageGroup[];
}

export interface PhotoshootResponse {
  results: ModelImage[];
  metadata: {
    groupCount: number;
    totalImages: number;
    timestamp: number;
  };
}

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Photoshoot API endpoints
  async generateModels(request: ModelGenerationRequest): Promise<ApiResponse<ModelGenerationResponse>> {
    return this.request<ModelGenerationResponse>('/api/photoshoot/models', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generatePoses(request: PoseGenerationRequest): Promise<ApiResponse<PoseGenerationResponse>> {
    return this.request<PoseGenerationResponse>('/api/photoshoot/pose', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateBackgrounds(request: BackgroundGenerationRequest): Promise<ApiResponse<BackgroundGenerationResponse>> {
    return this.request<BackgroundGenerationResponse>('/api/photoshoot/background', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generatePhotoshoot(request: PhotoshootRequest): Promise<ApiResponse<PhotoshootResponse>> {
    return this.request<PhotoshootResponse>('/api/photoshoot/shoot', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateFinal(request: PhotoshootRequest): Promise<ApiResponse<PhotoshootResponse>> {
    return this.request<PhotoshootResponse>('/api/photoshoot/final', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Utility endpoints
  async healthCheck(): Promise<ApiResponse<{ status: string; version: string }>> {
    return this.request<{ status: string; version: string }>('/api/health');
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
  const blob = convertBase64ToBlob(image.data, image.mimeType);
  return URL.createObjectURL(blob);
};

export const downloadImage = (image: ModelImage, filename: string = 'generated-image.png'): void => {
  const blob = convertBase64ToBlob(image.data, image.mimeType);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
