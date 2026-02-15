import React, { useState, useEffect } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useTrip } from '../../contexts/TripContext';
import { 
    Calendar, Clock, DollarSign, X, Trash2, 
    ChevronDown, RefreshCw, GripVertical,
    Sun, Moon, Sunrise, Tent, MapPin, 
    ArrowRight, Plus, Save, Feather, Zap, Compass, Wind, Mountain, Square, Play
} from '../ui/icons';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Typewriter } from '../ui/Typewriter';
import { Trip, ItineraryItem } from './plannerTypes';
import { getHomeHeroUrl } from '../../utils/imageUrls';

import { TripRouteFlyover } from '../map/TripRouteFlyover';

export const TripPlannerPage = () => {
  const { theme, season } = useSeason();
  const { language, t } = useLanguage();
  const { notify } = useNotification();
  
  // Use Trip Context
  const { 
      itinerary, setItinerary, 
      tripTitle, setTripTitle,
      destination, setDestination,
      dayCount, setDayCount,
      savedTrips, loadTrip, createNewTrip,
      saveCurrentTrip, deleteTrip, isLoading,
      refreshTrips
  } = useTrip();

  // UI State
  const [showTripSelector, setShowTripSelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [showFlyover, setShowFlyover] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ItineraryItem | null>(null);
  
  const [newActivity, setNewActivity] = useState<Partial<ItineraryItem>>({
    time: '12:00',
    type: 'activity',
    cost: 0,
    activity: '',
    location: '',
    notes: ''
  });

  // AI State
  const [aiState, setAiState] = useState<'idle' | 'active' | 'complete'>('idle');
  const [aiMessage, setAiMessage] = useState('');

  const SEASONAL_HERO: Record<string, string> = {
    winter: getHomeHeroUrl('winter'),
    spring: getHomeHeroUrl('spring'),
    summer: getHomeHeroUrl('summer'),
    autumn: getHomeHeroUrl('autumn'),
  };

  const currentHero = season ? SEASONAL_HERO[season] : SEASONAL_HERO.summer;

  useEffect(() => {
    if (!tripTitle) {
        setTripTitle(t('trip_name_placeholder'));
    }
  }, [language]);

  // Refresh saved trips on mount to ensure they are up-to-date
  useEffect(() => {
    refreshTrips();
  }, []);

  // Auto-launch flyover when navigated from AI Assistant with the flag
  useEffect(() => {
    const shouldFly = sessionStorage.getItem('kendala_launch_flyover');
    if (shouldFly === 'true') {
      sessionStorage.removeItem('kendala_launch_flyover');
      // Launch immediately — the flyover component handles its own loading phase
      setShowFlyover(true);
    }
  }, []);

  // Fallback: if itinerary wasn't ready when flag was checked, watch for it
  useEffect(() => {
    const pending = sessionStorage.getItem('kendala_launch_flyover_pending');
    if (pending === 'true' && itinerary.length > 0) {
      sessionStorage.removeItem('kendala_launch_flyover_pending');
      setShowFlyover(true);
    }
  }, [itinerary]);

  const handleSwitchTrip = (trip: Trip) => {
    loadTrip(trip);
    setSelectedDay(1);
    setShowTripSelector(false);
    notify(`${t('trip_switched')}: ${trip.destination || trip.title}`, "success");
  };

  const handleCreateNewTrip = () => {
    createNewTrip();
    setSelectedDay(1);
    notify(t('new_trip_created'), "action");
  };

  const handleSaveItinerary = async () => {
    if (!tripTitle.trim()) {
        notify(t('enter_trip_name') || 'Enter trip name', "warning");
        return;
    }
    await saveCurrentTrip();
  };

  const handleAutoGenerate = async () => {
    if (!destination) {
        notify(t('enter_destination_first') || "Enter destination first", "warning");
        return;
    }
    
    setAiState('active');
    
    // Helper to pause
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Step 1: Analysis
    setAiMessage(`Analyzing travel patterns for ${destination}...`);
    await wait(2500);

    // Step 2: Search
    setAiMessage(`Finding top-rated local experiences and dining spots...`);
    await wait(2500);

    // Step 3: Construction
    setAiMessage(`Constructing your personalized ${season || 'journey'} itinerary...`);
    await wait(2500);

    // Mock AI generation
    const newItems: ItineraryItem[] = [
        {
            id: crypto.randomUUID(),
            day: selectedDay,
            time: '09:00',
            activity: `Visit ${destination} Main Square`,
            type: 'activity',
            cost: 0,
            location: `${destination} City Center`,
            notes: 'Morning sightseeing and photography'
        },
        {
            id: crypto.randomUUID(),
            day: selectedDay,
            time: '13:00',
            activity: 'Traditional Lunch',
            type: 'food',
            cost: 25,
            location: `${destination} Bazaar`,
            notes: 'Try Beshbarmak and local tea'
        },
        {
            id: crypto.randomUUID(),
            day: selectedDay,
            time: '16:00',
            activity: 'Museum Tour',
            type: 'activity',
            cost: 15,
            location: `${destination} History Museum`,
            notes: 'Learn about local culture'
        }
    ];
    
    setItinerary(prev => [...prev, ...newItems]);
    setAiState('complete');
    notify("Itinerary updated!", "success");
    
    // Close after a moment
    await wait(1500);
    setAiState('idle');
  };

  const handleDeleteTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t('delete_trip_confirm'))) return;
    
    const success = await deleteTrip(id);
    if (success) {
        notify(t('trip_deleted'), "warning");
    } else {
        notify(t('failed_delete') || 'Failed to delete', "error");
    }
  };

  if (!theme) return null;

  const totalCost = itinerary.reduce((sum, item) => sum + item.cost, 0);
  
  // Create array of days based on dayCount
  const days = Array.from({ length: Math.max(dayCount, 1) }, (_, i) => i + 1);

  const dayItems = itinerary.filter(item => item.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time));

  const handleAddDay = () => {
    const nextDay = dayCount + 1;
    setDayCount(nextDay);
    setSelectedDay(nextDay);
    notify(`${t('day')} ${nextDay}`, "info");
  };

  const handleRemoveItem = (id: string) => {
    setItinerary(prev => prev.filter(item => item.id !== id));
  };

  const handleEditActivity = (item: ItineraryItem) => {
    setEditingActivity(item);
    setNewActivity({
      time: item.time,
      type: item.type,
      cost: item.cost,
      activity: item.activity,
      location: item.location,
      notes: item.notes
    });
    setIsAddingActivity(true);
  };

  const submitNewActivity = () => {
    if (!newActivity.activity || !newActivity.location) return;
    
    if (editingActivity) {
      setItinerary(prev => prev.map(item => 
        item.id === editingActivity.id 
          ? {
              ...item,
              time: newActivity.time || '12:00',
              activity: newActivity.activity || '',
              type: newActivity.type as any || 'activity',
              cost: Number(newActivity.cost) || 0,
              location: newActivity.location || '',
              notes: newActivity.notes || ''
            }
          : item
      ));
      setEditingActivity(null);
    } else {
      setItinerary(prev => [...prev, {
          id: crypto.randomUUID(),
          day: selectedDay,
          time: newActivity.time || '12:00',
          activity: newActivity.activity || '',
          type: newActivity.type as any || 'activity',
          cost: Number(newActivity.cost) || 0,
          location: newActivity.location || '',
          notes: newActivity.notes || ''
      }]);
    }
    
    setIsAddingActivity(false);
    setNewActivity({ time: '12:00', type: 'activity', cost: 0, activity: '', location: '', notes: '' });
  };

  const handleReorderItems = (newOrder: ItineraryItem[]) => {
    const otherDayItems = itinerary.filter(item => item.day !== selectedDay);
    setItinerary([...otherDayItems, ...newOrder]);
  };

  const typeLabels = {
      travel: t('activity_type_travel'),
      stay: t('activity_type_stay'),
      activity: t('activity_type_activity'),
      food: t('activity_type_food')
  };

  return (
    <div className="min-h-screen font-sans relative flex flex-col bg-neutral-50" style={{ background: theme.background, color: theme.text }}>
      
      {/* --- HERO HEADER --- */}
      <div className="relative z-10 h-[40vh] md:h-[45vh] min-h-[320px] md:min-h-[450px] w-full border-b" style={{ borderColor: `${theme.text}20` }}>
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
                className="absolute inset-0 overflow-hidden"
            >
                <ImageWithFallback 
                    src={currentHero} 
                    className="w-full h-full object-cover" 
                    alt="Trip Planner Hero"
                />
            </motion.div>
            
            <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
          </div>
          
          <div className="absolute inset-0 p-5 md:p-16 flex flex-col justify-end text-white z-10">
               <div className="max-w-[1920px] w-full mx-auto space-y-4 md:space-y-8">
                   <div className="flex flex-col gap-4 md:gap-8 justify-between border-b border-white/20 pb-4 md:pb-8">
                       <div className="space-y-3 md:space-y-4 flex-1">
                           <div className="flex items-center gap-3 md:gap-4 opacity-80">
                               <MapPin className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                               <input 
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder={t('ph_destination')}
                                    className="bg-transparent text-sm md:text-lg font-black uppercase tracking-[0.1em] md:tracking-[0.2em] outline-none placeholder:text-white/30 w-full md:w-96"
                                    style={{ borderBottom: '2px solid rgba(255,255,255,0.3)' }}
                               />
                           </div>
                           
                           <div className="relative group">
                               <input 
                                    value={tripTitle}
                                    onChange={(e) => setTripTitle(e.target.value)}
                                    placeholder={t('trip_name_placeholder')}
                                    className="w-full bg-transparent text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter outline-none placeholder:text-white/20 leading-[0.85]"
                               />
                               <Feather className="absolute top-1/2 -translate-y-1/2 -right-8 opacity-0 group-hover:opacity-50 transition-opacity w-6 h-6 hidden md:block" />
                           </div>
                       </div>

                       <div className="flex items-center gap-6 md:gap-12">
                            <div>
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-60 block mb-1">{t('total_budget')}</span>
                                <span className="text-xl md:text-3xl font-mono font-bold">${totalCost}</span>
                            </div>
                            <div>
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-60 block mb-1">{t('field_duration')}</span>
                                <span className="text-xl md:text-3xl font-mono font-bold">{days.length} {t('day')}</span>
                            </div>
                       </div>
                   </div>

                   <div className="flex items-center pt-1 md:pt-2 relative">
                        {/* Connected button bar */}
                        <div className="flex items-stretch w-full border border-white/20 backdrop-blur-md shadow-xl">
                            {/* Saved Trips */}
                            <div className="relative">
                                <button 
                                    onClick={() => { setShowTripSelector(!showTripSelector); if (!showTripSelector) refreshTrips(); }} 
                                    className="h-full px-3 md:px-5 py-2.5 md:py-3 bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest border-r border-white/20"
                                >
                                    <span className="hidden sm:inline">{t('saved_trips')}</span>
                                    <span className="sm:hidden">{t('saved_trips').split(' ')[0]}</span>
                                    {savedTrips.length > 0 && <span className="bg-white/25 px-1.5 py-0.5 text-[9px] font-mono">{savedTrips.length}</span>}
                                    <ChevronDown className={`w-3 h-3 transition-transform ${showTripSelector ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {showTripSelector && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 mt-2 w-72 md:w-80 max-h-[50vh] overflow-y-auto bg-black/95 backdrop-blur-md text-white border border-white/20 shadow-2xl z-[60]">
                                            {isLoading ? (
                                                <div className="p-4 text-center text-xs opacity-50 uppercase tracking-widest animate-pulse">{t('loading') || 'Loading...'}</div>
                                            ) : savedTrips.length === 0 ? (
                                                <div className="p-4 text-center text-xs opacity-50 uppercase tracking-widest">{t('no_trips')}</div>
                                            ) : (
                                                savedTrips.map(trip => (
                                                    <button key={trip.id} onClick={() => handleSwitchTrip(trip)} className="w-full text-left p-4 hover:bg-white/10 flex justify-between items-center group border-b border-white/10 last:border-0 transition-colors">
                                                        <div className="flex-1 min-w-0 mr-3">
                                                            <span className="text-xs font-bold uppercase truncate tracking-wider block">{trip.title || 'Untitled Trip'}</span>
                                                            {trip.destination && <span className="text-[10px] opacity-40 block mt-0.5 truncate">{trip.destination}</span>}
                                                        </div>
                                                        <Trash2 onClick={(e) => handleDeleteTrip(trip.id, e)} className="w-3 h-3 flex-shrink-0 opacity-20 group-hover:opacity-100 hover:text-red-500 transition-all" />
                                                    </button>
                                                ))
                                            )}
                                            <button onClick={handleCreateNewTrip} className="w-full p-4 text-center text-xs font-black uppercase tracking-widest bg-white/5 hover:bg-white/20 text-blue-400">
                                                {t('create_new_trip')}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Magic Plan */}
                            <button 
                                onClick={handleAutoGenerate}
                                className="px-3 md:px-5 py-2.5 md:py-3 bg-white/5 text-amber-400 hover:bg-white/10 transition-all flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest border-r border-white/20"
                                title={t('planner_auto_generate')}
                            >
                                <Zap className="w-3.5 h-3.5" />
                                <span className="hidden lg:inline">{t('planner_magic')}</span>
                            </button>

                            {/* Play Route */}
                            <button 
                                onClick={() => setShowFlyover(true)}
                                className="px-3 md:px-6 py-2.5 md:py-3 bg-[#D4AF37] text-white hover:bg-[#E5C048] transition-all flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest border-r border-[#D4AF37]/50"
                            >
                                <Play className="w-4 h-4" />
                                <span className="hidden md:inline">{t('planner_route')}</span>
                            </button>

                            {/* Save */}
                            <button 
                                onClick={handleSaveItinerary} 
                                disabled={isLoading}
                                className="px-3 md:px-6 py-2.5 md:py-3 bg-white text-black hover:bg-neutral-200 transition-all flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest ml-auto disabled:opacity-50"
                            >
                                {isLoading ? t('saving') : t('save_trip')} <Save className="w-3.5 h-3.5" />
                            </button>
                        </div>
                   </div>
               </div>
          </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-col lg:flex-row flex-1 max-w-[1920px] w-full mx-auto relative z-[5]">
          
          {/* LEFT: DAYS NAVIGATION */}
          <div className="lg:w-80 flex-shrink-0 border-b lg:border-b-0 lg:border-r" style={{ borderColor: `${theme.text}10` }}>
              <div className="lg:sticky lg:top-0 h-full lg:max-h-screen overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto pt-2 px-4 pb-4 lg:pt-4 lg:px-8 lg:pb-8 space-y-3 lg:space-y-5">
                  <div className="flex items-center justify-between mb-1 lg:mb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-50">{t('timeline')}</h3>
                    <button onClick={handleAddDay} className="p-2 border border-current hover:bg-current hover:text-white transition-all rounded-none">
                        <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-x-visible no-scrollbar pb-2 lg:pb-0">
                      {days.map(day => (
                          <button 
                            key={day} 
                            onClick={() => setSelectedDay(day)}
                            className={`shrink-0 lg:w-full p-3 lg:p-5 text-left transition-all relative group border-b-4 lg:border-b-0 lg:border-l-4 min-w-[80px] lg:min-w-0 ${
                                selectedDay === day 
                                    ? 'border-black' 
                                    : 'border-transparent'
                            }`}
                            style={selectedDay === day 
                                ? { borderColor: theme.primary, backgroundColor: `${theme.text}08` } 
                                : {}
                            }
                            onMouseEnter={(e) => { if (selectedDay !== day) e.currentTarget.style.backgroundColor = `${theme.text}05`; }}
                            onMouseLeave={(e) => { if (selectedDay !== day) e.currentTarget.style.backgroundColor = ''; }}
                          >
                              <div className="flex lg:flex-row justify-between items-center lg:items-end relative z-10 gap-2">
                                  <div>
                                      <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.3em] opacity-40 block mb-0.5 lg:mb-1">{t('day')}</span>
                                      <span className="text-xl lg:text-3xl font-black leading-none">{day < 10 ? `0${day}` : day}</span>
                                  </div>
                                  <div className="text-[9px] lg:text-[10px] font-bold opacity-40 hidden lg:block">
                                      {itinerary.filter(i => i.day === day).length} Events
                                  </div>
                              </div>
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          {/* RIGHT: TIMELINE */}
          <div className="flex-1 min-h-[400px] lg:min-h-[600px] flex flex-col" style={{ backgroundColor: theme.background }}>
                {/* Header */}
                <div className="p-5 pr-16 md:p-12 border-b flex justify-between items-center sticky top-0 z-30 backdrop-blur-md" style={{ borderColor: `${theme.text}10`, backgroundColor: `${theme.background}cc` }}>
                    <div>
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-40 block mb-1 md:mb-2">{t('itinerary')}</span>
                        <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter leading-none">{t('phase_label')} {selectedDay < 10 ? `0${selectedDay}` : selectedDay}</h2>
                    </div>
                    <button 
                        onClick={() => { setEditingActivity(null); setIsAddingActivity(true); }}
                        className="px-4 md:px-8 py-3 md:py-4 bg-black text-white rounded-none text-[10px] md:text-xs font-black uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-neutral-800 transition-colors shadow-lg flex items-center gap-2 md:gap-3"
                        style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                    >
                        <Plus className="w-4 h-4" /> <span className="hidden md:inline">{t('add_activity')}</span>
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 p-4 md:p-16 relative">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[2.5rem] md:left-[5.25rem] top-0 bottom-0 w-px bg-current opacity-10" />

                    {dayItems.length === 0 ? (
                        <div className="py-20 md:py-32 flex flex-col items-center justify-center opacity-20 space-y-4 md:space-y-6">
                            <Wind className="w-16 h-16 md:w-24 md:h-24 stroke-1" />
                            <span className="text-xs md:text-sm font-black uppercase tracking-[0.3em] md:tracking-[0.5em]">{t('timeline_empty')}</span>
                        </div>
                    ) : (
                        <Reorder.Group axis="y" values={dayItems} onReorder={handleReorderItems} className="space-y-8 md:space-y-12">
                            {dayItems.map((item) => (
                                <Reorder.Item key={item.id} value={item} className="relative pl-14 md:pl-32 group">
                                    {/* Time Marker */}
                                    <div className="absolute left-0 w-12 md:w-24 text-right pr-3 md:pr-8 pt-1">
                                        <span className="text-[10px] md:text-xs font-black opacity-100 block font-mono">{item.time}</span>
                                    </div>
                                    
                                    {/* Square Dot */}
                                    <div className="absolute left-[2.25rem] md:left-[5rem] top-1.5 -translate-x-1/2 w-2.5 h-2.5 md:w-3 md:h-3 bg-white border-2 border-black z-10 transition-transform group-hover:scale-125 rounded-none rotate-45" style={{ borderColor: theme.primary }} />

                                    {/* Card */}
                                    <div className="bg-white border hover:border-black/30 p-8 transition-all duration-300 group cursor-move relative overflow-hidden rounded-none shadow-sm hover:shadow-2xl" 
                                        style={{ borderColor: `${theme.text}15`, backgroundColor: theme.cardBg }}
                                    >
                                        <div className="flex justify-between items-start mb-4 md:mb-6 relative z-10">
                                            <div className="flex items-center gap-4">
                                                <GripVertical className="w-4 h-4 opacity-10 cursor-grab active:cursor-grabbing hover:opacity-100 transition-opacity" />
                                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 border ${getTypeColor(item.type)}`}>
                                                    {typeLabels[item.type]}
                                                </span>
                                            </div>
                                            <div className="flex gap-1 md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditActivity(item)} className="p-2 hover:bg-black/5 rounded-none"><Feather className="w-4 h-4" /></button>
                                                <button onClick={() => handleRemoveItem(item.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-none"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        
                                        <div className="grid md:grid-cols-[1fr,auto] gap-4 md:gap-8 relative z-10">
                                            <div>
                                                <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight mb-2 md:mb-4 leading-none">{item.activity}</h3>
                                                <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[10px] md:text-xs font-bold opacity-60 font-mono uppercase">
                                                    <span className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {item.location}</span>
                                                    <span className="flex items-center gap-2"><DollarSign className="w-3 h-3" /> {item.cost}</span>
                                                </div>
                                                {item.notes && <p className="mt-4 md:mt-6 text-xs md:text-sm font-medium opacity-60 leading-relaxed border-l-2 border-black/10 pl-3 md:pl-4 font-mono">{item.notes}</p>}
                                            </div>
                                            
                                            {item.image && (
                                                <div className="w-full md:w-40 aspect-square overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                                    <ImageWithFallback src={item.image} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    )}
                </div>
          </div>
      </div>

      {/* --- AI ASSISTANT OVERLAY --- */}
      <AnimatePresence>
        {aiState === 'active' && (
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-8 right-4 md:bottom-12 md:right-12 z-[100] max-w-[90vw] w-[400px]"
            >
                <div className="bg-[#111] border border-white/10 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                    {/* Glowing effect */}
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/20 blur-[50px] rounded-full group-hover:bg-amber-500/30 transition-all" />
                    
                    <div className="relative z-10 flex items-start gap-5">
                        <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shrink-0">
                            <Zap className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        
                        <div className="flex-1 min-h-[60px] flex flex-col justify-center">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-2 flex items-center gap-2">
                                Kendala AI <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                            </h4>
                            <div className="text-sm font-bold text-white/90 font-mono leading-relaxed">
                                <Typewriter key={aiMessage} text={aiMessage} speed={25} />
                            </div>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <motion.div 
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 7.5, ease: "linear" }}
                    />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- ADD ACTIVITY MODAL --- */}
      <AnimatePresence>
        {isAddingActivity && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12 overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    onClick={() => setIsAddingActivity(false)}
                />

                <motion.div 
                    initial={{ opacity: 0, x: '100%' }} 
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }} 
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl flex flex-col z-50 border-l border-white/10"
                    style={{ backgroundColor: theme.background, color: theme.text }}
                >
                    <div className="p-8 border-b flex justify-between items-center" style={{ borderColor: `${theme.text}10` }}>
                        <h3 className="text-2xl font-black uppercase tracking-tight">{editingActivity ? t('edit_activity') : t('add_activity')}</h3>
                        <button onClick={() => { setIsAddingActivity(false); setEditingActivity(null); }} className="p-4 hover:bg-red-600 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                    </div>
                    
                    <div className="p-8 space-y-8 overflow-y-auto flex-1">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('activity_name')}</label>
                            <input 
                                value={newActivity.activity} 
                                onChange={e => setNewActivity({...newActivity, activity: e.target.value})} 
                                className="w-full bg-transparent border-b-2 py-3 text-xl font-bold uppercase tracking-wide outline-none transition-colors rounded-none" 
                                style={{ borderColor: `${theme.text}20` }}
                                placeholder={t('ph_activity') || "MOUNTAIN HIKING"}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('activity_time')}</label>
                                <input 
                                    type="time" 
                                    value={newActivity.time} 
                                    onChange={e => setNewActivity({...newActivity, time: e.target.value})} 
                                    className="w-full bg-transparent border-b-2 py-3 text-xl font-mono font-bold outline-none rounded-none"
                                    style={{ borderColor: `${theme.text}20` }}
                                />
                             </div>
                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('activity_cost')}</label>
                                <input 
                                    type="number" 
                                    value={newActivity.cost} 
                                    onChange={e => setNewActivity({...newActivity, cost: Number(e.target.value)})} 
                                    className="w-full bg-transparent border-b-2 py-3 text-xl font-mono font-bold outline-none rounded-none"
                                    style={{ borderColor: `${theme.text}20` }}
                                />
                             </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('field_type')}</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(typeLabels).map(([key, label]) => (
                                    <button 
                                        key={key}
                                        onClick={() => setNewActivity({...newActivity, type: key as any})}
                                        className={`py-4 px-4 text-[10px] font-black uppercase tracking-widest border transition-all rounded-none flex items-center justify-center gap-2 ${newActivity.type === key ? 'bg-black text-white border-black' : 'hover:bg-black/5'}`}
                                        style={newActivity.type === key ? { backgroundColor: theme.primary, borderColor: theme.primary, color: theme.primaryForeground } : { borderColor: `${theme.text}20` }}
                                    >
                                        <div className={`w-2 h-2 rotate-45 ${newActivity.type === key ? 'bg-white' : 'bg-black'}`} />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('activity_location')}</label>
                            <input 
                                value={newActivity.location} 
                                onChange={e => setNewActivity({...newActivity, location: e.target.value})} 
                                className="w-full bg-transparent border-b-2 py-3 text-lg font-bold uppercase outline-none rounded-none"
                                style={{ borderColor: `${theme.text}20` }}
                                placeholder={t('ph_location') || "ALMATY REGION"}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('activity_notes')}</label>
                            <textarea 
                                value={newActivity.notes} 
                                onChange={e => setNewActivity({...newActivity, notes: e.target.value})} 
                                className="w-full bg-black/5 border-none p-4 font-mono text-sm outline-none h-32 resize-none rounded-none"
                                placeholder={t('activity_notes')}
                            />
                        </div>
                    </div>

                    <div className="p-8 border-t" style={{ borderColor: `${theme.text}10` }}>
                        <button 
                            onClick={submitNewActivity}
                            className="w-full py-5 bg-black text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-neutral-800 transition-all rounded-none"
                            style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                        >
                            {editingActivity ? t('save_trip') : t('activity_submit')}
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFlyover && (
            <TripRouteFlyover 
                itinerary={itinerary} 
                onClose={() => setShowFlyover(false)} 
                theme={theme}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper for type colors
function getTypeColor(type: string) {
    switch(type) {
        case 'travel': return 'bg-blue-500/10 text-blue-600 border-blue-200';
        case 'stay': return 'bg-purple-500/10 text-purple-600 border-purple-200';
        case 'food': return 'bg-orange-500/10 text-orange-600 border-orange-200';
        default: return 'bg-green-500/10 text-green-600 border-green-200';
    }
}