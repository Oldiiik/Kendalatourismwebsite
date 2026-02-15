import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTrip } from '../../contexts/TripContext';
import { ItineraryItem } from './plannerTypes';
import { toast } from 'sonner@2.0.3';
import { 
    Send, MapPin, Clock, ArrowRight, X, Plus, RefreshCw, 
    Mountain, Camera, Utensils, Droplet, Wind, Sun, ArrowUpRight, 
    Compass, Map as MapIcon, Package, FileText, CheckCircle, Zap, 
    ChevronRight, Layers, Activity, Search, Globe, Star, ArrowLeft,
    Tent, Moon, Sunrise, Sunset, Calendar, Shield, Info, CreditCard,
    Briefcase, Navigation, Eye, Globe as Languages, Save, Play, Route
} from '../ui/icons';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { SEASON_SELECTION_URLS } from '../../utils/imageUrls';
import ReactMarkdown from 'react-markdown';

const SafeMarkdown = ({ children, components }: { children: string; components?: any; [key: string]: any }) => {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'tool-result';
}

interface ToolField {
  id: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'number' | 'select' | 'textarea';
  options?: { label: string; value: string }[];
}

interface ToolDef {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  tag: string;
  fields: ToolField[];
  promptTemplate: string;
}

const UniqueThinkingAnimation = ({ color, label }: { color: string; label?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-10 py-24 w-full">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div
                    animate={{ 
                        scale: [0.8, 1.5],
                        opacity: [0.5, 0],
                        borderWidth: ["4px", "0px"]
                    }}
                    transition={{ 
                        duration: 1.2, 
                        repeat: Infinity, 
                        ease: "easeOut" 
                    }}
                    className="absolute inset-0 rounded-none border-2"
                    style={{ borderColor: color }}
                />
                
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: [0.8, 0, 0.2, 1] // Custom bezier for "snap" effect
                    }}
                    className="absolute inset-2 rounded-none border-t-4 border-r-2 border-transparent"
                    style={{ borderTopColor: color, borderRightColor: `${color}40` }}
                />

                <motion.div 
                    animate={{ scale: [1, 0.8, 1] }}
                    transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1.2 }}
                    className="w-3 h-3 rounded-none"
                    style={{ backgroundColor: color }}
                />
            </div>
            
            <div className="relative overflow-hidden">
                <motion.p 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400"
                >
                    {label || 'THINKING'}
                </motion.p>
            </div>
        </div>
    );
};

const NaturalCard = ({ children, color, delay = 0 }: { children: React.ReactNode, color: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        className="relative p-6 md:p-10 rounded-none bg-white/60 backdrop-blur-2xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all overflow-hidden group w-full"
    >
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-none blur-3xl opacity-5 transition-transform group-hover:scale-150" style={{ backgroundColor: color }} />
        <div className="relative z-10 w-full min-w-0">{children}</div>
    </motion.div>
);

export const AIAssistantPage = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const { theme, season } = useSeason();
  const { t, language } = useLanguage();
  const { 
    setItinerary, setTripTitle, setDestination, setDayCount,
    createNewTrip, saveCurrentTrip, itinerary: currentItinerary
  } = useTrip();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolDef | null>(null);
  const [toolValues, setToolValues] = useState<Record<string, string>>({});
  const [toolResult, setToolResult] = useState<string | null>(null);
  const [isToolLoading, setIsToolLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mobileView, setMobileView] = useState<'chat' | 'tools'>('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const displayFont = 'font-sans';

  const saveConstructorToTrip = useCallback(async (data: any, andFly?: boolean) => {
    if (!data?.itinerary) return;
    setIsSaving(true);
    try {
      createNewTrip();
      
      const dest = toolValues['destination'] || data.trip_title || '';
      setTripTitle(data.trip_title || t('trip_name_placeholder'));
      setDestination(dest);
      
      const newItems: ItineraryItem[] = [];
      const timeMap: Record<string, string> = { morning: '09:00', afternoon: '14:00', evening: '19:00' };
      
      data.itinerary.forEach((day: any, idx: number) => {
        const dayNum = day.day || idx + 1;
        ['morning', 'afternoon', 'evening'].forEach((period) => {
          if (day[period]) {
            const periodLocation = day[`${period}_location`] || '';
            const specificLocation = periodLocation || day.title || dest;
            const lat = parseFloat(day[`${period}_lat`]);
            const lng = parseFloat(day[`${period}_lng`]);
            const hasCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
            const coordTag = hasCoords ? ` [coords: ${lat}, ${lng}]` : '';
            newItems.push({
              id: crypto.randomUUID(),
              day: dayNum,
              time: timeMap[period],
              activity: day.title ? `${day.title} — ${period.charAt(0).toUpperCase() + period.slice(1)}` : `Day ${dayNum} ${period.charAt(0).toUpperCase() + period.slice(1)}`,
              type: 'activity',
              cost: 0,
              location: specificLocation,
              notes: `${day[period]}${coordTag}`
            });
          }
        });
      });

      setItinerary(newItems);
      const maxDay = Math.max(...newItems.map(i => i.day), 1);
      setDayCount(maxDay);
      
      await new Promise(r => setTimeout(r, 100));
      await saveCurrentTrip();
      
      toast.success(t('ai_trip_saved'));
      
      if (andFly && onNavigate) {
        sessionStorage.setItem('kendala_launch_flyover', 'true');
        onNavigate('planner');
      }
    } catch (e) {
      console.error('Error saving constructor trip:', e);
      toast.error('Failed to save trip');
    } finally {
      setIsSaving(false);
    }
  }, [toolValues, createNewTrip, setTripTitle, setDestination, setItinerary, setDayCount, saveCurrentTrip, onNavigate, t]);

  const addGemToTrip = useCallback(async (gem: any) => {
    const locationStr = gem.nearest_landmark || gem.name || 'Kazakhstan';
    const lat = parseFloat(gem.lat);
    const lng = parseFloat(gem.lng);
    const hasCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    const coordTag = hasCoords ? ` [coords: ${lat}, ${lng}]` : '';
    const newItem: ItineraryItem = {
      id: crypto.randomUUID(),
      day: Math.max(...currentItinerary.map(i => i.day), 1),
      time: '10:00',
      activity: gem.name,
      type: 'activity',
      cost: 0,
      location: locationStr,
      notes: `${gem.why_special || ''} ${gem.directions || ''}${coordTag}`.trim()
    };
    setItinerary(prev => [...prev, newItem]);
    toast.success(t('ai_gem_added'));
  }, [currentItinerary, setItinerary, t]);

  const saveHorizonToTrip = useCallback(async (data: any) => {
    if (!data?.segments) return;
    setIsSaving(true);
    try {
      createNewTrip();
      const start = toolValues['start_point'] || '';
      const end = toolValues['end_point'] || '';
      setTripTitle(data.path_name || `${start} → ${end}`);
      setDestination(`${start} - ${end}`);
      
      const newItems: ItineraryItem[] = data.segments.map((seg: any, idx: number) => {
        const lat = parseFloat(seg.lat);
        const lng = parseFloat(seg.lng);
        const hasCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
        const coordTag = hasCoords ? ` [coords: ${lat}, ${lng}]` : '';
        return {
          id: crypto.randomUUID(),
          day: idx + 1,
          time: '08:00',
          activity: seg.milestone,
          type: 'travel' as const,
          cost: 0,
          location: seg.milestone,
          notes: `${seg.terrain} · ${seg.distance}${seg.notes ? ' — ' + seg.notes : ''}${coordTag}`
        };
      });

      setItinerary(newItems);
      setDayCount(newItems.length);
      
      await new Promise(r => setTimeout(r, 100));
      await saveCurrentTrip();
      
      toast.success(t('ai_route_saved'));
    } catch (e) {
      console.error('Error saving horizon route:', e);
    } finally {
      setIsSaving(false);
    }
  }, [toolValues, createNewTrip, setTripTitle, setDestination, setItinerary, setDayCount, saveCurrentTrip, t]);

  const saveBudgetToTrip = useCallback(async (data: any) => {
    if (!data?.breakdown) return;
    setIsSaving(true);
    try {
      createNewTrip();
      const dest = toolValues['destination'] || '';
      const days = parseInt(toolValues['days'] || '1');
      setTripTitle(`${dest} — ${data.total_estimate}`);
      setDestination(dest);
      
      const newItems: ItineraryItem[] = data.breakdown.map((item: any, idx: number) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lng);
        const hasCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
        const coordTag = hasCoords ? ` [coords: ${lat}, ${lng}]` : '';
        return {
          id: crypto.randomUUID(),
          day: Math.min(idx + 1, days),
          time: '09:00',
          activity: item.category,
          type: 'activity' as const,
          cost: parseInt(String(item.cost).replace(/[^0-9]/g, '')) || 0,
          location: item.example_place || dest,
          notes: `${item.description || ''}${coordTag}`
        };
      });

      setItinerary(newItems);
      setDayCount(days);
      
      await new Promise(r => setTimeout(r, 100));
      await saveCurrentTrip();
      toast.success(t('ai_trip_saved'));
    } catch (e) {
      console.error('Error saving budget trip:', e);
    } finally {
      setIsSaving(false);
    }
  }, [toolValues, createNewTrip, setTripTitle, setDestination, setItinerary, setDayCount, saveCurrentTrip, t]);

  const SEASONAL_VISUALS = useMemo(() => ({
    winter: { 
      image: SEASON_SELECTION_URLS.winter, 
      accent: "#708090", // Slate Gray
      bg: "bg-slate-50", 
      text: "text-slate-900" 
    },
    spring: { 
      image: SEASON_SELECTION_URLS.spring, 
      accent: "#84a59d", // Muted Sage
      bg: "bg-stone-50", 
      text: "text-stone-900" 
    },
    summer: { 
      image: SEASON_SELECTION_URLS.summer, 
      accent: "#d4a373", // Sandy Gold
      bg: "bg-orange-50/30", 
      text: "text-orange-950" 
    },
    autumn: { 
      image: SEASON_SELECTION_URLS.autumn, 
      accent: "#a67c52", // Muted Terra
      bg: "bg-amber-50/30", 
      text: "text-amber-950" 
    }
  }), [t]);

  const currentVisual = season ? SEASONAL_VISUALS[season] : SEASONAL_VISUALS.summer;

  const GEM_FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1752503256243-2edf964c00d0',
    'https://images.unsplash.com/photo-1768363413701-7e84a071d6ec',
    'https://images.unsplash.com/photo-1731157414702-a3ebce2960ec',
    'https://images.unsplash.com/photo-1757017634529-3cf08583b4b0',
    'https://images.unsplash.com/photo-1747866695935-fa6de1aa7d36',
    'https://images.unsplash.com/photo-1767347838163-068d51573990',
    'https://images.unsplash.com/photo-1627842822558-c1f15aef9838',
    'https://images.unsplash.com/photo-1683199837323-ebdc3a4e7eeb',
  ];

  const tools: ToolDef[] = useMemo(() => [
      { id: 'constructor', label: t('tool_constructor_label'), icon: MapIcon, tag: 'PLAN', description: t('tool_constructor_desc'), fields: [ { id: 'destination', label: t('field_destination'), placeholder: t('ph_destination'), type: 'text' }, { id: 'duration', label: t('field_duration'), placeholder: t('ph_duration'), type: 'text' }, { id: 'budget', label: t('field_budget'), placeholder: t('ph_budget'), type: 'select', options: [ { label: t('opt_budget'), value: 'Budget' }, { label: t('opt_moderate'), value: 'Moderate' }, { label: t('opt_luxury'), value: 'Luxury' }, { label: t('opt_nomadic'), value: 'Nomadic' } ] }, { id: 'interests', label: t('field_interests'), placeholder: t('ph_interests'), type: 'text' } ], promptTemplate: "Create a detailed {{duration}} itinerary for {{destination}} focusing on {{interests}} with a {{budget}} budget. Provide extremely detailed morning, afternoon, and evening activities." },
      { id: 'hidden_gems', label: t('tool_hidden_gems_label'), icon: Star, tag: 'DISCOVER', description: t('tool_hidden_gems_desc'), fields: [ { id: 'location', label: t('field_location'), placeholder: t('ph_location'), type: 'text' }, { id: 'type', label: t('field_type'), placeholder: t('ph_type'), type: 'select', options: [ { label: t('opt_nature'), value: 'Nature' }, { label: t('opt_culture'), value: 'Culture' }, { label: t('opt_food'), value: 'Food' } ] } ], promptTemplate: "Reveal hidden gems in {{location}} of type {{type}}. Include detailed history and local legends." },
      { id: 'translator', label: t('tool_translator_label'), icon: Globe, tag: 'LANG', description: t('tool_translator_desc'), fields: [ { id: 'phrase', label: t('field_phrase'), placeholder: t('ph_phrase'), type: 'text' }, { id: 'context', label: t('field_context'), placeholder: t('ph_context'), type: 'text' } ], promptTemplate: "Translate '{{phrase}}' for context: {{context}}. Provide deep cultural context and usage tips." },
      { id: 'horizon', label: t('tool_horizon_label'), icon: Compass, tag: 'PATH', description: t('tool_horizon_desc'), fields: [ { id: 'start_point', label: t('field_start_point'), placeholder: t('ph_start_point'), type: 'text' }, { id: 'end_point', label: t('field_end_point'), placeholder: t('ph_end_point'), type: 'text' } ], promptTemplate: "Analyze the path from {{start_point}} to {{end_point}}. Break it into detailed segments with terrain info." },
      { id: 'nomad', label: t('tool_nomad_label'), icon: Package, tag: 'GEAR', description: t('tool_nomad_desc'), fields: [ { id: 'terrain', label: t('field_terrain'), placeholder: t('ph_terrain'), type: 'text' }, { id: 'days', label: t('field_days'), placeholder: t('ph_days'), type: 'number' } ], promptTemplate: "List essential gear for {{days}} days in {{terrain}}. Explain why each item is critical." },
      { id: 'budget_calc', label: t('tool_budget_label'), icon: FileText, tag: 'BUDGET', description: t('tool_budget_desc'), fields: [ { id: 'destination', label: t('field_destination'), placeholder: t('ph_destination'), type: 'text' }, { id: 'days', label: t('field_days'), placeholder: t('ph_days'), type: 'number' } ], promptTemplate: "Estimate budget for {{days}} days in {{destination}}. Provide categories and money saving tips." }
  ], [t]);

  useEffect(() => {
    if (theme) {
        setMessages([{ id: 'init-1', text: t('ai_guide_desc'), sender: 'ai', timestamp: new Date() }]);
    }
  }, [language, t, theme]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
      setToolValues({});
      setToolResult(null);
      setIsToolLoading(false);
  }, [activeTool]);

  const handleSend = async (manualText?: string) => {
    const text = manualText || input;
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: crypto.randomUUID(), text, sender: 'user', timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || publicAnonKey;
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}`, 'x-user-token': token },
            body: JSON.stringify({ message: text + ` (Tone: Laconic, strict, concise. Max 2 sentences unless listing. Focus on Kazakhstan. Language: ${language}. Season: ${season})` })
        });
        const data = await response.json();
        setMessages(prev => [...prev, { id: crypto.randomUUID(), text: data.reply || "Connection lost.", sender: 'ai', timestamp: new Date() }]);
    } catch (e) {
        setMessages(prev => [...prev, { id: crypto.randomUUID(), text: "Error syncing.", sender: 'ai', timestamp: new Date() }]);
    } finally {
        setIsTyping(false);
    }
  };

  const executeTool = async () => {
    if (!activeTool) return;
    if (activeTool.fields.some(f => !toolValues[f.id])) return;
    setIsToolLoading(true);
    setToolResult(null);
    let fullPrompt = activeTool.promptTemplate;
    Object.entries(toolValues).forEach(([key, value]) => { fullPrompt = fullPrompt.replace(`{{${key}}}`, value); });
    
    let instructions = `\n\nIMPORTANT: Answer in ${language}. Use nomadic terminology. You MUST return ONLY valid JSON — no markdown, no backticks, no extra text before or after. Schema: `;
    if (activeTool.id === 'constructor') instructions += `{ "trip_title": "string", "overview": "string", "itinerary": [{ "day": number, "title": "string", "morning": "detailed activity description", "morning_location": "specific place or landmark name", "morning_lat": number, "morning_lng": number, "afternoon": "detailed activity description", "afternoon_location": "specific place or landmark name", "afternoon_lat": number, "afternoon_lng": number, "evening": "detailed activity description", "evening_location": "specific place or landmark name", "evening_lat": number, "evening_lng": number }], "tips": ["string"] }. CRITICAL RULES: 1) Each morning_location, afternoon_location, evening_location MUST be a specific, different, real named place (e.g. "Medeu Ice Rink", "Kok-Tobe Hill", "Green Bazaar") — NEVER a generic city name. 2) morning_lat/morning_lng etc. MUST be real GPS decimal coordinates for that exact place (e.g. 43.1567, 77.0572). 3) Every single activity MUST have its own unique lat/lng — no two activities should share the same coordinates.`;
    else if (activeTool.id === 'hidden_gems') instructions += `{ "region": "string", "gems": [{ "name": "string", "lat": number, "lng": number, "why_special": "string", "directions": "string", "nearest_landmark": "specific nearby landmark name" }], "local_legend": "string" }. CRITICAL: lat/lng MUST be real GPS decimal coordinates for the exact gem location. Each gem MUST have unique coordinates.`;
    else if (activeTool.id === 'translator') instructions += `{ "original": "string", "translation": "string", "pronunciation": "string", "usage_tips": ["string"], "cultural_context": "string" }`;
    else if (activeTool.id === 'horizon') instructions += `{ "path_name": "string", "segments": [{ "milestone": "specific named city, town, or landmark", "lat": number, "lng": number, "distance": "string", "terrain": "string", "notes": "string" }], "resting_spots": ["string"], "safety_warning": "string" }. CRITICAL: each milestone MUST be a different specific named place with real GPS decimal lat/lng coordinates.`;
    else if (activeTool.id === 'nomad') instructions += `{ "kit_name": "string", "gear_categories": [{ "category": "string", "items": [{ "name": "string", "purpose": "string" }] }], "seasonal_tip": "string" }`;
    else if (activeTool.id === 'budget_calc') instructions += `{ "total_estimate": "string", "breakdown": [{ "category": "string", "cost": "string", "description": "string", "example_place": "a specific real place name", "lat": number, "lng": number }], "money_saving_tips": ["string"] }. Include real GPS coordinates for each example_place.`;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || publicAnonKey;
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}`, 'x-user-token': token },
            body: JSON.stringify({ message: fullPrompt + instructions })
        });
        if (!response.ok) {
            console.error('Tool API error:', response.status);
            setToolResult(`Error: Server returned ${response.status}`);
            setIsToolLoading(false);
            return;
        }
        const data = await response.json();
        if (data.error) {
            console.error('Tool API returned error:', data.error);
            setToolResult(`Error: ${data.error}`);
            setIsToolLoading(false);
            return;
        }
        setToolResult(data.reply || 'No response generated.');
    } catch (e: any) {
        console.error('Tool execution error:', e);
        setToolResult('Connection error. Please try again.');
    } finally {
        setIsToolLoading(false);
    }
  };

  const extractJSON = (raw: string): any => {
    if (!raw) return null;
    try { return JSON.parse(raw); } catch {}
    let cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    try { return JSON.parse(cleaned); } catch {}
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) { try { return JSON.parse(jsonMatch[0]); } catch {} }
    return null;
  };

  const renderToolResult = () => {
      if (!toolResult) return null;
      
      const data = extractJSON(toolResult);
      if (!data) {
          return <div className="prose prose-lg max-w-none text-zinc-800 font-bold leading-relaxed"><SafeMarkdown>{toolResult}</SafeMarkdown></div>;
      }
          
          if (activeTool?.id === 'constructor') return (
              <div className="space-y-12 max-w-6xl mx-auto">
                    <div className="text-center space-y-6 mb-20 px-4">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 md:w-24 md:h-24 bg-white shadow-2xl rounded-none flex items-center justify-center mx-auto mb-8 border shrink-0" style={{ color: currentVisual.accent }}>
                        <MapIcon className="w-10 h-10 md:w-12 md:h-12" />
                      </motion.div>
                      <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-800 leading-[0.9]">{data.trip_title}</h3>
                      <p className="text-xl md:text-2xl font-bold text-zinc-400 italic max-w-3xl mx-auto line-clamp-3 md:line-clamp-none">"{data.overview}"</p>
                  </div>
                  
                  <div className="relative space-y-24">
                      <div className="absolute left-[40px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-200 to-transparent" />
                      
                      {data.itinerary?.map((day: any, i: number) => (
                          <div key={i} className={`flex flex-col md:flex-row items-start gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                              <div className="flex-[4] w-full min-w-0 relative z-10">
                                  <NaturalCard color={currentVisual.accent} delay={i * 0.1}>
                                      <div className="flex items-center gap-6 md:gap-10 mb-10 min-w-0">
                                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-none flex items-center justify-center font-black text-2xl md:text-3xl text-white shadow-xl shrink-0" style={{ backgroundColor: currentVisual.accent }}>{i+1}</div>
                                          <h4 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-black leading-tight flex-1 min-w-0">{day.title}</h4>
                                      </div>
                                      <div className="grid md:grid-cols-3 gap-8 md:gap-12 overflow-hidden">
                                          {['morning', 'afternoon', 'evening'].map((time, idx) => (
                                              <div key={time} className="group/item min-w-0 space-y-4">
                                                  <div className="flex items-center gap-4">
                                                      <div className="w-3 h-3 rounded-none shrink-0" style={{ backgroundColor: currentVisual.accent }} />
                                                      <span className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.4em] text-zinc-500 shrink-0">{t(`ai_${time}`)}</span>
                                                  </div>
                                                  {day[`${time}_location`] && (
                                                    <div className="flex items-center gap-2 pl-6 text-zinc-400">
                                                      <MapPin className="w-3 h-3 shrink-0" />
                                                      <span className="text-[10px] font-black uppercase tracking-wider truncate">{day[`${time}_location`]}</span>
                                                    </div>
                                                  )}
                                                  <p className="text-lg font-bold text-zinc-900 leading-relaxed pl-6 border-l-2 border-zinc-200 group-hover/item:border-zinc-400 transition-colors">{day[time]}</p>
                                              </div>
                                          ))}
                                      </div>
                                  </NaturalCard>
                              </div>
                              <div className="hidden md:flex w-12 h-12 rounded-none bg-white border-4 items-center justify-center z-20 shrink-0 mt-24" style={{ borderColor: `${currentVisual.accent}20`, color: currentVisual.accent }}>
                                  <div className="w-3 h-3 rounded-none animate-pulse" style={{ backgroundColor: currentVisual.accent }} />
                              </div>
                              <div className="flex-1 hidden md:block" />
                          </div>
                      ))}
                  </div>

                  {data.tips && data.tips.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.5 }}
                        className="mx-2 p-8 md:p-10 rounded-none border border-zinc-100 bg-white/50 backdrop-blur-md space-y-6 overflow-hidden"
                      >
                          <div className="flex items-center gap-3 md:gap-4 text-zinc-400 min-w-0">
                              <Zap className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{t('ai_tips')}</span>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                              {data.tips.map((tip: string, idx: number) => (
                                  <div key={idx} className="p-4 bg-white/50 rounded-none border border-white flex items-start gap-4 min-w-0">
                                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: currentVisual.accent }} />
                                      <p className="text-[10px] md:text-xs font-bold text-zinc-600 leading-relaxed uppercase tracking-tight">{tip}</p>
                                  </div>
                              ))}
                          </div>
                      </motion.div>
                  )}

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.7 }}
                    className="mx-2 p-8 md:p-12 rounded-none bg-zinc-900 text-white relative overflow-hidden"
                  >
                      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-none blur-3xl opacity-10" style={{ backgroundColor: currentVisual.accent }} />
                      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                          <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 block mb-2">{t('ai_saved_success')}</span>
                              <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{t('ai_save_to_planner')}</h4>
                              <p className="text-xs font-bold text-zinc-400 mt-2 uppercase tracking-wider">{data.trip_title} · {data.itinerary?.length || 0} {t('day')}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
                              <button 
                                  onClick={() => saveConstructorToTrip(data)}
                                  disabled={isSaving}
                                  className="px-8 py-4 text-black font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 rounded-none shadow-xl"
                                  style={{ backgroundColor: currentVisual.accent }}
                              >
                                  <Save className="w-4 h-4" /> {isSaving ? t('saving') : t('ai_save_to_planner')}
                              </button>
                              <button 
                                  onClick={() => saveConstructorToTrip(data, true)}
                                  disabled={isSaving}
                                  className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/20 transition-all flex items-center justify-center gap-3 rounded-none"
                              >
                                  <Play className="w-4 h-4" /> {t('ai_save_and_fly')}
                              </button>
                          </div>
                      </div>
                  </motion.div>
              </div>
          );

          if (activeTool?.id === 'hidden_gems') return (
              <div className="space-y-12 max-w-5xl mx-auto">
                  <div className="flex items-center justify-between mb-16 border-b pb-8">
                      <h3 className="text-4xl font-black uppercase tracking-tighter text-zinc-800">{data.region}</h3>
                      <div className="flex items-center gap-4 text-zinc-400 font-black text-xs uppercase tracking-widest">
                          <Eye className="w-5 h-5" /> {t('ui_secret_vision')}
                      </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                      {data.gems?.map((gem: any, i: number) => (
                          <div key={i} className="h-full">
                            <NaturalCard color={currentVisual.accent} delay={i * 0.15}>
                                <div className="relative h-40 md:h-48 -mx-6 md:-mx-10 -mt-6 md:-mt-10 mb-6 md:mb-8 overflow-hidden bg-zinc-100 flex items-center justify-center shrink-0">
                                    <ImageWithFallback src={GEM_FALLBACK_IMAGES[i % GEM_FALLBACK_IMAGES.length]} className="w-full h-full object-cover hover:scale-110 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                    <div className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 bg-white/90 backdrop-blur-md border" style={{ color: currentVisual.accent }}>
                                        <Star className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                                    </div>
                                </div>
                                <h4 className="text-xl md:text-2xl font-black uppercase text-zinc-800 mb-3 md:mb-4">{gem.name}</h4>
                                <p className="text-base md:text-lg font-bold text-zinc-500 leading-relaxed mb-6 md:mb-8 line-clamp-4 md:line-clamp-none">{gem.why_special}</p>
                                <div className="mt-auto">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-zinc-50">
                                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                            <Navigation className="w-3 h-3 md:w-4 md:h-4" /> {gem.coordinates}
                                        </span>
                                        <button 
                                            onClick={() => addGemToTrip(gem)}
                                            className="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-4 md:px-6 py-2 rounded-none border hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
                                            style={{ borderColor: currentVisual.accent, color: currentVisual.accent }}
                                        >
                                            <Plus className="w-3 h-3" /> {t('ai_add_to_trip')}
                                        </button>
                                    </div>
                                </div>
                            </NaturalCard>
                          </div>
                      ))}
                  </div>
                  {data.local_legend && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="p-12 rounded-none bg-zinc-900 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-none -translate-y-1/2 translate-x-1/2 blur-3xl" />
                          <span className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40 mb-6 block">{t('ui_echoes_past')}</span>
                          <p className="text-2xl md:text-3xl font-bold leading-tight italic">"{data.local_legend}"</p>
                      </motion.div>
                  )}

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
                  >
                      <button 
                          onClick={() => {
                              data.gems?.forEach((gem: any) => addGemToTrip(gem));
                              toast.success(`${data.gems?.length || 0} ${t('ai_gem_added')}`);
                          }}
                          className="px-10 py-4 font-black uppercase tracking-[0.2em] text-[10px] text-white hover:scale-105 active:scale-95 transition-all flex items-center gap-3 rounded-none shadow-xl"
                          style={{ backgroundColor: currentVisual.accent }}
                      >
                          <Save className="w-4 h-4" /> {t('ai_save_to_planner')} ({data.gems?.length || 0})
                      </button>
                      {onNavigate && (
                          <button 
                              onClick={() => onNavigate('planner')}
                              className="px-8 py-4 border-2 border-zinc-200 text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-100 transition-all flex items-center gap-3 rounded-none"
                          >
                              <ArrowRight className="w-4 h-4" /> {t('ai_open_planner')}
                          </button>
                      )}
                  </motion.div>
              </div>
          );

          if (activeTool?.id === 'translator') return (
              <div className="max-w-3xl mx-auto py-10 md:py-20 text-center space-y-12 md:space-y-16">
                  <div className="space-y-4 px-4">
                      <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-zinc-300">{t('ui_original_breath')}</span>
                      <p className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-800">{data.original}</p>
                  </div>
                  
                  <div className="relative px-2">
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="p-12 md:p-24 rounded-none text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group" 
                        style={{ backgroundColor: currentVisual.accent }}
                      >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-none bg-black/10 blur-3xl group-hover:scale-150 transition-transform" />
                          <p className="text-5xl md:text-8xl font-black mb-4 leading-none">{data.translation}</p>
                          <p className="text-xl md:text-3xl font-mono opacity-60 tracking-widest italic">{data.pronunciation}</p>
                      </motion.div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                      <NaturalCard color={currentVisual.accent} delay={0.2}>
                          <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 text-zinc-400">{t('ui_kinship_lore')}</h5>
                          <p className="text-lg md:text-xl font-bold text-zinc-700 leading-relaxed text-left">{data.cultural_context}</p>
                      </NaturalCard>
                      <div className="space-y-4">
                          {data.usage_tips?.map((tip: string, idx: number) => (
                              <motion.div 
                                key={idx} 
                                initial={{ x: 20, opacity: 0 }} 
                                animate={{ x: 0, opacity: 1 }} 
                                transition={{ delay: 0.4 + idx * 0.1 }}
                                className="p-4 md:p-6 rounded-none bg-white border border-zinc-100 flex items-center gap-4 text-left shadow-sm shrink-0"
                              >
                                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-none flex items-center justify-center border text-zinc-300 font-black shrink-0">{idx + 1}</div>
                                  <p className="text-[10px] md:text-sm font-black text-zinc-600 uppercase tracking-tight">{tip}</p>
                              </motion.div>
                          ))}
                      </div>
                  </div>
              </div>
          );

          if (activeTool?.id === 'horizon') return (
              <div className="max-w-4xl mx-auto space-y-10 md:space-y-16">
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 px-4">
                      <div className="p-6 md:p-8 rounded-none bg-white border-4 flex items-center justify-center shrink-0" style={{ borderColor: `${currentVisual.accent}20`, color: currentVisual.accent }}>
                          <Compass className="w-10 h-10 md:w-12 md:h-12" />
                      </div>
                      <div className="space-y-2 text-center md:text-left">
                          <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-zinc-300">{t('ui_terrain_analysis')}</span>
                          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-zinc-800 leading-tight">{data.path_name}</h3>
                      </div>
                  </div>

                  <div className="space-y-6 md:space-y-8">
                      {data.segments?.map((seg: any, i: number) => (
                          <NaturalCard key={i} color={currentVisual.accent} delay={i * 0.1}>
                              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
                                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-none border-[6px] md:border-[10px] flex items-center justify-center font-black text-2xl md:text-4xl shrink-0 transition-transform group-hover:scale-110" style={{ borderColor: `${currentVisual.accent}05`, color: currentVisual.accent }}>
                                      {i+1}
                                  </div>
                                  <div className="flex-1 text-center md:text-left min-w-0">
                                      <h4 className="text-xl md:text-3xl font-black uppercase tracking-tight text-zinc-800 mb-2 md:mb-3">{seg.milestone}</h4>
                                      <p className="text-base md:text-lg font-bold text-zinc-500 leading-relaxed">{seg.notes}</p>
                                  </div>
                                  <div className="flex flex-row md:flex-col gap-3 shrink-0">
                                      <div className="px-4 md:px-6 py-2 md:py-3 bg-zinc-50 rounded-none border flex items-center gap-2 md:gap-3">
                                          <Mountain className="w-4 h-4 md:w-5 md:h-5 text-zinc-300" />
                                          <span className="text-[9px] md:text-[11px] font-black uppercase text-zinc-600 whitespace-nowrap">{seg.terrain}</span>
                                      </div>
                                      <div className="px-4 md:px-6 py-2 md:py-3 bg-zinc-50 rounded-none border flex items-center gap-2 md:gap-3">
                                          <Navigation className="w-4 h-4 md:w-5 md:h-5 text-zinc-300" />
                                          <span className="text-[9px] md:text-[11px] font-black uppercase text-zinc-600 whitespace-nowrap">{seg.distance}</span>
                                      </div>
                                  </div>
                              </div>
                          </NaturalCard>
                      ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                      <div className="p-8 md:p-12 rounded-none border-4 border-dashed border-zinc-100 flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
                           <Moon className="w-8 h-8 md:w-10 md:h-10 text-zinc-200" />
                           <h5 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-400">{t('ui_resting_sanctuaries')}</h5>
                           <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                               {data.resting_spots?.map((spot: string) => (
                                   <span key={spot} className="px-3 md:px-4 py-1.5 md:py-2 bg-white rounded-none border text-[9px] md:text-[10px] font-black uppercase text-zinc-500">{spot}</span>
                               ))}
                           </div>
                      </div>
                      <div className="p-8 md:p-12 rounded-none bg-red-50 border border-red-100 flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
                           <Shield className="w-8 h-8 md:w-10 md:h-10 text-red-200" />
                           <h5 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-red-400">{t('ui_path_guardian')}</h5>
                           <p className="text-xs md:text-sm font-bold text-red-900 uppercase tracking-tight leading-relaxed px-2">{data.safety_warning}</p>
                      </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
                  >
                      <button 
                          onClick={() => saveHorizonToTrip(data)}
                          disabled={isSaving}
                          className="px-10 py-4 font-black uppercase tracking-[0.2em] text-[10px] text-white hover:scale-105 active:scale-95 transition-all flex items-center gap-3 rounded-none shadow-xl"
                          style={{ backgroundColor: currentVisual.accent }}
                      >
                          <Save className="w-4 h-4" /> {isSaving ? t('saving') : t('ai_save_to_planner')}
                      </button>
                      <button 
                          onClick={async () => {
                              await saveHorizonToTrip(data);
                              if (onNavigate) {
                                  sessionStorage.setItem('kendala_launch_flyover', 'true');
                                  onNavigate('planner');
                              }
                          }}
                          disabled={isSaving}
                          className="px-8 py-4 bg-zinc-900 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-800 transition-all flex items-center gap-3 rounded-none shadow-lg"
                      >
                          <Play className="w-4 h-4" /> {t('ai_save_and_fly')}
                      </button>
                  </motion.div>
              </div>
          );

          if (activeTool?.id === 'nomad') return (
              <div className="space-y-12 md:space-y-16 max-w-6xl mx-auto">
                  <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 mb-12 md:mb-20 px-4">
                      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="w-24 h-24 md:w-32 md:h-32 rounded-none bg-white shadow-3xl flex items-center justify-center text-zinc-800 border shrink-0">
                          <Package className="w-12 h-12 md:w-16 md:h-16" />
                      </motion.div>
                      <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-800 leading-tight">{data.kit_name}</h3>
                      <div className="px-6 md:px-8 py-2 md:py-3 bg-white rounded-none border shadow-sm flex items-center gap-3 md:gap-4 mx-auto">
                          <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-400 shrink-0" />
                          <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-zinc-400">{data.seasonal_tip}</span>
                      </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {data.gear_categories?.map((cat: any, i: number) => (
                          <NaturalCard key={i} color={currentVisual.accent} delay={i * 0.1}>
                              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 pb-4 md:pb-6 border-b border-zinc-50 min-w-0">
                                  <Layers className="w-5 h-5 md:w-6 md:h-6 text-zinc-200 shrink-0" />
                                  <h4 className="text-base md:text-lg font-black uppercase tracking-widest text-zinc-800">{cat.category}</h4>
                              </div>
                              <div className="space-y-6 md:space-y-8 overflow-hidden">
                                  {cat.items?.map((item: any, j: number) => (
                                      <div key={j} className="group/item flex gap-3 md:gap-4 min-w-0">
                                          <div className="w-1 h-1 rounded-none mt-2 transition-transform group-hover/item:scale-150 shrink-0" style={{ backgroundColor: currentVisual.accent }} />
                                          <div className="space-y-1 min-w-0">
                                              <p className="text-sm md:text-base font-black uppercase text-zinc-800 leading-tight">{item.name}</p>
                                              <p className="text-[10px] md:text-[11px] font-bold text-zinc-400 leading-snug">{item.purpose}</p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </NaturalCard>
                      ))}
                  </div>
              </div>
          );

          if (activeTool?.id === 'budget_calc') return (
              <div className="max-w-3xl mx-auto space-y-10 md:space-y-12 py-6 md:py-10">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="p-10 md:p-20 rounded-none text-center bg-zinc-900 text-white shadow-3xl relative overflow-hidden mx-2"
                  >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-none bg-white/5 blur-3xl animate-pulse" />
                      <CreditCard className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-6 md:mb-8 opacity-40" />
                      <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] opacity-40 mb-4 md:mb-6 block">{t('ui_total_path_weight')}</span>
                      <p className="text-6xl md:text-9xl font-black tracking-tighter leading-none px-2">{data.total_estimate}</p>
                  </motion.div>

                  <div className="grid gap-4 md:gap-6 px-2">
                      {data.breakdown?.map((item: any, i: number) => (
                          <NaturalCard key={i} color={currentVisual.accent} delay={i * 0.1}>
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                  <div className="flex items-center gap-4 md:gap-8 min-w-0">
                                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-none bg-zinc-50 flex items-center justify-center text-zinc-300 font-black text-lg md:text-xl border shrink-0">
                                          {i + 1}
                                      </div>
                                      <div className="space-y-1 min-w-0">
                                          <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-800">{item.category}</h4>
                                          <p className="text-xs md:text-sm font-bold text-zinc-400 italic">{item.description}</p>
                                      </div>
                                  </div>
                                  <div className="text-left sm:text-right space-y-1 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0">
                                      <span className="text-3xl md:text-4xl font-black tracking-tighter block" style={{ color: currentVisual.accent }}>{item.cost}</span>
                                      <div className="hidden sm:block h-1 bg-zinc-50 rounded-none w-full" />
                                  </div>
                              </div>
                          </NaturalCard>
                      ))}
                  </div>

                  <div className="mx-2 p-8 md:p-10 rounded-none border border-zinc-100 bg-white/50 backdrop-blur-md space-y-6 overflow-hidden">
                      <div className="flex items-center gap-3 md:gap-4 text-zinc-400 min-w-0">
                          <Zap className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{t('ui_nomadic_wisdom_saving')}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                          {data.money_saving_tips?.map((tip: string, idx: number) => (
                              <div key={idx} className="p-4 bg-white/50 rounded-none border border-white flex items-start gap-4 min-w-0">
                                  <CheckCircle className="w-4 h-4 text-zinc-300 mt-1 shrink-0" />
                                  <p className="text-[10px] md:text-xs font-bold text-zinc-600 leading-relaxed uppercase tracking-tight">{tip}</p>
                              </div>
                          ))}
                      </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 mx-2"
                  >
                      <button 
                          onClick={() => saveBudgetToTrip(data)}
                          disabled={isSaving}
                          className="px-10 py-4 font-black uppercase tracking-[0.2em] text-[10px] text-white hover:scale-105 active:scale-95 transition-all flex items-center gap-3 rounded-none shadow-xl"
                          style={{ backgroundColor: currentVisual.accent }}
                      >
                          <Save className="w-4 h-4" /> {isSaving ? t('saving') : t('ai_save_to_planner')}
                      </button>
                      {onNavigate && (
                          <button 
                              onClick={() => onNavigate('planner')}
                              className="px-8 py-4 border-2 border-zinc-200 text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-100 transition-all flex items-center gap-3 rounded-none"
                          >
                              <ArrowRight className="w-4 h-4" /> {t('ai_open_planner')}
                          </button>
                      )}
                  </motion.div>
              </div>
          );

          return <div className="prose prose-lg max-w-none text-zinc-800 font-bold leading-relaxed"><SafeMarkdown>{toolResult}</SafeMarkdown></div>;
  };

  return (
    <div className="relative h-screen flex flex-col font-sans overflow-hidden" style={{ backgroundColor: theme.background, color: theme.text }}>
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50 transition-all duration-1000">
          <ResponsiveImage src={currentVisual.image} className="w-full h-full object-cover brightness-105" priority />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 0%, ${theme.background} 95%)` }} />
      </div>

      <header className="relative z-20 px-5 pr-16 md:px-8 py-4 md:py-6 flex justify-between items-center border-b border-zinc-200 bg-white/70 backdrop-blur-2xl shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
              <div className="w-3 h-3 rounded-none" style={{ backgroundColor: currentVisual.accent }} />
              <h1 className="text-base md:text-xl font-black uppercase tracking-tighter text-zinc-800">{t('ui_ai_guide_header')}</h1>
          </div>
          <div className="flex items-center gap-2">
              <div className="flex lg:hidden border border-zinc-200 overflow-hidden">
                  <button 
                      onClick={() => setMobileView('chat')}
                      className={`px-3 py-2 text-[9px] font-black uppercase tracking-wider transition-all ${mobileView === 'chat' ? 'text-white' : 'text-zinc-400 bg-white'}`}
                      style={mobileView === 'chat' ? { backgroundColor: currentVisual.accent } : {}}
                  >
                      {t('ui_curator') || 'Chat'}
                  </button>
                  <button 
                      onClick={() => setMobileView('tools')}
                      className={`px-3 py-2 text-[9px] font-black uppercase tracking-wider transition-all ${mobileView === 'tools' ? 'text-white' : 'text-zinc-400 bg-white'}`}
                      style={mobileView === 'tools' ? { backgroundColor: currentVisual.accent } : {}}
                  >
                      {t('ui_rituals') || 'Tools'}
                  </button>
              </div>
              <button onClick={() => window.location.reload()} className="p-2 md:p-3 hover:bg-zinc-100 rounded-none transition-all group">
                  <RefreshCw className="w-4 h-4 text-zinc-400 group-hover:rotate-180 transition-transform duration-700" />
              </button>
          </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        <div className={`flex-1 flex flex-col border-r border-zinc-100 min-w-0 ${mobileView !== 'chat' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="flex-1 overflow-y-auto no-scrollbar p-5 md:p-12 space-y-6 md:space-y-10">
                <AnimatePresence mode="popLayout">
                    {messages.map((msg, idx) => (
                        <motion.div key={msg.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-start w-full">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-zinc-400">
                                {msg.sender === 'user' ? t('ui_traveler') : t('ui_curator')}
                            </span>
                            <div className={`p-5 md:p-8 rounded-none text-base md:text-2xl leading-snug tracking-tighter shadow-sm border-2 max-w-[95%] ${
                                msg.sender === 'user' ? 'bg-zinc-50 font-black' : 'bg-white/80 backdrop-blur-md font-bold'
                            }`} style={{ borderColor: `${currentVisual.accent}20` }}>
                                <div className="prose prose-lg max-w-none text-zinc-800 font-inherit">
                                <SafeMarkdown 
                                    components={{
                                        p: ({node, ...props}) => <p {...props} className="mb-4 last:mb-0 leading-relaxed" />,
                                        h1: ({node, ...props}) => <h1 {...props} className="text-3xl font-black mb-4 mt-6 uppercase tracking-tight" />,
                                        h2: ({node, ...props}) => <h2 {...props} className="text-2xl font-black mb-3 mt-5 uppercase tracking-tight" />,
                                        h3: ({node, ...props}) => <h3 {...props} className="text-xl font-black mb-2 mt-4 uppercase tracking-tight" />,
                                        ul: ({node, ...props}) => <ul {...props} className="list-disc pl-6 mb-4 space-y-2 marker:text-zinc-400 opacity-90" />,
                                        ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-6 mb-4 space-y-2 marker:text-zinc-400 font-bold opacity-90" />,
                                        li: ({node, ...props}) => <li {...props} className="pl-2" />,
                                        strong: ({node, ...props}) => <strong {...props} className="font-black text-zinc-900" />,
                                        a: ({node, ...props}) => <a {...props} className="underline decoration-2 underline-offset-4 decoration-zinc-300 hover:decoration-zinc-800 transition-all text-zinc-900 font-bold" />,
                                        blockquote: ({node, ...props}) => <blockquote {...props} className="border-l-4 border-zinc-200 pl-6 py-2 my-6 italic text-zinc-500 bg-zinc-50/50 rounded-r-none" />,
                                        table: ({node, ...props}) => <div className="overflow-x-auto my-6 rounded-none border border-zinc-100 shadow-sm"><table {...props} className="w-full text-left text-sm md:text-base border-collapse" /></div>,
                                        thead: ({node, ...props}) => <thead {...props} className="bg-zinc-50 border-b border-zinc-100" />,
                                        th: ({node, ...props}) => <th {...props} className="px-6 py-4 font-black uppercase tracking-wider text-zinc-500 text-xs md:text-xs" />,
                                        td: ({node, ...props}) => <td {...props} className="px-6 py-4 border-b border-zinc-50 text-zinc-700 font-bold" />,
                                    }}
                                >
                                    {msg.text}
                                </SafeMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isTyping && <UniqueThinkingAnimation color={currentVisual.accent} label={t('ui_thinking')} />}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 md:p-10 bg-white/80 backdrop-blur-3xl border-t border-zinc-100">
                <div className="relative max-w-4xl mx-auto flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={t('ai_speak_placeholder')}
                      className="w-full bg-zinc-50 text-base md:text-2xl font-bold outline-none py-4 md:py-6 px-5 md:px-10 rounded-none pr-16 md:pr-24 border-2 transition-all placeholder:text-zinc-400 text-zinc-700"
                      style={{ borderColor: `${currentVisual.accent}10` }}
                    />
                    <button 
                      onClick={() => handleSend()} 
                      disabled={!input.trim()} 
                      className="absolute right-2 md:right-4 p-3 md:p-5 rounded-none transition-all disabled:opacity-5 hover:scale-110 active:scale-90"
                      style={{ color: currentVisual.accent }}
                    >
                      <Send className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                </div>
            </div>
        </div>

        <div className={`w-full lg:w-[420px] bg-zinc-50/20 backdrop-blur-xl flex flex-col shrink-0 ${mobileView !== 'tools' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-5 md:p-8 border-b border-zinc-100 bg-white/40">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">{t('ui_rituals')}</span>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 space-y-3 md:space-y-4">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => { setActiveTool(tool); setMobileView('chat'); }}
                        className="w-full group flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-none transition-all text-left border-2 shadow-sm bg-white/90 hover:scale-[1.02]"
                        style={{ borderColor: `${currentVisual.accent}20` }}
                    >
                        <div className="p-2 md:p-3 rounded-none transition-all" style={{ backgroundColor: `${currentVisual.accent}10`, color: currentVisual.accent }}>
                            <tool.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-black uppercase tracking-tight text-zinc-800 mb-1">{tool.label}</h4>
                            <p className="text-[10px] font-bold leading-tight text-zinc-500 line-clamp-2">{tool.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-200 group-hover:text-zinc-400 transition-all shrink-0" />
                    </button>
                ))}
            </div>
        </div>
      </main>

      <AnimatePresence>
          {activeTool && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12">
                  <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md" onClick={() => setActiveTool(null)} />
                  <motion.div 
                    initial={{ scale: 0.95, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 40 }} 
                    className="relative w-full md:max-w-6xl h-full md:h-[85vh] bg-white rounded-none shadow-2xl flex flex-col overflow-hidden border-0 md:border-4"
                    style={{ borderColor: `${currentVisual.accent}10` }}
                  >
                      <header className="p-5 md:p-10 border-b border-zinc-100 flex justify-between items-center bg-white shrink-0">
                          <div className="flex items-center gap-4 md:gap-6">
                                <div className="p-3 md:p-4 rounded-none text-white" style={{ backgroundColor: currentVisual.accent }}><activeTool.icon className="w-5 h-5 md:w-7 md:h-7" /></div>
                                <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter text-zinc-800">{activeTool.label}</h2>
                          </div>
                          <button onClick={() => setActiveTool(null)} className="p-2 md:p-3 hover:bg-zinc-50 rounded-none"><X className="w-6 h-6 md:w-8 md:h-8 text-zinc-400" /></button>
                      </header>

                      <div className="flex-1 overflow-y-auto no-scrollbar p-5 md:p-16">
                          {isToolLoading ? (
                              <div className="h-full flex items-center justify-center">
                                  <UniqueThinkingAnimation color={currentVisual.accent} />
                              </div>
                          ) : !toolResult ? (
                              <div className="max-w-2xl mx-auto space-y-8 md:space-y-12">
                                  <p className="text-lg md:text-2xl font-black text-zinc-300 leading-tight italic">"{activeTool.description}"</p>
                                  <div className="space-y-6 md:space-y-10">
                                      {activeTool.fields.map((field) => (
                                          <div key={field.id} className="space-y-3">
                                              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">{field.label}</label>
                                              {field.type === 'select' ? (
                                                  <select 
                                                      value={toolValues[field.id] || ''} 
                                                      onChange={(e) => setToolValues(prev => ({ ...prev, [field.id]: e.target.value }))} 
                                                      className="w-full bg-zinc-50 border-2 md:border-4 p-4 md:p-6 rounded-none text-base md:text-xl font-black outline-none text-zinc-700"
                                                      style={{ borderColor: `${currentVisual.accent}10` }}
                                                  >
                                                      <option value="" disabled>{field.placeholder}</option>
                                                      {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                  </select>
                                              ) : (
                                                  <input 
                                                      type={field.type || 'text'} placeholder={field.placeholder} value={toolValues[field.id] || ''} 
                                                      onChange={(e) => setToolValues(prev => ({ ...prev, [field.id]: e.target.value }))} 
                                                      className="w-full bg-zinc-50 border-2 md:border-4 p-4 md:p-6 rounded-none text-base md:text-xl font-black outline-none text-zinc-700 placeholder:text-zinc-200" 
                                                      style={{ borderColor: `${currentVisual.accent}10` }}
                                                  />
                                              )}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          ) : renderToolResult()}
                      </div>

                      <footer className="p-5 md:p-10 border-t border-zinc-100 flex flex-wrap gap-3 md:gap-4 justify-end bg-white shrink-0">
                          {toolResult && <button onClick={() => setToolResult(null)} className="px-6 md:px-8 py-3 md:py-4 border-2 rounded-none text-[10px] font-black uppercase text-zinc-400" style={{ borderColor: `${currentVisual.accent}20` }}>{t('ui_back')}</button>}
                          <button 
                            onClick={executeTool} disabled={isToolLoading || activeTool.fields.some(f => !toolValues[f.id])} 
                            className="px-6 md:px-10 py-3 md:py-4 text-white rounded-none text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                            style={{ backgroundColor: currentVisual.accent }}
                          >
                              {isToolLoading ? t('ui_syncing_path') : toolResult ? t('ui_update_analysis') : t('ui_process_request')}
                          </button>
                      </footer>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .font-inherit { font-family: inherit; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};