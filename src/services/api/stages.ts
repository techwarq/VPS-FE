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
    
    // Access the URL from the nested 'file' object if it exists, otherwise assume top-level
    const fileUrl = result.file?.url || result.file?.signedUrl || result.url || result.signedUrl;
    const fileName = result.file?.filename || result.file?.name || file.name;
    const fileId = result.file?.fileId || result.fileId;
    const fileSize = result.file?.size || result.size;
    const fileContentType = result.file?.contentType || result.contentType;

    if (!fileUrl) {
      throw new Error('File upload failed: No valid URL returned.');
    }

    return {
      data: {
        url: fileUrl,
        name: fileName,
        fileId: fileId,
        size: fileSize,
        contentType: fileContentType
      }
    };
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw new Error(`File upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

