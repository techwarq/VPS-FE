import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PoseGenerationRequest, ModelImage } from '@/services/api';

interface PosesStepProps {
  onNext: (data: PoseGenerationRequest) => void;
  onBack: () => void;
  initialData?: PoseGenerationRequest;
  modelImages?: ModelImage[];
}

const posePrompts = [
  'Dynamic runway walk, camera low angle',
  'Confident standing pose, arms crossed',
  'Casual leaning pose against wall',
  'Elegant sitting pose, legs crossed',
  'Power pose with hands on hips',
  'Relaxed walking pose, natural movement',
  'Fashion forward pose, hand on hip',
  'Athletic pose, mid-movement'
];

const ratios = ['1024:1024', '1024:768', '768:1024', '1024:576', '576:1024'];
const runwayModels = ['gen4_image_turbo', 'gen4_video_turbo', 'gen3a_turbo'];

export const PosesStep: React.FC<PosesStepProps> = ({ 
  onNext, 
  onBack, 
  initialData,
  modelImages = []
}) => {
  const [prompt, setPrompt] = useState(initialData?.prompt || '');
  const [count, setCount] = useState(initialData?.count || 6);
  const [selectedModelImage, setSelectedModelImage] = useState<ModelImage | null>(
    initialData?.geminiImage || modelImages[0] || null
  );
  const [runwayImageUrl, setRunwayImageUrl] = useState(initialData?.runwayImageUrl || '');
  const [ratio, setRatio] = useState(initialData?.ratio || '1024:1024');
  const [runwayModel, setRunwayModel] = useState(initialData?.runwayModel || 'gen4_image_turbo');

  const handleNext = () => {
    if (selectedModelImage && runwayImageUrl) {
      onNext({
        prompt,
        count,
        geminiImage: selectedModelImage,
        runwayImageUrl,
        ratio,
        runwayModel
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1];
        const newImage: ModelImage = {
          mimeType: file.type,
          data: base64
        };
        setSelectedModelImage(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Generate Dynamic Poses" variant="glow">
        <div className="space-y-6">
          {/* Model Image Selection */}
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-4">Select Model Image</h4>
            {modelImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {modelImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedModelImage(image)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedModelImage === image
                        ? 'border-green-500 glow-green'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:${image.mimeType};base64,${image.data}`}
                      alt={`Model ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="model-upload"
                />
                <label
                  htmlFor="model-upload"
                  className="block w-full p-8 border-2 border-dashed border-gray-600 rounded-lg text-center cursor-pointer hover:border-green-500 transition-colors"
                >
                  <div className="text-4xl mb-2">📸</div>
                  <div className="text-green-400">Upload Model Image</div>
                  <div className="text-gray-500 text-sm mt-1">Click to select an image</div>
                </label>
              </div>
            )}
          </div>

          {/* Pose Prompt */}
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2">
              Pose Description
            </label>
            <div className="space-y-2 mb-4">
              {posePrompts.map((posePrompt, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(posePrompt)}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    prompt === posePrompt
                      ? 'border-green-500 bg-green-500/10 glow-green'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <div className="text-sm text-green-400">{posePrompt}</div>
                </button>
              ))}
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the pose you want to generate..."
              className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-green-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Runway Reference Image */}
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2">
              Runway Reference Image URL
            </label>
            <input
              type="url"
              value={runwayImageUrl}
              onChange={(e) => setRunwayImageUrl(e.target.value)}
              placeholder="https://example.com/reference-image.png"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-green-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL to a reference image for Runway pose generation
            </p>
          </div>

          {/* Generation Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Number of Poses: {count}
              </label>
              <input
                type="range"
                min="2"
                max="12"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2</span>
                <span>12</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Aspect Ratio
              </label>
              <select
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {ratios.map((r) => (
                  <option key={r} value={r} className="bg-gray-800">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Runway Model
              </label>
              <select
                value={runwayModel}
                onChange={(e) => setRunwayModel(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {runwayModels.map((model) => (
                  <option key={model} value={model} className="bg-gray-800">
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back: Generate Models
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!selectedModelImage || !runwayImageUrl}
          size="lg"
        >
          Next: Generate Backgrounds
        </Button>
      </div>
    </div>
  );
};
