'use client';

import React from 'react';
import ChatUI from '@/components/chatui/chatui';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

import { OnboardingQuestionnaire } from '@/components/onboarding/OnboardingQuestionnaire';

export default function GeneratePage() {
    return (
        <ProtectedRoute>
            <OnboardingQuestionnaire />
            <ChatUI />
        </ProtectedRoute>
    );
}
