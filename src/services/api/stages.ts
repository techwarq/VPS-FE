// File upload API using the new upload endpoint

// API base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const uploadFile = async (file: File) => {
  try {
    console.log('🚀 Starting file upload:', file.name);
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('📡 Uploading to:', `${API_BASE_URL}/upload`);
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    
    console.log('📥 Upload response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ Upload result:', result);
    
    return {
      data: {
        url: result.url || result.signedUrl,
        name: result.filename || file.name,
        fileId: result.fileId,
        size: result.size,
        contentType: result.contentType
      }
    };
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw new Error('File upload failed. Please try again.');
  }
};

