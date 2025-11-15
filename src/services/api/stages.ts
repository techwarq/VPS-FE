// File upload API using the new upload endpoint

// API base URL configuration
// Normalize API_BASE_URL to remove trailing slashes
const getApiBaseURL = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return url.replace(/\/+$/, ''); // Remove trailing slashes
};

const API_BASE_URL = getApiBaseURL();

export const uploadFile = async (file: File) => {
  try {
    console.log('🚀 Starting file upload:', file.name);
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('📡 Uploading to:', `${API_BASE_URL}/api/files/upload`);
    const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
      method: 'POST',
      body: formData
    });
    
    console.log('📥 Upload response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('📥 Raw upload response:', result);
    
    // Return the full response so the component can handle both formats
    return result;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw new Error(`File upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

