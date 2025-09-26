import React, { useState } from 'react';
import { RightSidebar } from './right';

export const RightSideBar: React.FC = () => {
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'avatar' | 'tryon' | 'pose'>('avatar');
    const [activeToolTab, setActiveToolTab] = useState<string | null>(null);
    const [uploadedAssets, setUploadedAssets] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedAvatars, setGeneratedAvatars] = useState<any[]>([]);
    const [tryonResults, setTryonResults] = useState<any[]>([]);
    const [poseResults, setPoseResults] = useState<any[]>([]);
    const [uploadedGarments, setUploadedGarments] = useState<string[]>([]);
    const [uploadedPoseReferences, setUploadedPoseReferences] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);

    const removeAsset = (id: string) => {
        setUploadedAssets(prev => prev.filter(asset => asset.id !== id));
    };

    const removeUploadedGarment = (url: string) => {
        setUploadedGarments(prev => prev.filter(garment => garment !== url));
    };

    const removeUploadedPoseReference = (url: string) => {
        setUploadedPoseReferences(prev => prev.filter(ref => ref !== url));
    };

    const handleFileUpload = (files: FileList) => {
        setIsUploading(true);
        // Simulate upload
        setTimeout(() => {
            const newAssets = Array.from(files).map((file, index) => ({
                id: `asset-${Date.now()}-${index}`,
                url: URL.createObjectURL(file),
                name: file.name
            }));
            setUploadedAssets(prev => [...prev, ...newAssets]);
            setIsUploading(false);
        }, 1000);
    };

    const handleGarmentUpload = (files: FileList) => {
        const newGarments = Array.from(files).map(file => URL.createObjectURL(file));
        setUploadedGarments(prev => [...prev, ...newGarments]);
    };

    const handlePoseReferenceUpload = (files: FileList) => {
        const newReferences = Array.from(files).map(file => URL.createObjectURL(file));
        setUploadedPoseReferences(prev => [...prev, ...newReferences]);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files) {
            handleFileUpload(e.dataTransfer.files);
        }
    };

    const handleGenerate = () => {
        setIsLoading(true);
        setError(null);
        // Simulate generation
        setTimeout(() => {
            setGeneratedAvatars(prev => [...prev, { id: Date.now(), url: 'placeholder' }]);
            setIsLoading(false);
        }, 2000);
    };

    const handleTryOnGenerate = () => {
        setIsLoading(true);
        setError(null);
        // Simulate generation
        setTimeout(() => {
            setTryonResults(prev => [...prev, { id: Date.now(), url: 'placeholder' }]);
            setIsLoading(false);
        }, 2000);
    };

    const handlePoseGenerate = () => {
        setIsLoading(true);
        setError(null);
        // Simulate generation
        setTimeout(() => {
            setPoseResults(prev => [...prev, { id: Date.now(), url: 'placeholder' }]);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <RightSidebar
            rightDrawerOpen={rightDrawerOpen}
            setRightDrawerOpen={setRightDrawerOpen}
            activeTab={activeTab}
            activeToolTab={activeToolTab}
            setActiveToolTab={setActiveToolTab}
            uploadedAssets={uploadedAssets}
            setUploadedAssets={setUploadedAssets}
            isUploading={isUploading}
            removeAsset={removeAsset}
          
         
            generatedAvatars={generatedAvatars}
            tryonResults={tryonResults}
            poseResults={poseResults}
            handleFileUpload={handleFileUpload}
            handleGarmentUpload={handleGarmentUpload}
            handlePoseReferenceUpload={handlePoseReferenceUpload}
            dragActive={dragActive}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            uploadedGarments={uploadedGarments}
            removeUploadedGarment={removeUploadedGarment}
            uploadedPoseReferences={uploadedPoseReferences}
            removeUploadedPoseReference={removeUploadedPoseReference}
        />
    );
};


