import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  type: 'model' | 'pose' | 'background' | 'photoshoot' | 'final';
  metadata?: {
    count?: number;
    gender?: string;
    ethnicity?: string;
    age?: number;
    skinTone?: string;
    eyeColor?: string;
    hairStyle?: string;
    hairColor?: string;
    clothingStyle?: string;
    locationType?: string;
    locationDetail?: string;
    cameraAngle?: string;
    lightingStyle?: string;
    mood?: string;
    aspect_ratio?: string;
  };
  tags?: string[];
  base64Data?: string;
  mimeType?: string;
}

export interface ImageGenerationStep {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  data?: unknown;
}

interface ImageStore {
  // Generated images
  images: GeneratedImage[];
  selectedImage: GeneratedImage | null;
  
  // Generation workflow
  currentStep: number;
  steps: ImageGenerationStep[];
  isGenerating: boolean;
  
  // Actions
  addImage: (image: GeneratedImage) => void;
  removeImage: (id: string) => void;
  selectImage: (image: GeneratedImage | null) => void;
  updateImageMetadata: (id: string, metadata: Partial<GeneratedImage>) => void;
  
  // Workflow actions
  setCurrentStep: (step: number) => void;
  updateStep: (stepId: string, data: unknown) => void;
  completeStep: (stepId: string) => void;
  resetWorkflow: () => void;
  setGenerating: (generating: boolean) => void;
  
  // Search and filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredImages: GeneratedImage[];
}

const defaultSteps: ImageGenerationStep[] = [
  {
    id: 'models',
    name: 'Generate Models',
    description: 'Create model images with specific characteristics',
    completed: false
  },
  {
    id: 'poses',
    name: 'Generate Poses',
    description: 'Create dynamic poses using Gemini and Runway',
    completed: false
  },
  {
    id: 'backgrounds',
    name: 'Generate Backgrounds',
    description: 'Create photoshoot backgrounds with FLUX',
    completed: false
  },
  {
    id: 'photoshoot',
    name: 'Photoshoot Generation',
    description: 'Combine models with backgrounds and poses',
    completed: false
  },
  {
    id: 'final',
    name: 'Final Composite',
    description: 'Create final polished images',
    completed: false
  }
];

export const useImageStore = create<ImageStore>()(
  persist(
    (set) => ({
      // Initial state
      images: [],
      selectedImage: null,
      currentStep: 0,
      steps: defaultSteps,
      isGenerating: false,
      searchQuery: '',
      filteredImages: [],

      // Image actions
      addImage: (image) => set((state) => ({
        images: [image, ...state.images],
        filteredImages: [image, ...state.filteredImages]
      })),

      removeImage: (id) => set((state) => ({
        images: state.images.filter(img => img.id !== id),
        filteredImages: state.filteredImages.filter(img => img.id !== id),
        selectedImage: state.selectedImage?.id === id ? null : state.selectedImage
      })),

      selectImage: (image) => set({ selectedImage: image }),

      updateImageMetadata: (id, metadata) => set((state) => ({
        images: state.images.map(img => 
          img.id === id ? { ...img, ...metadata } : img
        ),
        filteredImages: state.filteredImages.map(img => 
          img.id === id ? { ...img, ...metadata } : img
        )
      })),

      // Workflow actions
      setCurrentStep: (step) => set({ currentStep: step }),

      updateStep: (stepId, data) => set((state) => ({
        steps: state.steps.map(step => 
          step.id === stepId ? { ...step, data } : step
        )
      })),

      completeStep: (stepId) => set((state) => ({
        steps: state.steps.map(step => 
          step.id === stepId ? { ...step, completed: true } : step
        )
      })),

      resetWorkflow: () => set({
        currentStep: 0,
        steps: defaultSteps.map(step => ({ ...step, completed: false, data: undefined })),
        isGenerating: false
      }),

      setGenerating: (generating) => set({ isGenerating: generating }),

      // Search and filter
      setSearchQuery: (query) => set((state) => {
        const filtered = state.images.filter(img => 
          img.prompt.toLowerCase().includes(query.toLowerCase()) ||
          img.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        return { searchQuery: query, filteredImages: filtered };
      })
    }),
    {
      name: 'image-store',
      partialize: (state) => ({
        images: state.images,
        selectedImage: state.selectedImage
      })
    }
  )
);
