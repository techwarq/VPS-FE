import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ModelGenerationRequest } from '@/services/api';

interface ModelsStepProps {
  onNext: (data: ModelGenerationRequest) => void;
  initialData?: ModelGenerationRequest;
}

const ethnicities = ['asian', 'caucasian', 'african', 'hispanic', 'middle eastern', 'mixed'];
const skinTones = ['fair', 'light', 'medium', 'olive', 'tan', 'dark', 'deep'];
const eyeColors = ['brown', 'blue', 'green', 'hazel', 'gray', 'amber'];
const hairStyles = ['short wavy', 'long straight', 'curly', 'afro', 'buzz cut', 'bob', 'ponytail', 'braids'];
const hairColors = ['black', 'brown', 'blonde', 'red', 'gray', 'white', 'auburn'];
const clothingStyles = ['streetwear', 'formal', 'casual', 'sporty', 'vintage', 'modern', 'bohemian', 'minimalist'];

export const ModelsStep: React.FC<ModelsStepProps> = ({ onNext, initialData }) => {
  const [gender, setGender] = useState<'male' | 'female'>(initialData?.gender || 'female');
  const [ethnicity, setEthnicity] = useState(initialData?.ethnicity || 'caucasian');
  const [age, setAge] = useState(initialData?.age || 25);
  const [skinTone, setSkinTone] = useState(initialData?.skinTone || 'medium');
  const [eyeColor, setEyeColor] = useState(initialData?.eyeColor || 'brown');
  const [hairStyle, setHairStyle] = useState(initialData?.hairStyle || 'long straight');
  const [hairColor, setHairColor] = useState(initialData?.hairColor || 'brown');
  const [clothingStyle, setClothingStyle] = useState(initialData?.clothingStyle || 'casual');
  const [count, setCount] = useState(initialData?.count || 4);

  const handleNext = () => {
    onNext({
      gender,
      ethnicity,
      age,
      skinTone,
      eyeColor,
      hairStyle,
      hairColor,
      clothingStyle,
      count
    });
  };

  return (
    <div className="space-y-6">
      <Card title="Generate Model Images" variant="glow">
        <div className="space-y-6">
          {/* Gender Selection */}
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-4">Gender</h4>
            <div className="flex gap-4">
              <button
                onClick={() => setGender('female')}
                className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                  gender === 'female'
                    ? 'border-green-500 bg-green-500/10 glow-green'
                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">👩</div>
                <div className="text-sm font-medium text-green-400">Female</div>
              </button>
              <button
                onClick={() => setGender('male')}
                className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                  gender === 'male'
                    ? 'border-green-500 bg-green-500/10 glow-green'
                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">👨</div>
                <div className="text-sm font-medium text-green-400">Male</div>
              </button>
            </div>
          </div>

          {/* Basic Characteristics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Ethnicity
              </label>
              <select
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {ethnicities.map((eth) => (
                  <option key={eth} value={eth} className="bg-gray-800">
                    {eth.charAt(0).toUpperCase() + eth.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Age: {age}
              </label>
              <input
                type="range"
                min="18"
                max="60"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>18</span>
                <span>60</span>
              </div>
            </div>
          </div>

          {/* Physical Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Skin Tone
              </label>
              <div className="grid grid-cols-3 gap-2">
                {skinTones.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSkinTone(tone)}
                    className={`p-2 rounded-lg border-2 transition-all duration-200 text-xs ${
                      skinTone === tone
                        ? 'border-green-500 bg-green-500/10 glow-green'
                        : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Eye Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {eyeColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEyeColor(color)}
                    className={`p-2 rounded-lg border-2 transition-all duration-200 text-xs ${
                      eyeColor === color
                        ? 'border-green-500 bg-green-500/10 glow-green'
                        : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hair */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Hair Style
              </label>
              <select
                value={hairStyle}
                onChange={(e) => setHairStyle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {hairStyles.map((style) => (
                  <option key={style} value={style} className="bg-gray-800">
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Hair Color
              </label>
              <select
                value={hairColor}
                onChange={(e) => setHairColor(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {hairColors.map((color) => (
                  <option key={color} value={color} className="bg-gray-800">
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clothing and Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Clothing Style
              </label>
              <select
                value={clothingStyle}
                onChange={(e) => setClothingStyle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {clothingStyles.map((style) => (
                  <option key={style} value={style} className="bg-gray-800">
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Number of Models: {count}
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>8</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleNext} size="lg">
          Next: Generate Poses
        </Button>
      </div>
    </div>
  );
};
