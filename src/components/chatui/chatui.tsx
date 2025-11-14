'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/sidebar/sidebar';
import AnimatedChatUI from '@/components/chatui/components/chatbox';
import ModelPreview from '@/components/chatui/components/right-layout';
import ActionPopup from '@/components/chatui/components/ActionPopup';
import AvatarFormPopup, { AvatarFormData, ModelCharacteristics } from '@/components/chatui/components/AvatarFormPopup'; // Import ModelCharacteristics
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
  const [uploadedImages, setUploadedImages] = useState<Array<{id: number; url: string; name: string}>>([]);
  const [generatedModels, setGeneratedModels] = useState<GeneratedModel[]>([]); // Changed from generatedAvatars
  const [isGeneratingAvatars, setIsGeneratingAvatars] = useState(false);
  const { chatPhotoshoot, generateAvatarAPI, isLoading: isChatLoading } = useVPSAPI();

  // Debug: Log when generatedAvatars changes
  useEffect(() => {
    console.log('🔄 generatedAvatars state changed:', generatedModels);
    console.log('🔄 generatedAvatars length:', generatedModels.length);
    if (generatedModels.length > 0) {
      console.log('🔄 First avatar URL:', generatedModels[0].angles[0].url);
    }
  }, [generatedModels]);

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleWorkmode = () => {
    // Automatically collapse sidebar when chatbox enters workmode
    if (!sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
    
    // Add sample images for testing
    if (uploadedImages.length === 0) {
      setUploadedImages([
        { id: 1, url: 'https://i.pinimg.com/1200x/64/f1/68/64f16895a20a3ee2e4bbcbe3a3343057.jpg', name: 'avatar-1.jpg' },
        { id: 2, url: 'https://i.pinimg.com/1200x/0f/5a/0f/0f5a0f471e36cf19524d435b31f84624.jpg', name: 'avatar-2.jpg' },
        { id: 3, url: 'https://i.pinimg.com/736x/06/1e/0f/061e0f4d77fa2e91fe7022f5a44a3ff8.jpg', name: 'avatar-3.jpg' },
        { id: 4, url: 'https://i.pinimg.com/1200x/68/fc/a4/68fca438ce1dd7a2310deeb35d92a51e.jpg', name: 'avatar-4.jpg' },
      ]);
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
    
    // Immediately transition to workmode to show the right panel with loading state
    setChatState('workmode');
    if (!sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
    setIsGeneratingAvatars(true);
    
    try {
      let accumulatedModels: GeneratedModel[] = []; // New accumulator for models
      
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
          angles.forEach((angleResult: any) => {
            if (angleResult.images && Array.isArray(angleResult.images)) {
              angleResult.images.forEach((img: any, imgIndex: number) => {
                const url = img.signedUrl || img.url || img.signed_url || '';
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
    // Focus on chat input
    setTimeout(() => {
      const chatInput = document.querySelector('input[placeholder="Ask anything"]') as HTMLInputElement;
      if (chatInput) {
        chatInput.focus();
      }
    }, 300);
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
    <div className="fixed inset-0 flex bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      <Sidebar 
        isOpen={true} 
        onClose={toggleCollapse} 
        isCollapsed={sidebarCollapsed}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className={`flex-1 flex overflow-hidden ${isWorkmode && !rightPanelMinimized ? 'flex-row' : ''}`}>
          {/* Chat Section */}
          <div className={`${isWorkmode && !rightPanelMinimized ? 'w-1/2 ' : 'w-full'} overflow-hidden`}>
            <AnimatedChatUI 
              onWorkmode={handleWorkmode} 
              onStateChange={handleStateChange}
              onShowAvatarPopup={() => setShowAvatarPopup(true)}
              uploadedImages={uploadedImages}
              onRemoveImage={handleRemoveImage}
              onSendMessage={chatPhotoshoot}
              isChatLoading={isChatLoading}
            />
          </div>
          
          {/* Model Preview Section - Show in workmode, when minimized, or when generating avatars */}
          {(isWorkmode || rightPanelMinimized || isGeneratingAvatars) && (
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
                isLoading={isGeneratingAvatars}
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
    </div>
  );
}

