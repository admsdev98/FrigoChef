import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../context/UserContext';
import { authService } from '../services/auth';
import { LoadingButton } from '../components/UIComponents';
import FeedbackToast from '../components/FeedbackToast';

export function SettingsPage() {
    const { signOut } = useAuth();
    const { userProfile, updateUserProfile } = useUser();
    
    const [profileData, setProfileData] = useState({
        full_name: '',
        username: ''
    });
    
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState({
        profile: false,
        password: false
    });

    const [feedback, setFeedback] = useState({ visible: false, type: 'success', message: '' });

    useEffect(() => {
        if (userProfile) {
            setProfileData({
                full_name: userProfile.full_name || '',
                username: userProfile.username || ''
            });
        }
    }, [userProfile]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, profile: true }));
        
        try {
            // Update profile in Supabase Auth metadata (if needed) and/or your DB
            // Here we assume updateUserProfile updates the DB via your backend service
            const success = await updateUserProfile(profileData);
            
            if (success) {
                // Also update auth metadata if username is stored there
                await authService.updateUser({ 
                    data: { 
                        full_name: profileData.full_name,
                        username: profileData.username 
                    } 
                });
                setFeedback({ visible: true, type: 'success', message: 'Perfil actualizado correctamente' });
            } else {
                throw new Error('Error al actualizar perfil');
            }
        } catch (error) {
            setFeedback({ visible: true, type: 'error', message: 'Error al actualizar el perfil' });
        } finally {
            setLoading(prev => ({ ...prev, profile: false }));
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.password !== passwordData.confirmPassword) {
            setFeedback({ visible: true, type: 'error', message: 'Las contraseñas no coinciden' });
            return;
        }

        if (passwordData.password.length < 6) {
            setFeedback({ visible: true, type: 'error', message: 'La contraseña debe tener al menos 6 caracteres' });
            return;
        }

        setLoading(prev => ({ ...prev, password: true }));
        try {
            const { error } = await authService.updateUser({ password: passwordData.password });
            if (error) throw error;
            
            setFeedback({ visible: true, type: 'success', message: 'Contraseña actualizada correctamente' });
            setPasswordData({ password: '', confirmPassword: '' });
        } catch (error) {
            setFeedback({ visible: true, type: 'error', message: error.message || 'Error al actualizar contraseña' });
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50 relative overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto px-4 py-8 w-full pb-32">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                        Configuración
                    </h2>
                    <p className="text-gray-500 text-base">
                        Gestiona tu cuenta y preferencias de seguridad.
                    </p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    {/* Profile Section */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Tu perfil de usuario.</h3>
                            </div>
                            <p className="text-sm text-gray-500 ml-12">Actualiza tu información personal</p>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
                                        <input
                                            type="text"
                                            value={profileData.username}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                            placeholder="@usuario"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <LoadingButton
                                        isLoading={loading.profile}
                                        type="submit"
                                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm"
                                    >
                                        Guardar Perfil
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    {/* Security Section */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Seguridad</h3>
                            </div>
                            <p className="text-sm text-gray-500 ml-12">Cambia tu contraseña</p>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            value={passwordData.password}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <LoadingButton
                                        isLoading={loading.password}
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        Actualizar Contraseña
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    {/* Danger Zone */}
                    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                        <div className="p-6 border-b border-red-50 bg-red-50/30">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-red-900">Eliminar cuenta</h3>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Se eliminarán todos tus datos, recetas y preferencias permanentemente.
                                </p>
                            </div>
                            <button 
                                onClick={() => setFeedback({ visible: true, type: 'error', message: 'Contacta con soporte para eliminar tu cuenta.' })}
                                className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm whitespace-nowrap"
                            >
                                Eliminar mi cuenta
                            </button>
                        </div>
                    </motion.div>

                    {/* Logout Button */}
                    <motion.div variants={itemVariants} className="pt-4">
                        <button
                            onClick={signOut}
                            className="w-full bg-white border border-gray-200 text-gray-600 py-3 px-4 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                        </button>
                    </motion.div>

                </motion.div>
            </div>

            <FeedbackToast
                visible={feedback.visible}
                type={feedback.type}
                message={feedback.message}
                onClose={() => setFeedback(prev => ({ ...prev, visible: false }))}
            />
        </div>
    );
}
