import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mic, ArrowRight, Sparkles } from 'lucide-react';
import Uploader from './uploader';
import UploadedGrid from './uploaded-grid';

interface UploadedImage {
  id: number;
  url: string;
  name: string;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

interface AnimatedChatUIProps {
  onWorkmode?: () => void;
  onStateChange?: (state: 'initial' | 'active' | 'workmode') => void;
  onShowAvatarPopup?: () => void;
  onShowTryonPopup?: () => void;
  uploadedImages?: UploadedImage[];
  onRemoveImage?: (id: number) => void;
  onSendMessage?: (message: string, queryId?: number, onProgress?: (data: Record<string, unknown>) => void) => Promise<{ text?: string; message?: string; content?: string; next?: string | null } | null>;
  isChatLoading?: boolean;
  onModelSelect?: (imageId: number) => void;
  showTryonPrompt?: boolean;
  onTryonPromptYes?: () => void;
  onTryonPromptNo?: () => void;
}

const AnimatedChatUI = ({
  onWorkmode,
  onStateChange,
  onShowAvatarPopup,
  onShowTryonPopup,
  uploadedImages = [],
  onRemoveImage,
  onSendMessage,
  isChatLoading = false,
  onModelSelect,
  showTryonPrompt = false,
  onTryonPromptYes,
  onTryonPromptNo
}: AnimatedChatUIProps) => {
  const [chatState, setChatState] = useState('initial'); // 'initial' | 'active' | 'workmode'
  const [inputValue, setInputValue] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const [gridMaximized, setGridMaximized] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [history, uploadedImages]);

  const handleSubmission = async () => {
    if (!inputValue.trim() || isSending || isChatLoading) return;

    const userMessageText = inputValue.trim();
    const newUserMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: userMessageText,
    };
    setHistory(prev => [...prev, newUserMessage]);

    // Check if message contains "avatar" keyword
    const messageText = userMessageText.toLowerCase();
    const containsAvatar = messageText.includes('avatar');

    setInputValue('');
    setIsSending(true);

    // First enter: move to active (bottom center, smaller)
    if (chatState === 'initial') {
      const newState = 'active';
      setChatState(newState);
      if (onStateChange) onStateChange(newState);
    }
    // Second enter: move to workmode (left side with full chat)
    else if (chatState === 'active') {
      const newState = 'workmode';
      setChatState(newState);
      if (onStateChange) onStateChange(newState);
      // Notify parent that we're entering workmode
      if (onWorkmode) {
        onWorkmode();
      }
    }

    // Show avatar popup if "avatar" keyword is detected
    if (containsAvatar && onShowAvatarPopup) {
      setTimeout(() => {
        onShowAvatarPopup();
      }, 1200);
    }

    // Call the chat API if onSendMessage is provided
    if (onSendMessage) {
      try {
        const queryId = Date.now();
        const response = await onSendMessage(userMessageText, queryId, (progressData) => {
          // Handle streaming progress if needed
          console.log('Chat progress:', progressData);
        });

        // Handle API response
        let aiResponseText = '';
        let nextAction: string | null = null;

        // Check if response has content directly (new API format)
        if (response && response.content) {
          aiResponseText = response.content;
          // next can be null, so check if it exists and is not null
          if (response.next !== undefined && response.next !== null) {
            nextAction = response.next;
          }
        }
        // Fallback: Check if response has text that needs parsing (legacy format)
        else if (response && response.text) {
          try {
            // Strip markdown code blocks if present (```json ... ```)
            let jsonString = response.text.trim();

            // Remove markdown code block markers
            if (jsonString.startsWith('```json')) {
              jsonString = jsonString.replace(/^```json\s*\n?/, '');
            } else if (jsonString.startsWith('```')) {
              jsonString = jsonString.replace(/^```\s*\n?/, '');
            }

            if (jsonString.endsWith('```')) {
              jsonString = jsonString.replace(/\n?```\s*$/, '');
            }

            // Parse the cleaned JSON string
            const parsedText = JSON.parse(jsonString.trim());

            // Extract content and next from parsed JSON
            if (parsedText.content) {
              aiResponseText = parsedText.content;
            }
            if (parsedText.next !== undefined && parsedText.next !== null) {
              nextAction = parsedText.next;
            }
          } catch (parseError) {
            // If parsing fails, use the text as is
            console.warn('Failed to parse response.text as JSON:', parseError);
            aiResponseText = response.text;
          }
        }
        // Fallback: Check for message field
        else if (response && response.message) {
          aiResponseText = response.message;
        }
        // Fallback: Check if response is a string
        else if (response && typeof response === 'string') {
          aiResponseText = response;
        }
        // Final fallback response
        else {
          aiResponseText = containsAvatar
            ? `Perfect! Let's get started with your avatar.`
            : `Got it! You asked: "${userMessageText}". I'm ready to proceed with your request.`;
        }

        // Always show the message to the user, even if next is null
        if (aiResponseText) {
          const aiResponse: ChatMessage = {
            id: Date.now() + 1,
            sender: 'ai',
            text: aiResponseText,
          };
          setHistory(prev => [...prev, aiResponse]);
        }

        // After 3 seconds, check for next action and trigger modal if needed
        // Only trigger if nextAction is not null
        if (nextAction) {
          setTimeout(() => {
            if (nextAction === 'selectAvatarModal' && onShowAvatarPopup) {
              onShowAvatarPopup();
            } else if (nextAction === 'selectedTryonmode' && onShowTryonPopup) {
              onShowTryonPopup();
            }
          }, 3000);
        }
      } catch (error) {
        console.error('Chat API error:', error);
        const errorResponse: ChatMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        };
        setHistory(prev => [...prev, errorResponse]);
      } finally {
        setIsSending(false);
      }
    } else {
      // Fallback to mock response if API is not available
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          text: containsAvatar
            ? `Perfect! Let's get started with your avatar.`
            : `Got it! You asked: "${userMessageText}". I'm ready to proceed with your request.`,
        };
        setHistory(prev => [...prev, aiResponse]);
        setIsSending(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmission();
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Animated background gradients */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -50, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Horizon Line Effect - Bolt V2 Style */}
      <AnimatePresence>
        {chatState === 'initial' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"
          />
        )}
      </AnimatePresence>

      {/* Main container */}
      <motion.div
        layout
        className="absolute inset-0 flex items-center justify-center p-4 sm:p-8"
        initial={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '2rem',
          paddingBottom: '0',
        }}
        animate={{
          alignItems: chatState === 'initial' ? 'center' : 'flex-end',
          justifyContent: chatState === 'workmode' ? 'flex-start' : 'center',
          paddingLeft: chatState === 'workmode' ? '2rem' : '2rem',
          paddingBottom: chatState === 'initial' ? '0' : '2rem',
        }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <motion.div
          layout
          className={`w-full relative z-10 flex flex-col mx-auto ${chatState === 'initial' ? '' : 'h-full'}`}
          initial={{
            maxWidth: '700px',
          }}
          animate={{
            maxWidth: chatState === 'initial' ? '900px' : chatState === 'active' ? '500px' : '800px',
          }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Initial Welcome Screen - Bolt V2 Style */}
          <AnimatePresence mode="wait">
            {chatState === 'initial' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center w-full"
              >
                {/* Main Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-5xl md:text-6xl font-bold text-white text-center mb-4 tracking-tight"
                >
                  What will you <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">create</span> today?
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-gray-400 text-lg md:text-xl text-center mb-12 font-light"
                >
                  Create stunning virtual photoshoots by chatting with AI
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat History - Only show when not in initial state */}
          {chatState !== 'initial' && (
            <div ref={chatHistoryRef} className="w-full mb-4 flex-1 overflow-y-auto scrollbar-hide pr-2 pl-4">
              <AnimatePresence initial={false}>
                {history.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      delay: index * 0.05
                    }}
                    className={`flex w-full mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`relative p-4 rounded-2xl max-w-[85%] backdrop-blur-xl border shadow-lg ${message.sender === 'user'
                        ? 'bg-gradient-to-br from-emerald-600/20 to-green-600/20 border-emerald-500/30 text-emerald-50'
                        : 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-white/10 text-slate-200'
                        }`}
                    >
                      {/* Glass shine effect */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                      {message.sender === 'ai' && (
                        <div className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-black flex items-center justify-center shadow-lg border border-white/10 overflow-hidden">
                          <img src="/draw-logo.png" alt="AI" className="w-full h-full object-contain p-1.5" />
                        </div>
                      )}
                      <span className="leading-relaxed">{message.text}</span>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Uploaded Images Grid as a Message */}
              {chatState === 'workmode' && uploadedImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex w-full mb-4 justify-end"
                >
                  <div className={gridMaximized ? 'w-full' : 'max-w-lg'}>
                    <UploadedGrid
                      isOpen={true}
                      isMaximized={gridMaximized}
                      onToggleMaximize={() => setGridMaximized(!gridMaximized)}
                      uploadedImages={uploadedImages}
                      onRemoveImage={onRemoveImage}
                      onModelSelect={onModelSelect}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Try-On Prompt - Shows when avatar generation completes */}
          <AnimatePresence>
            {showTryonPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-full mb-4 flex justify-center"
              >
                <div className="relative p-5 rounded-2xl max-w-lg backdrop-blur-xl border bg-gradient-to-br from-emerald-900/40 to-green-900/40 border-emerald-500/30 text-white shadow-2xl">
                  <p className="text-center mb-4 font-semibold text-lg">
                    Let&apos;s start with try-on for the avatars?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onTryonPromptYes}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
                    >
                      Yes, let&apos;s start
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onTryonPromptNo}
                      className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                    >
                      No, wait
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Input */}
          <motion.div
            layout
            className={`w-full shrink-0 ${chatState === 'initial' ? 'mt-8' : ''}`}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {chatState === 'initial' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full flex justify-center"
              >
                {/* Large Input Box - Bolt V2 Style */}
                <motion.div
                  className="relative bg-gray-900/60 backdrop-blur-2xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.1)] border border-white/10 rounded-2xl p-4 w-full max-w-3xl group"
                  whileHover={{ borderColor: 'rgba(16, 185, 129, 0.3)', boxShadow: '0 0 50px -10px rgba(16,185,129,0.2)' }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Outer glow */}
                  <motion.div
                    className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 rounded-2xl blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  <div className="flex items-center justify-between w-full gap-4">
                    {/* Left Icon */}
                    <motion.button
                      onClick={() => setShowUploader(true)}
                      whileHover={{ rotate: 90, scale: 1.1, backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer transition-all"
                    >
                      <Plus className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                    </motion.button>

                    {/* Input Field */}
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Let's create a professional photoshoot..."
                      disabled={isSending || isChatLoading}
                      className="flex-1 bg-transparent text-white text-lg placeholder-gray-500 py-2 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      autoFocus
                    />

                    {/* Submit Button */}
                    <motion.button
                      onClick={handleSubmission}
                      disabled={isSending || isChatLoading || !inputValue.trim()}
                      whileHover={!isSending && !isChatLoading && inputValue.trim() ? { scale: 1.05 } : {}}
                      whileTap={!isSending && !isChatLoading && inputValue.trim() ? { scale: 0.95 } : {}}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all shadow-lg ${isSending || isChatLoading || !inputValue.trim()
                        ? 'bg-white/5 cursor-not-allowed text-gray-500 border border-white/5'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-500/20'
                        }`}
                    >
                      {isSending || isChatLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          <span className="font-medium">Create</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="relative bg-gray-900/80 backdrop-blur-2xl shadow-2xl border border-white/10"
                initial={{
                  borderRadius: '24px',
                  padding: '20px',
                }}
                animate={{
                  borderRadius: chatState === 'active' ? '9999px' : '24px',
                  padding: chatState === 'active' ? '12px' : '20px',
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Outer glow */}
                <motion.div
                  className="absolute -inset-px bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 rounded-[inherit] blur-md -z-10"
                  animate={{
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <div className="flex items-center justify-between w-full gap-4">
                  {/* Left Icon */}
                  <motion.button
                    onClick={() => setShowUploader(true)}
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer p-2 rounded-full hover:bg-white/5 transition-colors"
                  >
                    <Plus className="w-6 h-6 text-emerald-400 shrink-0" />
                  </motion.button>

                  {/* Input Field */}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask anything..."
                    disabled={isSending || isChatLoading}
                    className="flex-1 bg-transparent text-slate-200 text-lg placeholder-slate-500 py-1 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    autoFocus
                  />

                  {/* Mic Button */}
                  <motion.button
                    onClick={handleSubmission}
                    disabled={isSending || isChatLoading || !inputValue.trim()}
                    whileHover={!isSending && !isChatLoading && inputValue.trim() ? { scale: 1.1 } : {}}
                    whileTap={!isSending && !isChatLoading && inputValue.trim() ? { scale: 0.9 } : {}}
                    className={`shrink-0 flex items-center justify-center p-3 rounded-full transition-all shadow-lg ${isSending || isChatLoading || !inputValue.trim()
                      ? 'bg-gray-800 cursor-not-allowed text-gray-500'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-500/20'
                      }`}
                  >
                    {isSending || isChatLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Uploader Modal */}
      <Uploader
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
      />
    </div>
  );
};

export default AnimatedChatUI;