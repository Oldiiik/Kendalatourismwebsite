import React, { useState } from 'react';
import { FileDown, Download, ShieldCheck, Map as MapIcon, Loader2, MapPin } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { motion } from 'motion/react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';

export const PdfExporter = () => {
    const { theme, season } = useSeason();
    const { t } = useLanguage();
    const [generating, setGenerating] = useState(false);
    const [location, setLocation] = useState('Almaty, Kazakhstan');

    const generatePdf = async () => {
        setGenerating(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || publicAnonKey;

            let protocolData = {
                weather: { temp: 'N/A', condition: 'Unknown' },
                hazards: [t('proto_caution') || 'General Caution Required', t('proto_check_news') || 'Check Local News'],
                culture_tip: t('proto_respect') || 'Respect local traditions and elders.',
                gear_check: [t('proto_water') || 'Water', t('proto_warm_clothes') || 'Warm Clothes', t('proto_map') || 'Map'],
                emergency_note: t('proto_dial_112') || 'Dial 112 for all emergencies.'
            };

            try {
                const protoRes = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/tools/protocol`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${publicAnonKey}`,
                        'x-user-token': token
                    },
                    body: JSON.stringify({ location, season })
                });
                
                if (protoRes.ok) {
                    const data = await protoRes.json();
                    if (!data.error) {
                        protocolData = { ...protocolData, ...data };
                    }
                }
            } catch (e) {
                console.error("Protocol fetch failed", e);
            }

            const doc = new jsPDF();
            const date = new Date().toLocaleDateString();
            
            let mapImage = null;
            try {
                const mapUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/proxy/static-map?center=${encodeURIComponent(location)}&zoom=10&size=600x300&maptype=terrain`;
                const res = await fetch(mapUrl);
                if (res.ok) {
                    const blob = await res.blob();
                    mapImage = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                }
            } catch (e) {
                console.error("Map fetch failed", e);
            }

            const margin = 20;
            const pageWidth = 210;
            const contentWidth = pageWidth - (margin * 2);
            let yPos = 30;

            doc.setTextColor(0, 0, 0);
            doc.setDrawColor(0, 0, 0);

            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text(t('pdf_title') || 'KENDALA: GHOST PROTOCOL', margin, yPos);
            yPos += 10;
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`${t('pdf_target') || 'TARGET'}: ${location.toUpperCase()}`, margin, yPos);
            doc.text(`${t('pdf_generated') || 'GENERATED'}: ${date}`, margin + 100, yPos);
            yPos += 6;
            doc.text(`${t('pdf_season') || 'SEASON'}: ${season.toUpperCase()} | ${t('pdf_temp') || 'TEMP'}: ${protocolData.weather.temp}`, margin, yPos);
            yPos += 10;

            doc.setLineWidth(0.5);
            doc.line(margin, yPos, margin + contentWidth, yPos);
            yPos += 10;
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(t('pdf_visual_recon') || 'I. VISUAL RECONNAISSANCE', margin, yPos);
            yPos += 5;

            if (mapImage && typeof mapImage === 'string') {
                doc.addImage(mapImage, 'PNG', margin, yPos, contentWidth, 80);
            } else {
                doc.setFillColor(245, 245, 245);
                doc.rect(margin, yPos, contentWidth, 80, 'F');
                doc.setFont("helvetica", "italic");
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(t('pdf_map_unavailable') || 'Map Data Unavailable Offline', pageWidth / 2, yPos + 40, { align: 'center' });
                doc.setTextColor(0, 0, 0);
            }
            yPos += 90;

            doc.setFillColor(245, 245, 245);
            doc.rect(margin, yPos, contentWidth, 50, 'F');
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(t('pdf_threat_assessment') || 'II. THREAT ASSESSMENT', margin + 5, yPos + 10);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            
            doc.setFont("helvetica", "bold");
            doc.text(t('pdf_primary_alert') || 'PRIMARY ALERT:', margin + 5, yPos + 20);
            doc.setFont("helvetica", "normal");
            const alertLines = doc.splitTextToSize(protocolData.emergency_note, contentWidth - 45);
            doc.text(alertLines, margin + 40, yPos + 20);
            
            const hazardY = yPos + 20 + (alertLines.length * 5) + 5;
            doc.setFont("helvetica", "bold");
            doc.text(t('pdf_hazards') || 'HAZARDS:', margin + 5, hazardY);
            doc.setFont("helvetica", "normal");
            protocolData.hazards.slice(0, 3).forEach((h: string, i: number) => {
                doc.text(`• ${h}`, margin + 40, hazardY + (i * 5));
            });

            yPos += 60;

            const colWidth = (contentWidth / 2) - 5;
            
            doc.setFillColor(245, 245, 245);
            doc.rect(margin, yPos, colWidth, 60, 'F');
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(t('pdf_gear_check') || 'III. GEAR CHECK', margin + 5, yPos + 10);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            protocolData.gear_check.slice(0, 6).forEach((g: string, i: number) => {
                doc.text(`[ ] ${g}`, margin + 5, yPos + 20 + (i * 6));
            });

            doc.setFillColor(245, 245, 245);
            doc.rect(margin + colWidth + 10, yPos, colWidth, 60, 'F');
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text(t('pdf_cultural_intel') || 'IV. CULTURAL INTEL', margin + colWidth + 15, yPos + 10);
            
            doc.setFont("helvetica", "italic");
            doc.setFontSize(10);
            const cultureLines = doc.splitTextToSize(protocolData.culture_tip, colWidth - 10);
            doc.text(cultureLines, margin + colWidth + 15, yPos + 20);

            yPos += 70;

            doc.setLineWidth(0.5);
            doc.line(margin, yPos, margin + contentWidth, yPos);
            yPos += 10;
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(t('pdf_emergency_frequencies') || 'EMERGENCY FREQUENCIES', margin, yPos);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(t('pdf_police') || 'POLICE / FIRE / AMBULANCE: 112', margin, yPos + 6);
            doc.text(t('pdf_roadside') || 'ROADSIDE ASSISTANCE (KazAvtoZhol): 1403', margin, yPos + 12);
            
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(t('pdf_confidential') || 'CONFIDENTIAL: GENERATED BY KENDALA GHOST PROTOCOL. FOR SURVIVAL USE ONLY.', margin, 280);

            doc.save(`GhostProtocol_${location.replace(/[^a-z0-9]/gi, '_')}.pdf`);
        } finally {
            setGenerating(false);
        }
    };

    if (!theme) return null;

    return (
        <div className="flex flex-col h-full p-8" style={{ color: theme.text }}>
            <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="w-5 h-5 opacity-40" />
                <h3 className="text-xs font-black uppercase tracking-[0.4em] opacity-60">{t('offline_safe_trip')}</h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-12 text-center">
                <div className="space-y-4">
                    <motion.div 
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-24 h-24 border rounded-full flex items-center justify-center mx-auto"
                        style={{ borderColor: `${theme.text}20` }}
                    >
                        <FileDown className="w-10 h-10" />
                    </motion.div>
                    <div className="space-y-3">
                        <h4 className="text-6xl font-serif italic tracking-tighter leading-none" style={{ color: theme.text }}>{t('steppe_guard')}</h4>
                        <p className="text-[11px] font-mono uppercase tracking-[0.4em] font-black opacity-80 max-w-[340px] mx-auto leading-relaxed" style={{ color: theme.text }}>
                            {t('pdf_desc')}
                        </p>
                    </div>
                </div>

                <div className="w-full max-w-sm space-y-6">
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                        <input 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-white/5 border px-10 py-4 text-sm font-bold outline-none focus:border-current/40 transition-all text-center uppercase tracking-widest placeholder:text-current/20"
                            style={{ borderColor: `${theme.text}20` }}
                            placeholder={t('enter_region')}
                        />
                    </div>

                    <button 
                        onClick={generatePdf}
                        disabled={generating}
                        className="group relative w-full py-6 border-[3px] overflow-hidden transition-all active:scale-95 disabled:opacity-50 backdrop-blur-sm"
                        style={{ 
                            borderColor: theme.text,
                            backgroundColor: 'transparent',
                            color: theme.text
                        }}
                    >
                        <span className="relative z-10 text-xl font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4">
                            {generating ? <Loader2 className="animate-spin w-5 h-5" /> : <FileDown className="w-5 h-5" />}
                            {generating ? t('generating') : t('download_protocol')}
                        </span>
                        <motion.div 
                            initial={false}
                            whileHover={{ x: '0%' }}
                            animate={{ x: '-100%' }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-current opacity-10 pointer-events-none"
                        />
                    </button>
                </div>
            </div>

            <div className="mt-8 p-4 text-[9px] font-mono uppercase tracking-widest leading-relaxed opacity-40 border-t" style={{ borderColor: `${theme.text}10` }}>
                {t('pdf_footer')}
            </div>
        </div>
    );
};
