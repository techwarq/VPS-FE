import React from 'react';
import { Copy, ThumbsUp, ThumbsDown, Share, RotateCcw, MoreHorizontal, Mic, Volume2, Plus } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatResponseProps {
  messages: Message[];
}

export const ChatResponse: React.FC<ChatResponseProps> = ({ messages = [] }) => {
  const defaultMessages: Message[] = [
    {
      id: '1',
      type: 'ai',
      content: "hey 👋 looks like you're testing — what do you want to do?",
      timestamp: new Date()
    }
  ];

  const displayMessages = messages.length > 0 ? messages : defaultMessages;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top Right Button */}
      <div className="absolute top-4 right-4">
        <button className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors">
          ggggg
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 pt-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {displayMessages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {/* Message Bubble */}
                <div className={`rounded-2xl p-4 ${
                  message.type === 'user' 
                    ? 'bg-green-600 text-white ml-12' 
                    : 'bg-gray-800 text-white mr-12'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>

                {/* AI Message Actions */}
                {message.type === 'ai' && (
                  <div className="flex items-center gap-2 mt-2 ml-2">
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <Share className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-6 border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gray-800 rounded-full p-4 shadow-lg border border-gray-600">
            <div className="flex items-center justify-between">
              {/* Left side - Plus icon and placeholder */}
              <div className="flex items-center gap-3 flex-1">
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-gray-800" />
                </button>
                <input
                  type="text"
                  placeholder="Ask anything"
                  className="bg-transparent text-white placeholder-gray-400 outline-none flex-1 text-sm"
                />
              </div>
              
              {/* Right side - Microphone and volume icons */}
              <div className="flex items-center gap-3">
                <Mic className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                <Volume2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            ChatGPT can make mistakes. Check important info. See Cookie Preferences.
          </p>
        </div>
      </div>
    </div>
  );
};