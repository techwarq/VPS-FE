'use client';

import React from 'react';
import ChatUI from '@/components/chatui/chatui';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function GeneratePage() {
    return (
        <ProtectedRoute>
            <ChatUI />
        </ProtectedRoute>
    );
}
