import React, { useState } from 'react';
import { LeftSidebar } from './left';

export const LeftSideBar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'avatar' | 'tryon' | 'pose'>('avatar');
    const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
    const [activeToolTab, setActiveToolTab] = useState<string | null>(null);
    
    const handleFileUpload = (files: FileList) => {
        // Handle file upload logic here
        console.log('Files uploaded:', files);
    };
    
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };
    
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            handleFileUpload(e.dataTransfer.files);
        }
    };

    return (
        <LeftSidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setRightDrawerOpen={setRightDrawerOpen}
            activeToolTab={activeToolTab}
            setActiveToolTab={setActiveToolTab}
            handleFileUpload={handleFileUpload}
            dragActive={false}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
        />
    )
}