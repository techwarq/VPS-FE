// Mock API functions for file uploads - replace with actual API calls

export const uploadFile = async (file: File) => {
  // Mock upload - replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      url: URL.createObjectURL(file),
      name: file.name
    }
  };
};

