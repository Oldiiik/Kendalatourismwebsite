import React, { useState } from 'react';
import { MessageCircle, Coffee, Heart, Volume2, Info, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const CultureGuide = () => {
    const { theme } = useSeason();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('lexicon');
    const [quizIndex, setQuizIndex] = useState(0);
    const [quizResult, setQuizResult] = useState<number | null>(null);

    const ETIQUETTE = [
        { 
            title: t('tea_title') || 'Tea Culture (Shay)', 
            desc: t('tea_desc') || 'Accept tea with your right hand. A half-full cup (Saba) means "I value your presence, stay longer". A full cup is a sign the host is busy.',
            icon: Coffee
        },
        { 
            title: t('dastarkhan_title') || 'The Dastarkhan', 
            desc: t('dastarkhan_desc') || 'The tablecloth is sacred. Never step over it or stretch your legs towards it. It represents the host\'s soul.',
            icon: BookOpen
        },
        { 
            title: t('bread_title') || 'Bread (Nan)', 
            desc: t('bread_desc') || 'Never place bread upside down. If a piece falls, it is common to pick it up, kiss it, and place it somewhere high/safe.',
            icon: Heart
        },
        { 
            title: t('yurt_title') || 'Entering a Yurt', 
            desc: t('yurt_desc') || 'Step in with your right foot first. Do not step on the threshold (Bosaga) as it is considered the "border of the home".',
            icon: Info
        },
    ];

    const GREETINGS = [
        { kz: 'Assalamu Alaikum', usage: 'The Standard / Formal', response: 'Wa Alaikum Assalam', literal: 'Peace be upon you' },
        { kz: 'Salemetsiz be', usage: 'Polite / General', response: 'Salem', literal: 'Hello (Formal)' },
        { kz: 'Qalyñyz qalay?', usage: 'Social Check-in', response: 'Jaqsı, raqmet', literal: 'How is your condition?' },
        { kz: 'Jolıñız bolsın!', usage: 'For Travelers', response: 'Raqmet', literal: 'May your path be successful' },
    ];

    const QUIZ = [
        {
            q: t('quiz_q1') || "What does a half-full cup of tea (Saba) signify in a Kazakh home?",
            a: [
                t('quiz_q1_a1') || "The host is running out of tea", 
                t('quiz_q1_a2') || "The host wants you to stay longer", 
                t('quiz_q1_a3') || "The host is busy and wants you to leave"
            ],
            correct: 1
        },
        {
            q: t('quiz_q2') || "Which foot should you use to enter a traditional dwelling (Yurt) first?",
            a: [
                t('quiz_q2_a1') || "Left", 
                t('quiz_q2_a2') || "Right", 
                t('quiz_q2_a3') || "Doesn't matter"
            ],
            correct: 1
        },
        {
            q: t('quiz_q3') || "What is 'Shashu'?",
            a: [
                t('quiz_q3_a1') || "A type of horse racing", 
                t('quiz_q3_a2') || "A ritual of throwing sweets to guests", 
                t('quiz_q3_a3') || "A traditional hat"
            ],
            correct: 1
        },
        {
            q: t('quiz_q4') || "Why is bread (Nan) never placed upside down?",
            a: [
                t('quiz_q4_a1') || "It's bad for the crust", 
                t('quiz_q4_a2') || "It represents a lack of respect for the food's 'soul'", 
                t('quiz_q4_a3') || "It brings bad weather"
            ],
            correct: 1
        }
    ];

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'kk-KZ';
        window.speechSynthesis.speak(utterance);
    };

    const handleQuiz = (idx: number) => {
        setQuizResult(idx);
        setTimeout(() => {
            if (idx === QUIZ[quizIndex].correct) {
                if (quizIndex < QUIZ.length - 1) {
                    setQuizIndex(quizIndex + 1);
                    setQuizResult(null);
                }
            } else {
                setQuizResult(null);
            }
        }, 1500);
    };

    if (!theme) return null;

    return (
        <div className="flex flex-col h-full p-10" style={{ color: theme.text }}>
            <div className="flex items-start justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8" style={{ backgroundColor: theme.primary }} />
                    <div className="space-y-0.5">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">{t('ethos_guide_title')}</h3>
                        <p className="text-xl font-serif italic">{t('unwritten_code')}</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-8 mb-10 border-b" style={{ borderColor: `${theme.text}10` }}>
                {['lexicon', 'etiquette', 'blessings', 'oracle'].map(tKey => (
                    <button 
                        key={tKey}
                        onClick={() => setActiveTab(tKey)}
                        className={`text-[11px] font-black uppercase tracking-[0.3em] pb-4 transition-all relative`}
                        style={{ 
                            color: activeTab === tKey ? theme.text : `${theme.text}30`
                        }}
                    >
                        {t(`tab_${tKey}`) || tKey}
                        {activeTab === tKey && (
                            <motion.div 
                                layoutId="culture-tab-line"
                                className="absolute bottom-0 left-0 right-0 h-0.5"
                                style={{ backgroundColor: theme.primary }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'lexicon' && (
                        <motion.div 
                            key="lexicon"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="space-y-4 pb-10"
                        >
                            {GREETINGS.map((g, i) => (
                                <div key={i} className="p-8 border group hover:border-current/30 transition-all backdrop-blur-md relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: `${theme.text}10` }}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h4 className="text-4xl font-serif italic font-black" style={{ color: theme.text }}>{g.kz}</h4>
                                            <p className="text-[10px] font-mono uppercase opacity-40">{t('literal')}: "{g.literal}"</p>
                                        </div>
                                        <button onClick={() => speak(g.kz)} className="p-4 rounded-full bg-current/5 hover:bg-current/10 transition-all hover:scale-110">
                                            <Volume2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-[0.3em] border-t pt-4" style={{ borderColor: `${theme.text}05` }}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-current" />
                                            <span className="opacity-60">{g.usage}</span>
                                        </div>
                                        <span className="font-black">{t('resp')}: {g.response}</span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'etiquette' && (
                        <motion.div 
                            key="etiquette"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10"
                        >
                            {ETIQUETTE.map((e, i) => (
                                <div key={i} className="p-8 border flex flex-col gap-6 group hover:bg-white/5 transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: `${theme.text}10` }}>
                                    <div className="p-4 bg-current/5 rounded-full w-fit group-hover:bg-current/10 transition-colors">
                                        <e.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="text-sm font-black uppercase tracking-widest">{e.title}</h5>
                                        <p className="text-sm font-serif italic leading-relaxed opacity-60">{e.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'blessings' && (
                        <motion.div 
                            key="blessings"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="space-y-8 pb-10"
                        >
                            <div className="p-12 text-center space-y-10 border relative overflow-hidden" style={{ backgroundColor: theme.text, color: theme.background, borderColor: theme.text }}>
                                <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ background: `linear-gradient(to right, transparent, ${theme.primary}, transparent)` }} />
                                <div className="space-y-3">
                                    <span className="text-[10px] font-mono uppercase tracking-[0.6em] opacity-40">{t('elder_freq')}</span>
                                    <h4 className="text-5xl font-serif italic tracking-tighter">Aq Bata</h4>
                                </div>
                                <div className="text-2xl leading-[1.4] font-serif italic max-w-lg mx-auto">
                                    "Dastarqanıñ mol bolsın,<br/>
                                    Abıroyıñ zor bolsın,<br/>
                                    Balanıñ aldı bolsın,<br/>
                                    Kez kelgen tüs kelsin!"
                                </div>
                                <div className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 border-t pt-10 border-white/10">
                                    {t('bata_desc')}
                                </div>
                                <button onClick={() => speak("Dastarqanıñ mol bolsın, Abıroyıñ zor bolsın")} className="flex items-center gap-3 mx-auto text-[11px] font-black uppercase tracking-[0.3em] px-10 py-5 border hover:bg-white hover:text-black transition-all">
                                    <Volume2 className="w-5 h-5" /> {t('activate_trans')}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'oracle' && (
                        <motion.div 
                            key="oracle"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="space-y-10 pb-10"
                        >
                            <div className="p-10 border-2 border-dashed flex flex-col items-center justify-center text-center space-y-8" style={{ borderColor: `${theme.text}10` }}>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black uppercase tracking-widest">{t('wisdom_test')}</h4>
                                    <p className="text-sm font-serif italic opacity-40">{t('level')} {quizIndex + 1} / {QUIZ.length}</p>
                                </div>
                                
                                <p className="text-2xl font-serif italic max-w-md">{QUIZ[quizIndex].q}</p>
                                
                                <div className="w-full max-w-sm space-y-3">
                                    {QUIZ[quizIndex].a.map((ans, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleQuiz(idx)}
                                            className="w-full p-5 border text-sm font-bold uppercase tracking-widest transition-all relative overflow-hidden"
                                            style={{ 
                                                backgroundColor: quizResult === idx 
                                                    ? (idx === QUIZ[quizIndex].correct ? '#10b981' : '#ef4444') 
                                                    : 'rgba(255,255,255,0.03)',
                                                color: quizResult === idx ? '#fff' : theme.text,
                                                borderColor: `${theme.text}10`
                                            }}
                                        >
                                            {ans}
                                            {quizResult === idx && (
                                                <motion.div 
                                                    layoutId="quiz-check"
                                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                                >
                                                    {idx === QUIZ[quizIndex].correct ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
