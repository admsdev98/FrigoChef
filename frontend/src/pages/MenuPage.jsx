import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeList from '../components/RecipeList.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export function MenuPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'weekly'

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Sticky */}
            <div className="bg-white sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
                    <h1 className="text-2xl font-bold text-gray-900">Mis platos</h1>
                    <p className="text-sm text-gray-500">Visualiza los platos que ya has generado anteriormente.</p>
                </div>

                {/* Tabs */}
                <div className="flex max-w-7xl mx-auto px-4 mt-2">
                    <button
                        onClick={() => setActiveTab('quick')}
                        className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'quick'
                                ? 'border-emerald-500 text-emerald-600'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Recetas Rápidas
                    </button>
                    <button
                        onClick={() => setActiveTab('weekly')}
                        className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'weekly'
                                ? 'border-emerald-500 text-emerald-600'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Menú Semanal
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                    {activeTab === 'quick' ? (
                        <motion.div
                            key="quick"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 flex flex-col"
                        >
                            <RecipeList onCreateNew={() => navigate('/dashboard')} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="weekly"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4"
                        >
                            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden shadow-inner">
                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Próximamente</h3>
                            <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
                                Estamos afilindo los cuchillos para que puedas cocinar los mejores menus semanales.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
