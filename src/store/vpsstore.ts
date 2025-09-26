import { type Dispatch, type SetStateAction } from 'react';
import { create } from 'zustand';
import {
  VPSState,
  AvatarGenerationRequest,
  TryOnRequest,
  PoseRequest,
  GenerationJob,
  AvatarImage,
  TryOnResult,
  PoseResult,
} from '../types/index';

interface VPSStore extends VPSState {
  // Actions
  setActiveTab: (tab: 'avatar' | 'tryon' | 'pose' | 'accessories') => void;
  updateAvatarForm: (data: Partial<AvatarGenerationRequest>) => void;
  updateTryonForm: (data: Partial<TryOnRequest>) => void;
  updatePoseForm: (data: Partial<PoseRequest>) => void;
  addGenerationJob: (job: GenerationJob) => void;
  updateGenerationJob: (id: string, updates: Partial<GenerationJob>) => void;
  setGenerating: (isGenerating: boolean) => void;
  setCurrentJob: (job: GenerationJob | null) => void;
  clearJobs: () => void;
  resetForms: () => void;
  
  // Workflow actions
  // FIX: Update types to allow functional updates
  setGeneratedAvatars: Dispatch<SetStateAction<AvatarImage[]>>;
  setTryonResults: Dispatch<SetStateAction<TryOnResult[]>>;
  setPoseResults: Dispatch<SetStateAction<PoseResult[]>>;

  addUploadedGarment: (url: string) => void;
  removeUploadedGarment: (url: string) => void;
  addUploadedPoseReference: (url: string) => void;
  removeUploadedPoseReference: (url: string) => void;
  clearWorkflowData: () => void;
}

const defaultAvatarForm: Partial<AvatarGenerationRequest> = {
  hair_color: 'black',
  eye_color: 'brown',
  ethnicity: 'south asian',
  age: 26,
  gender: 'male',
  framing: 'half-body',
  style: 'studio headshot, soft diffused lighting, realistic skin texture',
  background: 'neutral gray seamless backdrop',
  aspect_ratio: '3:4',
  negative_prompt: 'blurry, low quality, deformed hands',
  guidance: 7.5,
  steps: 50,
};

const defaultTryonForm: Partial<TryOnRequest> = {
  items: [],
  aspect_ratio: '3:4',
  style: 'studio lighting, clean neutral background',
  negative_prompt: 'blurry, artifacts',
};

const defaultPoseForm: Partial<PoseRequest> = {
  items: [],
  aspect_ratio: '16:9',
};

export const useVPSStore = create<VPSStore>((set, get) => ({
  // Initial state
  activeTab: 'avatar',
  avatarForm: defaultAvatarForm,
  tryonForm: defaultTryonForm,
  poseForm: defaultPoseForm,
  generationJobs: [],
  isGenerating: false,
  currentJob: null,
  
  // Workflow state
  generatedAvatars: [],
  tryonResults: [],
  poseResults: [],
  uploadedGarments: [],
  uploadedPoseReferences: [],

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  updateAvatarForm: (data) =>
    set((state) => ({
      avatarForm: { ...state.avatarForm, ...data },
    })),

  updateTryonForm: (data) =>
    set((state) => ({
      tryonForm: { ...state.tryonForm, ...data },
    })),

  updatePoseForm: (data) =>
    set((state) => ({
      poseForm: { ...state.poseForm, ...data },
    })),

  addGenerationJob: (job) =>
    set((state) => ({
      generationJobs: [...state.generationJobs, job],
    })),

  updateGenerationJob: (id, updates) =>
    set((state) => ({
      generationJobs: state.generationJobs.map((job) =>
        job.id === id ? { ...job, ...updates } : job
      ),
    })),

  setGenerating: (isGenerating) => set({ isGenerating }),

  setCurrentJob: (currentJob) => set({ currentJob }),

  clearJobs: () => set({ generationJobs: [], currentJob: null }),

  resetForms: () =>
    set({
      avatarForm: defaultAvatarForm,
      tryonForm: defaultTryonForm,
      poseForm: defaultPoseForm,
    }),

  // Workflow actions
  // FIX: Update implementations to handle both value and function updaters
  setGeneratedAvatars: (updater) =>
    set((state) => ({
      generatedAvatars: typeof updater === 'function' ? updater(state.generatedAvatars) : updater,
    })),
  
  setTryonResults: (updater) =>
    set((state) => ({
      tryonResults: typeof updater === 'function' ? updater(state.tryonResults) : updater,
    })),
  
  setPoseResults: (updater) =>
    set((state) => ({
      poseResults: typeof updater === 'function' ? updater(state.poseResults) : updater,
    })),
  
  addUploadedGarment: (url) =>
    set((state) => ({
      uploadedGarments: [...state.uploadedGarments, url],
    })),
  
  removeUploadedGarment: (url) =>
    set((state) => ({
      uploadedGarments: state.uploadedGarments.filter((garment) => garment !== url),
    })),
  
  addUploadedPoseReference: (url) =>
    set((state) => ({
      uploadedPoseReferences: [...state.uploadedPoseReferences, url],
    })),
  
  removeUploadedPoseReference: (url) =>
    set((state) => ({
      uploadedPoseReferences: state.uploadedPoseReferences.filter((ref) => ref !== url),
    })),
  
  clearWorkflowData: () =>
    set({
      generatedAvatars: [],
      tryonResults: [],
      poseResults: [],
      uploadedGarments: [],
      uploadedPoseReferences: [],
    }),
}));