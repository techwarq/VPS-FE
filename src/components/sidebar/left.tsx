import React, { useRef } from 'react';
import { 
  User, 
  Shirt, 
  Users, 
  Upload, 
  Download,
  Sparkles
} from 'lucide-react';

interface LeftSidebarProps {
  activeTab: 'avatar' | 'tryon' | 'pose' | 'accessories';
  setActiveTab: (tab: 'avatar' | 'tryon' | 'pose' | 'accessories') => void;
  activeToolTab: string | null;
  setActiveToolTab: (tab: string | null) => void;
  setRightDrawerOpen: (open: boolean) => void;
  handleFileUpload: (files: FileList) => void;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

const mainTabs = [
  {
    id: 'avatar' as const,
    label: 'Avatar',
    icon: User,
    description: 'Create realistic AI avatars',
  },
  {
    id: 'tryon' as const,
    label: 'Try-On',
    icon: Shirt,
    description: 'Try on garments on avatars',
  },
  {
    id: 'pose' as const,
    label: 'Pose',
    icon: Users,
    description: 'Transfer poses from references',
  },
  {
    id: 'accessories' as const,
    label: 'Accessories',
    icon: Sparkles,
    description: 'Add accessories to avatars',
  },
];

const toolsTabs = [
  {
    id: 'upload',
    label: 'Assets',
    icon: Upload,
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
  },
];

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  setActiveTab,
  activeToolTab,
  setActiveToolTab,
  setRightDrawerOpen,
  handleFileUpload,
  dragActive,
  handleDrag,
  handleDrop
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-24 min-w-24 bg-black/95 backdrop-blur-md border-r border-gray-700 flex flex-col shadow-lg">
      {/* Main navigation tabs */}
      <div className="flex flex-col items-center py-4 border-b border-gray-700">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveToolTab(null);
                setRightDrawerOpen(true);
              }}
              className={`flex flex-col items-center justify-center p-3 mb-2 rounded-xl w-16 transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-br from-green-600/30 to-green-500/20 text-green-400 glow-green shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:transform hover:scale-105'
              }`}
              title={tab.description}
            >
              <Icon className={`w-6 h-6 mb-1 transition-all duration-300 ${isActive ? 'animate-pulse' : 'group-hover:animate-bounce'}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Tools tabs */}
      <div className="flex flex-col items-center py-4 flex-1">
        {toolsTabs.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeToolTab === tool.id;
          
          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveToolTab(activeToolTab === tool.id ? null : tool.id);
                setRightDrawerOpen(true);
              }}
              className={`flex flex-col items-center justify-center p-3 mb-2 rounded-xl w-16 transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-br from-purple-600/30 to-blue-500/20 text-purple-400 glow-purple shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:transform hover:scale-105'
              }`}
              title={tool.label}
            >
              <Icon className={`w-6 h-6 mb-1 transition-all duration-300 ${isActive ? 'animate-pulse' : 'group-hover:animate-bounce'}`} />
              <span className="text-xs font-medium">{tool.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Upload section */}
      <div className="p-3 border-t border-gray-700">
        <div
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 cursor-pointer ${
            dragActive 
              ? 'bg-green-600/30 border-2 border-dashed border-green-500 glow-green animate-pulse' 
              : 'bg-gray-700/50 border-2 border-dashed border-gray-600 hover:border-gray-500 hover:bg-gray-600/50 hover:transform hover:scale-105'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
          <Upload className={`w-5 h-5 mb-1 transition-all duration-300 ${dragActive ? 'text-green-400 animate-bounce' : 'text-gray-400'}`} />
          <span className={`text-xs transition-colors duration-300 ${dragActive ? 'text-green-400' : 'text-gray-400'}`}>Upload</span>
        </div>
      </div>
    </div>
  );
};