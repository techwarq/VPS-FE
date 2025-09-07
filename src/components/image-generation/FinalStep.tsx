import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PhotoshootRequest, ImageGroup, ModelImage } from '@/services/api';

interface FinalStepProps {
  onNext: (data: PhotoshootRequest) => void;
  onBack: () => void;
  initialData?: PhotoshootRequest;
  photoshootImages?: ModelImage[];
}

const finalPrompts = [
  'Create a high-end fashion editorial look',
  'Add professional retouching and color grading',
  'Make it look like a luxury brand campaign',
  'Add dramatic shadows and highlights',
  'Create a magazine cover quality image',
  'Add sophisticated lighting effects',
  'Make it look like a professional photoshoot',
  'Add artistic filters and post-processing'
];

export const FinalStep: React.FC<FinalStepProps> = ({ 
  onNext, 
  onBack, 
  initialData,
  photoshootImages = []
}) => {
  const [groups, setGroups] = useState<ImageGroup[]>(initialData?.groups || []);

  const addGroup = () => {
    const newGroup: ImageGroup = {
      prompt: '',
      images: []
    };
    setGroups([...groups, newGroup]);
  };

  const updateGroupPrompt = (index: number, prompt: string) => {
    const updatedGroups = [...groups];
    updatedGroups[index].prompt = prompt;
    setGroups(updatedGroups);
  };

  const addImageToGroup = (groupIndex: number, image: ModelImage) => {
    const updatedGroups = [...groups];
    if (!updatedGroups[groupIndex].images) {
      updatedGroups[groupIndex].images = [];
    }
    updatedGroups[groupIndex].images.push(image);
    setGroups(updatedGroups);
  };

  const removeImageFromGroup = (groupIndex: number, imageIndex: number) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].images.splice(imageIndex, 1);
    setGroups(updatedGroups);
  };

  const removeGroup = (index: number) => {
    const updatedGroups = groups.filter((_, i) => i !== index);
    setGroups(updatedGroups);
  };

  const handleNext = () => {
    if (groups.length > 0 && groups.every(group => group.prompt && group.images.length > 0)) {
      onNext({ groups });
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Final Composite Generation" variant="glow">
        <div className="space-y-6">
          {/* Available Photoshoot Images */}
          {photoshootImages.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-400 mb-4">Available Photoshoot Images</h4>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 max-h-32 overflow-y-auto">
                {photoshootImages.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden border border-gray-600"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:${image.mimeType};base64,${image.data}`}
                      alt={`Photoshoot Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Processing Groups */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-green-400">Final Processing Groups</h4>
              <Button variant="outline" onClick={addGroup} size="sm">
                Add Group
              </Button>
            </div>

            {groups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">✨</div>
                <p>No final processing groups created yet</p>
                <p className="text-sm">Click &quot;Add Group&quot; to start creating final composite groups</p>
              </div>
            ) : (
              <div className="space-y-4">
                {groups.map((group, groupIndex) => (
                  <div key={groupIndex} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="text-sm font-medium text-green-400">Final Group {groupIndex + 1}</h5>
                      <Button 
                        variant="danger" 
                        onClick={() => removeGroup(groupIndex)} 
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>

                    {/* Final Processing Prompt */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-green-400 mb-2">
                        Final Processing Instructions
                      </label>
                      <div className="space-y-1 mb-2">
                        {finalPrompts.map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => updateGroupPrompt(groupIndex, prompt)}
                            className={`w-full p-2 rounded border transition-all duration-200 text-left text-xs ${
                              group.prompt === prompt
                                ? 'border-green-500 bg-green-500/10 text-green-400'
                                : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                            }`}
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={group.prompt}
                        onChange={(e) => updateGroupPrompt(groupIndex, e.target.value)}
                        placeholder="Describe the final processing you want to apply..."
                        className="w-full h-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-green-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                      />
                    </div>

                    {/* Images */}
                    <div>
                      <label className="block text-xs font-medium text-green-400 mb-2">
                        Images ({group.images.length})
                      </label>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-2">
                        {group.images.map((image, imageIndex) => (
                          <div key={imageIndex} className="relative">
                            <div className="aspect-square rounded-lg overflow-hidden border border-gray-600">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`data:${image.mimeType};base64,${image.data}`}
                                alt={`Final Group ${groupIndex + 1} Image ${imageIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={() => removeImageFromGroup(groupIndex, imageIndex)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs hover:bg-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add Images */}
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {photoshootImages.map((image, imageIndex) => (
                          <button
                            key={imageIndex}
                            onClick={() => addImageToGroup(groupIndex, image)}
                            className="aspect-square rounded-lg overflow-hidden border border-gray-600 hover:border-green-500 transition-colors"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`data:${image.mimeType};base64,${image.data}`}
                              alt={`Available Image ${imageIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Final Processing Info */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 className="text-sm font-medium text-green-400 mb-2">✨ Final Processing</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• This step creates the final polished images</p>
              <p>• Applies professional retouching and color grading</p>
              <p>• Enhances lighting, shadows, and overall composition</p>
              <p>• Creates publication-ready fashion photography</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back: Photoshoot Generation
        </Button>
        <Button 
          onClick={handleNext}
          disabled={groups.length === 0 || !groups.every(group => group.prompt && group.images.length > 0)}
          size="lg"
          className="glow-green-strong"
        >
          🎨 Generate Final Images
        </Button>
      </div>
    </div>
  );
};
