import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import FeedbackToast from '../components/FeedbackToast';
import { GenerationProgress } from '../components/GenerationProgress';
import { useAuth } from '../hooks/useAuth';

export function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });
    const { signOut } = useAuth();

    const showToast = (type, message) => {
        setToast({ visible: true, type, message });
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 4000);
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onSignOut={signOut}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden">
                {/* Header móvil */}
                <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-slate-600 hover:text-emerald-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center">
                            <img
                                src="/src/media/main_logo_without_background.png"
                                alt="Tu NeveraApp"
                                className="h-8 w-auto mr-2"
                            />
                            <h1 className="text-lg font-semibold text-emerald-900">Tu NeveraApp</h1>
                        </div>
                        <div className="w-10"></div> {/* Spacer */}
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-auto">
                    <Outlet context={{ showToast }} />
                </div>
            </div>

            {/* Toast de feedback */}
            <FeedbackToast
                type={toast.type}
                message={toast.message}
                visible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            {/* Progreso de generación global */}
            <GenerationProgress />
        </div>
    );
}
