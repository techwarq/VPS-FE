import React, { useState } from 'react';
import { RightSidebar } from './right';
import { type AvatarImage, type TryOnResult, type PoseResult } from '../../types';

export const RightSideBar: React.FC = () => {
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
    const [activeTab] = useState<'avatar' | 'tryon' | 'pose'>('avatar');
    const [activeToolTab, setActiveToolTab] = useState<string | null>(null);
    const [uploadedAssets, setUploadedAssets] = useState<Array<{ id: string; url: string; name: string }>>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [generatedAvatars] = useState<AvatarImage[]>([]);
    const [tryonResults] = useState<TryOnResult[]>([]);
    const [poseResults] = useState<PoseResult[]>([]);
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


