import React, { useState } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';
import { motion, AnimatePresence } from 'motion/react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight, Loader2, Mail, Lock, User, Sparkles } from 'lucide-react';

interface AuthTerminalProps {
    onAuthSuccess: () => void;
}

export const AuthTerminal = ({ onAuthSuccess }: AuthTerminalProps) => {
    const { theme } = useSeason();
    const { language } = useLanguage();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const labels = {
        kz: { signin: 'Кіру', join: 'Тіркелу', name: 'Толық аты-жөні', email: 'Электронды пошта', pass: 'Құпия сөз', forgot: 'Ұмыттыңыз ба?', enter: 'Далаға қадам басу', account: 'Тіркелгі жасау', welcome: 'Кендалаға қош келдіңіз.' },
        ru: { signin: 'Войти', join: 'Создать', name: 'Полное имя', email: 'Электронная почта', pass: 'Пароль', forgot: 'Забыли?', enter: 'Шагнуть в степь', account: 'Создать аккаунт', welcome: 'Добро пожаловать в Кендалу.' },
        en: { signin: 'Sign In', join: 'Join', name: 'Full Name', email: 'Email Address', pass: 'Password', forgot: 'Forgot?', enter: 'Step into the Steppe', account: 'Create Account', welcome: 'Welcome to Kendala.' }
    }[language];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            onAuthSuccess();
        } catch (err: any) {
            setError(err.message || 'Unable to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${publicAnonKey}` 
                },
                body: JSON.stringify({ email, password, name })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Registration failed');

            const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
            if (loginError) throw loginError;
            
            setSuccessMsg(labels.welcome);
            setTimeout(onAuthSuccess, 1000);
        } catch (err: any) {
            setError(err.message || 'Registration encountered an issue.');
        } finally {
            setLoading(false);
        }
    };

    if (!theme) return null;

    return (
        <div className="w-full bg-white/40 backdrop-blur-2xl border p-5 sm:p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]" style={{ borderColor: `${theme.text}10` }}>
            <div className="mb-4 md:mb-8">
                <div className="flex gap-6 md:gap-8 mb-4 md:mb-8 border-b" style={{ borderColor: `${theme.text}10` }}>
                    <button 
                        onClick={() => setMode('login')}
                        className={`pb-3 md:pb-4 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold transition-all relative ${mode === 'login' ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
                        style={{ color: theme.text }}
                    >
                        {labels.signin}
                        {mode === 'login' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: theme.text }} />}
                    </button>
                    <button 
                        onClick={() => setMode('signup')}
                        className={`pb-3 md:pb-4 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold transition-all relative ${mode === 'signup' ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
                        style={{ color: theme.text }}
                    >
                        {labels.join}
                        {mode === 'signup' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: theme.text }} />}
                    </button>
                </div>
            </div>

            <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-5 md:space-y-8">
                <AnimatePresence mode="popLayout">
                    {mode === 'signup' && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-2"
                        >
                            <label className="block text-[9px] uppercase tracking-widest font-bold opacity-30" style={{ color: theme.text }}>{labels.name}</label>
                            <div className="relative group border-b transition-colors" style={{ borderColor: `${theme.text}20` }}>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-transparent w-full py-3 outline-none font-sans placeholder-black/10"
                                    style={{ color: theme.text }}
                                    placeholder="..."
                                    required
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-2">
                    <label className="block text-[9px] uppercase tracking-widest font-bold opacity-30" style={{ color: theme.text }}>{labels.email}</label>
                    <div className="relative group border-b transition-colors" style={{ borderColor: `${theme.text}20` }}>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent w-full py-3 outline-none font-sans placeholder-black/10"
                            style={{ color: theme.text }}
                            placeholder="nomad@kendala.kz"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="block text-[9px] uppercase tracking-widest font-bold opacity-30" style={{ color: theme.text }}>{labels.pass}</label>
                        {mode === 'login' && (
                            <button type="button" className="text-[9px] uppercase tracking-widest font-bold opacity-20 hover:opacity-100 transition-colors" style={{ color: theme.text }}>
                                {labels.forgot}
                            </button>
                        )}
                    </div>
                    <div className="relative group border-b transition-colors" style={{ borderColor: `${theme.text}20` }}>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent w-full py-3 outline-none font-sans placeholder-black/10"
                            style={{ color: theme.text }}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-600 font-mono uppercase tracking-wider py-2">
                        {error}
                    </motion.div>
                )}

                {successMsg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-emerald-700 font-mono uppercase tracking-wider py-2">
                        {successMsg}
                    </motion.div>
                )}

                <button 
                    disabled={loading}
                    className="w-full py-4 transition-all flex items-center justify-center gap-3 sm:gap-4 group relative overflow-hidden active:scale-[0.98]"
                    style={{ backgroundColor: theme.text, color: theme.background }}
                >
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em]">
                        {loading ? '...' : (mode === 'login' ? labels.enter : labels.account)}
                    </span>
                    {!loading && <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>
            
            <div className="mt-6 lg:mt-10 pt-4 lg:pt-6 border-t flex justify-between items-center" style={{ borderColor: `${theme.text}05` }}>
                <div className="flex items-center gap-2 opacity-20" style={{ color: theme.text }}>
                    <Sparkles className="w-3 h-3" />
                    <span className="text-[8px] uppercase tracking-[0.3em]">Whispering Steppe ID</span>
                </div>
                <span className="text-[8px] uppercase tracking-[0.3em] opacity-20" style={{ color: theme.text }}>Millennial Legacy</span>
            </div>
        </div>
    );
};