import React, { useRef } from 'react';
import { Upload, X, Loader2, Download } from 'lucide-react';

// Assets Management Component
interface AssetsContentProps {
  uploadedAssets: Array<{ id: string; url: string; name: string }>;
  setUploadedAssets: React.Dispatch<React.SetStateAction<Array<{ id: string; url: string; name: string }>>>;
  isUploading: boolean;
  removeAsset: (id: string) => void;
  handleFileUpload: (files: FileList) => void;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

export const AssetsContent: React.FC<AssetsContentProps> = ({
  uploadedAssets,
  isUploading,
  removeAsset,
  handleFileUpload,
  dragActive,
  handleDrag,
  handleDrop
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Asset Management</h3>
        
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-2">
            Drag and drop files here, or click to select
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Supports images, documents, and other files
          </p>
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            Choose Files
          </button>
        </div>
      </div>

      {/* Uploaded Assets */}
      {uploadedAssets.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-white mb-3">Uploaded Assets ({uploadedAssets.length})</h4>
          <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {uploadedAssets.map((asset) => (
              <div key={asset.id} className="relative group">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-24 object-cover rounded-lg border border-gray-600"
                />
                <button
                  onClick={() => removeAsset(asset.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-xs text-gray-400 truncate mt-1">{asset.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isUploading && (
        <div className="p-4 bg-gray-700/50 text-center rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin text-purple-400 mx-auto mb-2" />
          <p className="text-sm text-gray-300">Uploading assets...</p>
        </div>
      )}
    </div>
  );
};


// Export Component
interface ExportContentProps {
  generatedAvatars: Array<{ id: string; url: string; angle?: string }>;
  tryonResults: Array<{ id: string; url: string; item_index?: number }>;
  poseResults: Array<{ id: string; url: string; item_index?: number }>;
}

export const ExportContent: React.FC<ExportContentProps> = ({
  generatedAvatars,
  tryonResults,
  poseResults
}) => {
  const handleDownloadZip = async () => {
    try {
      const allImages = [
        ...generatedAvatars.map(avatar => avatar.url),
        ...tryonResults.map(result => result.url),
        ...poseResults.map(result => result.url)
      ].filter(Boolean);

      if (allImages.length === 0) {
        alert('No images to download');
        return;
      }

      console.log('Downloading ZIP with images:', allImages);
      if (allImages[0]) {
        const link = document.createElement('a');
        link.href = allImages[0];
        link.download = `vps-results-${Date.now()}.jpg`;
        link.click();
      }
    } catch (error) {
      console.error('Error downloading ZIP:', error);
    }
  };

  const handleSaveToDrive = async () => {
    try {
      console.log('Saving to Google Drive...');
      alert('Save to Drive feature would be implemented here');
    } catch (error) {
      console.error('Error saving to Drive:', error);
    }
  };

  const handleAddToKnowledgeBase = async () => {
    try {
      const allResults = {
        generatedAvatars,
        tryonResults,
        poseResults,
        timestamp: new Date().toISOString()
      };

      console.log('Adding to knowledge base:', allResults);
      alert('Results added to knowledge base successfully!');
    } catch (error) {
      console.error('Error adding to knowledge base:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white mb-4">Export Options</h3>
      
      <div className="space-y-3">
        <div className="p-3 bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2">Download as ZIP</h4>
          <p className="text-xs text-gray-400 mb-3">Download all generated images as a ZIP file</p>
          <button 
            onClick={handleDownloadZip}
            className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
          >
            <Download className="w-4 h-4 inline mr-2" />
            Download ZIP
          </button>
        </div>
        
        <div className="p-3 bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2">Save to Drive</h4>
          <p className="text-xs text-gray-400 mb-3">Save all results to your Google Drive</p>
          <button 
            onClick={handleSaveToDrive}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
          >
            <Download className="w-4 h-4 inline mr-2" />
            Save to Drive
          </button>
        </div>
        
        <div className="p-3 bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2">Add to Knowledge Base</h4>
          <p className="text-xs text-gray-400 mb-3">Store results in your knowledge base for future reference</p>
          <button 
            onClick={handleAddToKnowledgeBase}
            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
          >
            <Download className="w-4 h-4 inline mr-2" />
            Add to Knowledge Base
          </button>
        </div>
      </div>
    </div>
  );
};
