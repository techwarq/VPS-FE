// VPS Types
export interface VPSState {
  activeTab: 'avatar' | 'tryon' | 'pose' | 'accessories';
  avatarForm: Partial<AvatarGenerationRequest>;
  tryonForm: Partial<TryOnRequest>;
  poseForm: Partial<PoseRequest>;
  generationJobs: GenerationJob[];
  isGenerating: boolean;
  currentJob: GenerationJob | null;
  // Workflow state
  generatedAvatars: AvatarImage[];
  tryonResults: TryOnResult[];
  poseResults: PoseResult[];
  uploadedGarments: string[];
  uploadedPoseReferences: string[];
}

export interface AvatarGenerationRequest {
  subject?: string;
  hair_color?: string;
  eye_color?: string;
  ethnicity?: string;
  age?: number;
  gender?: string;
  hairstyle?: string;
  clothing?: string;
  framing?: string;
  style?: string;
  background?: string;
  aspect_ratio?: string;
  negative_prompt?: string;
  guidance?: number;
  steps?: number;
}

export interface TryOnRequest {
  items: TryOnItem[];
  aspect_ratio?: string;
  style?: string;
  negative_prompt?: string;
}

export interface TryOnItem {
  image: string;
  garment: string;
  prompt?: string;
  background_prompt?: string;
  reference_images?: string[];
  style?: string;
}

export interface PoseRequest {
  items: PoseItem[];
  aspect_ratio?: string;
}

export interface PoseItem {
  image: string;
  poseref: string;
  pose_prompt?: string;
  background_prompt?: string;
}

export interface GenerationJob {
  id: string;
  type: 'avatar' | 'tryon' | 'pose';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: unknown;
  error?: string;
  timestamp: number;
}

// Updated result types to match component expectations
export interface AvatarImage {
  id: string;
  angle: string;
  url: string;
  isLoading?: boolean;
}

export interface TryOnResult {
  id: string;
  url: string; // Changed from image_url to url
  item_index?: number; // Added to match streaming result
  isLoading?: boolean;
}

export interface PoseResult {
  id: string;
  url: string; // Changed from image_url to url
  item_index?: number; // Added to match streaming result
  isLoading?: boolean;
}

// Additional types for file uploads and API responses
export interface UploadedAsset {
  id: string;
  url: string;
  name: string;
}

export interface UploadResponse {
  status: string;
  value?: {
    url: string;
    name?: string;
  };
}

export interface APIResponse {
  success: boolean;
  data?: {
    url: string;
  };
  uploaded?: Array<{ url: string }>;
  urls?: string[];
  url?: string;
}

// Component prop types
export interface CarouselProps {
  images: string[];
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  onClose: () => void;
}

export interface ResultDisplayProps {
  activeTab: string;
  generatedAvatars: AvatarImage[];
  tryonResults: TryOnResult[];
  poseResults: PoseResult[];
  openCarousel: (images: string[]) => void;
  handleDownload: (imageUrl: string, index: number) => void;
}

// Constants
export const HAIR_COLORS = [
  'Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White', 'Auburn', 'Chestnut'
];

export const EYE_COLORS = [
  'Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Amber', 'Violet'
];

export const ETHNICITIES = [
  'Caucasian', 'African', 'Asian', 'Hispanic', 'Middle Eastern', 'South Asian', 'Mixed'
];

export const GENDERS = [
  'Male', 'Female', 'Non-binary'
];

export const FRAMING_OPTIONS = [
  'Headshot', 'Half-body', 'Full-body', 'Close-up'
];

export const ASPECT_RATIOS = [
  '1:1', '3:4', '4:3', '16:9', '9:16'
];

export const STYLE_PRESETS = [
  'studio headshot, soft diffused lighting, realistic skin texture',
  'professional portrait, clean background, natural lighting',
  'fashion photography, dramatic lighting, high contrast',
  'casual lifestyle, natural outdoor lighting, relaxed pose',
  'editorial style, artistic composition, creative lighting'
];

export const BACKGROUND_PRESETS = [
  'neutral gray seamless backdrop',
  'white studio background',
  'black studio background',
  'natural outdoor environment',
  'modern office setting',
  'minimalist home interior'
];
