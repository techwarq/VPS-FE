import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BackgroundGenerationRequest } from '@/services/api';

interface BackgroundsStepProps {
  onNext: (data: BackgroundGenerationRequest) => void;
  onBack: () => void;
  initialData?: BackgroundGenerationRequest;
}

const locationTypes = [
  'urban rooftop', 'beach', 'forest', 'studio', 'city street', 
  'mountain', 'desert', 'garden', 'warehouse', 'hotel lobby'
];

const locationDetails = [
  'city skyline at dusk', 'sunset over ocean', 'mountain peaks', 
  'neon lights', 'golden hour', 'rainy day', 'snow covered',
  'industrial setting', 'luxury interior', 'natural lighting'
];

const cameraAngles = [
  'eye-level', 'low angle', 'high angle', 'bird\'s eye view',
  'dutch angle', 'wide shot', 'close-up', 'medium shot'
];

const lightingStyles = [
  'soft golden hour', 'dramatic shadows', 'natural daylight',
  'studio lighting', 'neon glow', 'candlelight', 'sunset',
  'blue hour', 'harsh sunlight', 'soft diffused'
];

const moods = [
  'cinematic', 'dramatic', 'romantic', 'mysterious', 'energetic',
  'peaceful', 'edgy', 'elegant', 'vintage', 'futuristic'
];

const aspectRatios = ['1:1', '16:9', '4:3', '3:2', '9:16'];

export const BackgroundsStep: React.FC<BackgroundsStepProps> = ({ 
  onNext, 
  onBack, 
  initialData 
}) => {
  const [locationType, setLocationType] = useState(initialData?.locationType || 'urban rooftop');
  const [locationDetail, setLocationDetail] = useState(initialData?.locationDetail || 'city skyline at dusk');
  const [cameraAngle, setCameraAngle] = useState(initialData?.cameraAngle || 'eye-level');
  const [lightingStyle, setLightingStyle] = useState(initialData?.lightingStyle || 'soft golden hour');
  const [mood, setMood] = useState(initialData?.mood || 'cinematic');
  const [aspect_ratio, setAspectRatio] = useState(initialData?.aspect_ratio || '1:1');
  const [count, setCount] = useState(initialData?.count || 2);

  const handleNext = () => {
    onNext({
      locationType,
      locationDetail,
      cameraAngle,
      lightingStyle,
      mood,
      aspect_ratio,
      count
    });
  };

  return (
    <div className="space-y-6">
      <Card title="Generate Photoshoot Backgrounds" variant="glow">
        <div className="space-y-6">
          {/* Location Type */}
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-4">Location Type</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {locationTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setLocationType(type)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                    locationType === type
                      ? 'border-green-500 bg-green-500/10 glow-green'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <div className="text-xs font-medium text-green-400">{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location Detail */}
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-4">Location Detail</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {locationDetails.map((detail) => (
                <button
                  key={detail}
                  onClick={() => setLocationDetail(detail)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                    locationDetail === detail
                      ? 'border-green-500 bg-green-500/10 glow-green'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <div className="text-xs font-medium text-green-400">{detail}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Camera Angle */}
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-4">Camera Angle</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {cameraAngles.map((angle) => (
                <button
                  key={angle}
                  onClick={() => setCameraAngle(angle)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                    cameraAngle === angle
                      ? 'border-green-500 bg-green-500/10 glow-green'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <div className="text-xs font-medium text-green-400">{angle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Lighting Style */}
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-4">Lighting Style</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {lightingStyles.map((lighting) => (
                <button
                  key={lighting}
                  onClick={() => setLightingStyle(lighting)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                    lightingStyle === lighting
                      ? 'border-green-500 bg-green-500/10 glow-green'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <div className="text-xs font-medium text-green-400">{lighting}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-4">Mood</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {moods.map((moodOption) => (
                <button
                  key={moodOption}
                  onClick={() => setMood(moodOption)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                    mood === moodOption
                      ? 'border-green-500 bg-green-500/10 glow-green'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <div className="text-xs font-medium text-green-400">{moodOption}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio and Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                      aspect_ratio === ratio
                        ? 'border-green-500 bg-green-500/10 glow-green'
                        : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-sm font-medium text-green-400">{ratio}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Number of Backgrounds: {count}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>6</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 className="text-sm font-medium text-green-400 mb-2">Background Preview</h4>
            <div className="text-sm text-gray-300">
              <p><span className="text-gray-500">Location:</span> {locationType} with {locationDetail}</p>
              <p><span className="text-gray-500">Camera:</span> {cameraAngle} view</p>
              <p><span className="text-gray-500">Lighting:</span> {lightingStyle}</p>
              <p><span className="text-gray-500">Mood:</span> {mood}</p>
              <p><span className="text-gray-500">Format:</span> {aspect_ratio} ({count} backgrounds)</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back: Generate Poses
        </Button>
        <Button onClick={handleNext} size="lg">
          Next: Photoshoot Generation
        </Button>
      </div>
    </div>
  );
};
