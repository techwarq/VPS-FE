'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/sidebar/sidebar';
import AnimatedChatUI from '@/components/chatui/components/chatbox';
import ModelPreview from '@/components/chatui/components/right-layout';
import ActionPopup from '@/components/chatui/components/ActionPopup';
import AvatarFormPopup, { AvatarFormData, ModelCharacteristics } from '@/components/chatui/components/AvatarFormPopup'; // Import ModelCharacteristics
import TryonPopup, { TryonFormData } from '@/components/chatui/components/TryonPopup';
import { useVPSAPI } from '@/components/hooks/use-vps-api';

export interface GeneratedModel { // New interface
  modelIndex: number;
  characteristics: ModelCharacteristics; // Assuming basic characteristics are returned or can be inferred
  angles: Array<{ id: number; url: string; angle: string }>;
}

export default function ChatUI() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatState, setChatState] = useState<'initial' | 'active' | 'workmode'>('initial');
  const [rightPanelMinimized, setRightPanelMinimized] = useState(false);
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [showAvatarForm, setShowAvatarForm] = useState(false);
  const [showTryonPopup, setShowTryonPopup] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: number; url: string; name: string; modelIndex?: number }>>([]);
  const [generatedModels, setGeneratedModels] = useState<GeneratedModel[]>([]); // Changed from generatedAvatars
  const [isGeneratingAvatars, setIsGeneratingAvatars] = useState(false);
  const [isGeneratingTryon, setIsGeneratingTryon] = useState(false);
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [showTryonPrompt, setShowTryonPrompt] = useState(false);
  const [tryonResults, setTryonResults] = useState<Map<number, Array<{ id: number; url: string; angle: string }>>>(new Map()); // avatarIndex -> try-on images
  const { chatPhotoshoot, generateAvatarAPI, tryOnAPI, isLoading: isChatLoading } = useVPSAPI();

  // Debug: Log when generatedAvatars changes
  useEffect(() => {
    console.log('🔄 generatedAvatars state changed:', generatedModels);
    console.log('🔄 generatedAvatars length:', generatedModels.length);
    if (generatedModels.length > 0) {
      console.log('🔄 First avatar URL:', generatedModels[0].angles[0]?.url);
    }
  }, [generatedModels]);

  // Note: uploadedImages should only contain manually uploaded images, not generated models

  // Handle model selection from uploaded grid
  const handleModelSelect = (imageId: number) => {
    // Find the uploaded image and use its modelIndex
    const selectedImage = uploadedImages.find(img => img.id === imageId);
    if (selectedImage && selectedImage.modelIndex !== undefined) {
      setSelectedModelIndex(selectedImage.modelIndex);
    } else {
      // Fallback: find by image ID matching model ID
      const modelIndex = generatedModels.findIndex(
        (model, index) => {
          const modelId = model.modelIndex !== undefined ? model.modelIndex : index + 1;
          return modelId === imageId;
        }
      );
      if (modelIndex !== -1) {
        setSelectedModelIndex(modelIndex);
      }
    }
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleWorkmode = () => {
    // Automatically collapse sidebar when chatbox enters workmode
    if (!sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  };

  const handleStateChange = (state: 'initial' | 'active' | 'workmode') => {
    setChatState(state);
  };

  const toggleRightPanelMinimize = () => {
    setRightPanelMinimized(!rightPanelMinimized);
    // When minimizing the right panel, switch chat to active mode
    if (!rightPanelMinimized) {
      setChatState('active');
    } else {
      // When expanding the right panel, switch back to workmode
      setChatState('workmode');
    }
  };

  const isWorkmode = chatState === 'workmode';

  // Determine if right panel should be shown
  // Only show when generation is actively happening or we have results in workmode
  const shouldShowRightPanel = (isGeneratingAvatars || isGeneratingTryon || (generatedModels.length > 0 && isWorkmode) || (tryonResults.size > 0 && isWorkmode)) && (isWorkmode || rightPanelMinimized);

  // Example handlers for the popup actions
  const handleUploadOwn = () => {
    console.log('Upload own clicked');
    setShowAvatarPopup(false);
    // Add your upload logic here
  };

  const handleGenerate = () => {
    console.log('Generate clicked');
    setShowAvatarPopup(false);
    setShowAvatarForm(true);
  };

  const handleAvatarFormSubmit = async (formData: AvatarFormData) => {
    console.log('Avatar form submitted:', formData);
    setShowAvatarForm(false);

    // Keep chat in active mode until generation actually starts
    // Don't transition to workmode or show right panel yet

    try {
      // Start generation - this will trigger the transition
      setIsGeneratingAvatars(true);

      // NOW transition to workmode and show right panel
      setChatState('workmode');
      if (!sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
      const accumulatedModels: GeneratedModel[] = []; // New accumulator for models

      // Call avatar generation API with onProgress callback
      await generateAvatarAPI(formData, (streamingResult) => {
        console.log('Streaming Avatar Result:', streamingResult);

        const { modelIndex, characteristics, angles } = streamingResult;

        // Find or create the model entry
        let currentModel = accumulatedModels.find(model => model.modelIndex === modelIndex);
        if (!currentModel) {
          currentModel = {
            modelIndex: modelIndex,
            characteristics: characteristics, // Assuming characteristics are part of the streaming result
            angles: []
          };
          accumulatedModels.push(currentModel);
        }

        // Process angles for the current model
        if (angles && Array.isArray(angles)) {
          angles.forEach((angleResult) => {
            if (angleResult.images && Array.isArray(angleResult.images)) {
              angleResult.images.forEach((img) => {
                const url = img.signedUrl || (img as { url?: string }).url || '';
                if (url) {
                  currentModel?.angles.push({
                    id: Date.now() + Math.random(), // Unique ID
                    url: url,
                    angle: angleResult.name || 'unknown' // Assuming angle name is available
                  });
                }
              });
            } else {
              console.warn(`Angle result for model ${modelIndex} has no images array:`, angleResult);
            }
          });
        } else {
          console.warn(`Streaming result for model ${modelIndex} has no angles array:`, streamingResult);
        }

        // Update state with accumulated models
        setGeneratedModels([...accumulatedModels]);

        console.log('After processing stream chunk, accumulatedModels length:', accumulatedModels.length);
      });

      // After streaming is complete, ensure final state is set
      if (accumulatedModels.length > 0) {
        console.log('Final generated models count:', accumulatedModels.length);
        // Show try-on prompt when generation completes
        setShowTryonPrompt(true);
      } else {
        console.error('❌ No models or images found in avatar streaming response!');
      }
    } catch (error) {
      console.error('Avatar generation failed:', error);
      // TODO: Show error message to user
    } finally {
      setIsGeneratingAvatars(false);
    }
  };

  const handleContinueInChat = () => {
    setShowAvatarForm(false);
    setShowTryonPopup(false);
    // Focus on chat input
    setTimeout(() => {
      const chatInput = document.querySelector('input[placeholder="Ask anything"]') as HTMLInputElement;
      if (chatInput) {
        chatInput.focus();
      }
    }, 300);
  };

  const handleTryonFormSubmit = async (formData: TryonFormData) => {
    console.log('Try-on form submitted:', formData);
    setShowTryonPopup(false);
    setShowTryonPrompt(false);

    // Keep chat in active mode until generation actually starts
    // Don't transition to workmode or show right panel yet

    try {
      // Start generation - this will trigger the transition
      setIsGeneratingTryon(true);

      // NOW transition to workmode and show right panel
      setChatState('workmode');
      if (!sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
      await tryOnAPI(
        {
          selectedAvatarIndices: formData.selectedAvatarIndices,
          selectedAvatars: formData.selectedAvatars,
          selectedGarments: formData.selectedGarments,
          garmentAssignments: formData.garmentAssignments,
        },
        (streamingResult) => {
          console.log('Streaming Try-On Result:', streamingResult);
          // Handle streaming results - map them to the correct avatar and show immediately
          // item_index corresponds to the index in the items array (which matches selectedAvatars order)
          if (streamingResult.images && streamingResult.images.length > 0) {
            const itemIndex = streamingResult.item_index ?? 0;
            // Map item_index to the original avatar index from generatedModels
            const avatarIndex = formData.selectedAvatarIndices[itemIndex] ?? itemIndex;

            // Get existing results for this avatar
            setTryonResults(prevResults => {
              const newResults = new Map(prevResults);
              const existingResults = newResults.get(avatarIndex) || [];

              if (streamingResult.images && Array.isArray(streamingResult.images)) {
                streamingResult.images.forEach((img) => {
                  const url = img.signedUrl || (img as { url?: string }).url || '';
                  if (url) {
                    // Check if this image already exists (avoid duplicates)
                    const imageExists = existingResults.some(r => r.url === url);
                    if (!imageExists) {
                      existingResults.push({
                        id: Date.now() + Math.random(),
                        url: url,
                        angle: `Try-On ${existingResults.length + 1}`,
                      });
                    }
                  }
                });
              }

              newResults.set(avatarIndex, existingResults);

              // If we have results, we can stop showing loading for that avatar
              // But keep loading state if we're still expecting more results
              return newResults;
            });
          }
        }
      );
    } catch (error) {
      console.error('Try-on generation failed:', error);
      // TODO: Show error message to user
    } finally {
      setIsGeneratingTryon(false);
    }
  };

  const handleProceed = () => {
    console.log('Proceed clicked');
    setShowAvatarPopup(false);
    // Add your proceed logic here
  };

  const handleRemoveImage = (id: number) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-950">
      {/* Enhanced Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal-900/15 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/30 via-transparent to-teal-950/20" />

      {/* Subtle animated glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content wrapper */}
      <div className="relative z-0 flex w-full">
        <Sidebar
          isOpen={true}
          onClose={toggleCollapse}
          isCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className={`flex-1 flex overflow-hidden ${shouldShowRightPanel && !rightPanelMinimized ? 'flex-row' : ''}`}>
            {/* Chat Section */}
            <div className={`${shouldShowRightPanel && !rightPanelMinimized ? 'w-1/2 ' : 'w-full'} overflow-hidden`}>
              <AnimatedChatUI
                onWorkmode={handleWorkmode}
                onStateChange={handleStateChange}
                onShowAvatarPopup={() => setShowAvatarPopup(true)}
                onShowTryonPopup={() => setShowTryonPopup(true)}
                uploadedImages={uploadedImages}
                onRemoveImage={handleRemoveImage}
                onSendMessage={chatPhotoshoot}
                isChatLoading={isChatLoading}
                onModelSelect={handleModelSelect}
                showTryonPrompt={showTryonPrompt}
                onTryonPromptYes={() => {
                  setShowTryonPrompt(false);
                  setShowTryonPopup(true);
                }}
                onTryonPromptNo={() => setShowTryonPrompt(false)}
              />
            </div>

            {/* Model Preview Section - Only show when generation is actually happening */}
            {/* Don't show until generation starts (isGeneratingAvatars or isGeneratingTryon is true) */}
            {/* Only show if actively generating OR if we have results AND are in workmode */}
            {shouldShowRightPanel && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={rightPanelMinimized ? '' : 'w-[90%] overflow-hidden'}
              >
                <ModelPreview
                  isMinimized={rightPanelMinimized}
                  onToggleMinimize={toggleRightPanelMinimize}
                  models={generatedModels.length > 0 ? generatedModels : undefined} // Changed to models prop
                  isLoading={isGeneratingAvatars || isGeneratingTryon}
                  selectedModelIndex={selectedModelIndex}
                  onModelSelect={setSelectedModelIndex}
                  tryonResults={tryonResults}
                  isTryonMode={isGeneratingTryon || tryonResults.size > 0}
                />
                {/* Debug info */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 text-xs rounded z-50">
                    <div>Workmode: {isWorkmode ? 'yes' : 'no'}</div>
                    <div>Generating: {isGeneratingAvatars ? 'yes' : 'no'}</div>
                    <div>Avatars: {generatedModels.length}</div>
                    <div>Right Panel Minimized: {rightPanelMinimized ? 'yes' : 'no'}</div>
                    <div>Chat State: {chatState}</div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </main>

        {/* Avatar Action Popup - Can be triggered from anywhere */}
        <ActionPopup
          isOpen={showAvatarPopup}
          title="Okay lets start with avatar!"
          onClose={() => setShowAvatarPopup(false)}
          onPrimaryAction={handleUploadOwn}
          onSecondaryAction={handleGenerate}
          onTertiaryAction={handleProceed}
          primaryLabel="upload ur owns"
          secondaryLabel="generate"
          tertiaryLabel="proceed"
          showTertiary={true}
        />

        {/* Avatar Form Popup */}
        <AvatarFormPopup
          isOpen={showAvatarForm}
          onClose={() => setShowAvatarForm(false)}
          onSubmit={handleAvatarFormSubmit}
          onContinueInChat={handleContinueInChat}
        />

        {/* Try-On Popup */}
        <TryonPopup
          isOpen={showTryonPopup}
          onClose={() => setShowTryonPopup(false)}
          onSubmit={handleTryonFormSubmit}
          onContinueInChat={handleContinueInChat}
          generatedModels={generatedModels}
        />
      </div>
    </div>
  );
}

