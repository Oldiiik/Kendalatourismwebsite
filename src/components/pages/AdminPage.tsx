import React, { useState, useEffect, useCallback } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings, Eye, Trash2, Users, Star, Shield, Activity,
  TrendingUp, X, MapPin, Clock, AlertTriangle, Check,
  ChevronDown, ChevronUp, Search, MessageCircle, Heart,
} from '../ui/icons';
import { PageTransition } from '../ui/PageTransition';
import { toast } from 'sonner@2.0.3';

interface CommunityTrip {
  id: string;
  title: string;
  description?: string;
  authorId: string;
  authorName: string;
  publishedAt: string;
  likes: number;
  views: number;
  destinations?: string[];
  duration?: number;
}

interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
}

interface AdminStats {
  communityTrips: number;
  totalLikes: number;
  totalViews: number;
}

type Tab = 'overview' | 'community' | 'reviews';

export const AdminPage = () => {
  const { theme } = useSeason();
  const { language } = useLanguage();
  const { user } = useAuth();

  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [communityTrips, setCommunityTrips] = useState<CommunityTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'views'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Review management state
  const [reviewTargetType, setReviewTargetType] = useState('place');
  const [reviewTargetId, setReviewTargetId] = useState('');
  const [fetchedReviews, setFetchedReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const labels: Record<string, Record<string, string>> = {
    en: {
      title: 'Command Center',
      subtitle: 'Admin Panel',
      overview: 'Overview',
      community: 'Community Trips',
      reviews: 'Review Moderation',
      totalTrips: 'Published Trips',
      totalLikes: 'Total Likes',
      totalViews: 'Total Views',
      engagement: 'Engagement Rate',
      noAccess: 'Access Denied',
      noAccessDesc: 'You do not have admin privileges.',
      search: 'Search trips...',
      sortDate: 'Date',
      sortLikes: 'Likes',
      sortViews: 'Views',
      delete: 'Delete',
      confirmDeleteMsg: 'Permanently delete this trip?',
      cancel: 'Cancel',
      confirm: 'Confirm',
      deleted: 'Trip deleted',
      author: 'Author',
      published: 'Published',
      noTrips: 'No community trips yet.',
      reviewType: 'Type',
      reviewTarget: 'Target ID',
      fetchReviews: 'Fetch Reviews',
      noReviews: 'No reviews found.',
      deleteReview: 'Delete Review',
      reviewDeleted: 'Review deleted',
      loadError: 'Failed to load admin data',
    },
    ru: {
      title: 'Командный центр',
      subtitle: 'Панель управления',
      overview: 'Обзор',
      community: 'Маршруты сообщества',
      reviews: 'Модерация отзывов',
      totalTrips: 'Опубликованные маршруты',
      totalLikes: 'Всего лайков',
      totalViews: 'Всего просмотров',
      engagement: 'Вовлеченность',
      noAccess: 'Доступ запрещен',
      noAccessDesc: 'У вас нет прав администратора.',
      search: 'Поиск маршрутов...',
      sortDate: 'Дата',
      sortLikes: 'Лайки',
      sortViews: 'Просмотры',
      delete: 'Удалить',
      confirmDeleteMsg: 'Удалить этот маршрут навсегда?',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      deleted: 'Маршрут удален',
      author: 'Автор',
      published: 'Опубликован',
      noTrips: 'Маршрутов сообщества пока нет.',
      reviewType: 'Тип',
      reviewTarget: 'ID объекта',
      fetchReviews: 'Загрузить отзывы',
      noReviews: 'Отзывов не найдено.',
      deleteReview: 'Удалить отзыв',
      reviewDeleted: 'Отзыв удален',
      loadError: 'Не удалось загрузить данные',
    },
    kz: {
      title: 'Басқару орталығы',
      subtitle: 'Әкімші панелі',
      overview: 'Шолу',
      community: 'Қауымдастық маршруттары',
      reviews: 'Пікірлерді модерациялау',
      totalTrips: 'Жарияланған маршруттар',
      totalLikes: 'Барлық лайктар',
      totalViews: 'Барлық қаралымдар',
      engagement: 'Белсенділік',
      noAccess: 'Рұқсат жоқ',
      noAccessDesc: 'Сізде әкімші құқықтары жоқ.',
      search: 'Маршруттарды іздеу...',
      sortDate: 'Күні',
      sortLikes: 'Лайктар',
      sortViews: 'Қаралымдар',
      delete: 'Жою',
      confirmDeleteMsg: 'Бұл маршрутты біржола жоясыз ба?',
      cancel: 'Болдырмау',
      confirm: 'Растау',
      deleted: 'Маршрут жойылды',
      author: 'Автор',
      published: 'Жарияланған',
      noTrips: 'Қауымдастық маршруттары жоқ.',
      reviewType: 'Түрі',
      reviewTarget: 'Объект ID',
      fetchReviews: 'Пікірлерді жүктеу',
      noReviews: 'Пікірлер табылмады.',
      deleteReview: 'Пікірді жою',
      reviewDeleted: 'Пікір жойылды',
      loadError: 'Деректерді жүктеу сәтсіз',
    },
  };

  const l = labels[language] || labels.en;

  const getHeaders = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return null;
    return {
      'Authorization': `Bearer ${publicAnonKey}`,
      'x-user-token': session.access_token,
      'Content-Type': 'application/json',
    };
  }, []);

  const loadStats = useCallback(async () => {
    const headers = await getHeaders();
    if (!headers) return;
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/admin/stats`,
        { headers }
      );
      if (!res.ok) {
        if (res.status === 403) {
          setError('forbidden');
          return;
        }
        throw new Error(`Stats fetch failed: ${res.status}`);
      }
      const data = await res.json().catch(() => null);
      if (data) setStats(data);
    } catch (e) {
      console.error('Admin stats error:', e);
      setError('load');
    }
  }, [getHeaders]);

  const loadCommunityTrips = useCallback(async () => {
    const headers = await getHeaders();
    if (!headers) return;
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/admin/community-trips`,
        { headers }
      );
      if (!res.ok) return;
      const data = await res.json().catch(() => []);
      setCommunityTrips(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Admin trips error:', e);
    }
  }, [getHeaders]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadStats();
      await loadCommunityTrips();
      setLoading(false);
    };
    if (user) init();
  }, [user, loadStats, loadCommunityTrips]);

  const handleDeleteTrip = async (tripId: string) => {
    setDeletingId(tripId);
    const headers = await getHeaders();
    if (!headers) return;
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/admin/community-trips/${tripId}`,
        { method: 'DELETE', headers }
      );
      if (res.ok) {
        setCommunityTrips(prev => prev.filter(t => t.id !== tripId));
        if (stats) setStats({ ...stats, communityTrips: stats.communityTrips - 1 });
        toast.success(l.deleted);
      }
    } catch (e) {
      console.error('Delete trip error:', e);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleFetchReviews = async () => {
    if (!reviewTargetId.trim()) return;
    setReviewsLoading(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/reviews/${reviewTargetType}/${reviewTargetId}`,
        { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
      );
      if (res.ok) {
        const data = await res.json().catch(() => []);
        setFetchedReviews(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Fetch reviews error:', e);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const headers = await getHeaders();
    if (!headers) return;
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/admin/reviews/${reviewTargetType}/${reviewTargetId}/${reviewId}`,
        { method: 'DELETE', headers }
      );
      if (res.ok) {
        setFetchedReviews(prev => prev.filter(r => r.id !== reviewId));
        toast.success(l.reviewDeleted);
      }
    } catch (e) {
      console.error('Delete review error:', e);
    }
  };

  const filteredTrips = communityTrips
    .filter(trip => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        trip.title?.toLowerCase().includes(q) ||
        trip.authorName?.toLowerCase().includes(q) ||
        trip.description?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let valA: number, valB: number;
      if (sortBy === 'likes') { valA = a.likes || 0; valB = b.likes || 0; }
      else if (sortBy === 'views') { valA = a.views || 0; valB = b.views || 0; }
      else { valA = new Date(a.publishedAt).getTime(); valB = new Date(b.publishedAt).getTime(); }
      return sortDir === 'desc' ? valB - valA : valA - valB;
    });

  if (!theme) return null;

  if (error === 'forbidden') {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center font-sans" style={{ backgroundColor: theme.background, color: theme.text }}>
          <div className="text-center space-y-6 max-w-md px-6">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center border-2" style={{ borderColor: '#EF4444' }}>
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">{l.noAccess}</h1>
            <p className="text-sm opacity-60">{l.noAccessDesc}</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen font-sans" style={{ backgroundColor: theme.background, color: theme.text }}>
        {/* Header */}
        <div className="relative border-b" style={{ borderColor: `${theme.primary}15` }}>
          <div className="px-6 md:px-12 lg:px-16 py-12 md:py-20">
            <div className="flex items-center gap-3 mb-4 opacity-50">
              <Settings className="w-4 h-4" style={{ color: theme.primary }} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">{l.subtitle}</span>
              <div className="h-px w-12 bg-current opacity-20" />
              <Shield className="w-4 h-4 opacity-40" />
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
              {l.title}
            </h1>
            <p className="text-sm opacity-40 font-mono">
              {user?.email || '---'}
            </p>
          </div>

          {/* Tab Bar */}
          <div className="px-6 md:px-12 lg:px-16 flex gap-1 -mb-px">
            {(['overview', 'community', 'reviews'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                  tab === t ? '' : 'border-transparent opacity-40 hover:opacity-70'
                }`}
                style={tab === t ? { borderColor: theme.primary, color: theme.primary } : {}}
              >
                {l[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 md:px-12 lg:px-16 py-8 md:py-12">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-[2px] overflow-hidden" style={{ backgroundColor: `${theme.primary}20` }}>
                <motion.div
                  className="w-full h-full"
                  style={{ backgroundColor: theme.primary }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* OVERVIEW TAB */}
              {tab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: l.totalTrips, value: stats?.communityTrips || 0, icon: MapPin, color: theme.primary },
                      { label: l.totalLikes, value: stats?.totalLikes || 0, icon: Heart, color: '#EF4444' },
                      { label: l.totalViews, value: stats?.totalViews || 0, icon: Eye, color: '#F59E0B' },
                      {
                        label: l.engagement,
                        value: stats && stats.totalViews > 0
                          ? `${((stats.totalLikes / stats.totalViews) * 100).toFixed(1)}%`
                          : '0%',
                        icon: TrendingUp,
                        color: '#10B981',
                      },
                    ].map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="p-6 md:p-8 border bg-current/[0.02]"
                          style={{ borderColor: `${stat.color}15` }}
                        >
                          <div className="flex items-center justify-between mb-6">
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{stat.label}</span>
                            <Icon className="w-4 h-4" style={{ color: stat.color }} />
                          </div>
                          <span className="text-4xl md:text-5xl font-black font-mono tracking-tighter" style={{ color: stat.color }}>
                            {stat.value}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Recent Trips Summary */}
                  <div className="border p-6 md:p-8" style={{ borderColor: `${theme.primary}10` }}>
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-50 mb-6 flex items-center gap-2">
                      <Activity className="w-4 h-4" style={{ color: theme.primary }} />
                      {language === 'ru' ? 'Недавние маршруты' : language === 'kz' ? 'Соңғы маршруттар' : 'Recent Trips'}
                    </h3>
                    <div className="space-y-3">
                      {communityTrips.slice(0, 5).map((trip) => (
                        <div key={trip.id} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: `${theme.text}08` }}>
                          <div className="flex-1 min-w-0 mr-4">
                            <span className="text-sm font-black truncate block">{trip.title}</span>
                            <span className="text-[10px] opacity-30 font-mono">{trip.authorName}</span>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] font-mono opacity-40 shrink-0">
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {trip.likes}</span>
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {trip.views}</span>
                            <span>{new Date(trip.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                      {communityTrips.length === 0 && (
                        <p className="text-xs opacity-30 text-center py-8">{l.noTrips}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* COMMUNITY TRIPS TAB */}
              {tab === 'community' && (
                <motion.div
                  key="community"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Toolbar */}
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                      <input
                        type="text"
                        placeholder={l.search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border text-xs bg-transparent outline-none font-mono"
                        style={{ borderColor: `${theme.primary}20`, color: theme.text }}
                      />
                    </div>
                    <div className="flex gap-2">
                      {(['date', 'likes', 'views'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            if (sortBy === s) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
                            else { setSortBy(s); setSortDir('desc'); }
                          }}
                          className="px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-1"
                          style={{
                            borderColor: sortBy === s ? theme.primary : `${theme.text}15`,
                            color: sortBy === s ? theme.primary : theme.text,
                            backgroundColor: sortBy === s ? `${theme.primary}08` : 'transparent',
                          }}
                        >
                          {l[`sort${s.charAt(0).toUpperCase() + s.slice(1)}` as keyof typeof l]}
                          {sortBy === s && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] font-mono opacity-30">
                    {filteredTrips.length} / {communityTrips.length} {language === 'ru' ? 'маршрутов' : language === 'kz' ? 'маршрут' : 'trips'}
                  </div>

                  {/* Trip List */}
                  <div className="space-y-2">
                    <AnimatePresence>
                      {filteredTrips.map((trip, idx) => (
                        <motion.div
                          key={trip.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ delay: idx * 0.02 }}
                          className="border p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-current/20 transition-colors"
                          style={{ borderColor: `${theme.text}08` }}
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-black uppercase tracking-tight truncate mb-1">{trip.title}</h4>
                            {trip.description && (
                              <p className="text-xs opacity-40 line-clamp-1 mb-2">{trip.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-[9px] font-mono opacity-30">
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {trip.authorName}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(trip.publishedAt).toLocaleDateString()}</span>
                              {trip.destinations && trip.destinations.length > 0 && (
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {trip.destinations.length} stops</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="flex items-center gap-4 text-xs font-mono">
                              <span className="flex items-center gap-1 opacity-50"><Heart className="w-3.5 h-3.5" /> {trip.likes}</span>
                              <span className="flex items-center gap-1 opacity-50"><Eye className="w-3.5 h-3.5" /> {trip.views}</span>
                            </div>

                            {confirmDelete === trip.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black uppercase tracking-wider text-red-500">{l.confirmDeleteMsg}</span>
                                <button
                                  onClick={() => handleDeleteTrip(trip.id)}
                                  disabled={deletingId === trip.id}
                                  className="px-3 py-1.5 text-[9px] font-black uppercase tracking-wider bg-red-500 text-white disabled:opacity-40"
                                >
                                  {l.confirm}
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border opacity-50 hover:opacity-100"
                                  style={{ borderColor: `${theme.text}20` }}
                                >
                                  {l.cancel}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(trip.id)}
                                className="p-2 border opacity-0 group-hover:opacity-40 hover:!opacity-100 hover:border-red-500 hover:text-red-500 transition-all"
                                style={{ borderColor: `${theme.text}15` }}
                                title={l.delete}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {filteredTrips.length === 0 && (
                      <p className="text-xs opacity-30 text-center py-16">{l.noTrips}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* REVIEWS TAB */}
              {tab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="border p-6 md:p-8 space-y-6" style={{ borderColor: `${theme.primary}10` }}>
                    <h3 className="text-xs font-black uppercase tracking-widest opacity-50 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" style={{ color: theme.primary }} />
                      {l.reviews}
                    </h3>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-30">{l.reviewType}</label>
                        <select
                          value={reviewTargetType}
                          onChange={(e) => setReviewTargetType(e.target.value)}
                          className="w-full md:w-40 py-2 px-3 border text-xs bg-transparent outline-none font-mono"
                          style={{ borderColor: `${theme.primary}20`, color: theme.text }}
                        >
                          <option value="place">Place</option>
                          <option value="tour">Tour</option>
                          <option value="stay">Stay</option>
                        </select>
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-30">{l.reviewTarget}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={reviewTargetId}
                            onChange={(e) => setReviewTargetId(e.target.value)}
                            placeholder="e.g. charyn-canyon"
                            className="flex-1 py-2 px-3 border text-xs bg-transparent outline-none font-mono"
                            style={{ borderColor: `${theme.primary}20`, color: theme.text }}
                          />
                          <button
                            onClick={handleFetchReviews}
                            disabled={reviewsLoading || !reviewTargetId.trim()}
                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                            style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                          >
                            {l.fetchReviews}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {reviewsLoading ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-[2px] mx-auto overflow-hidden" style={{ backgroundColor: `${theme.primary}20` }}>
                        <div className="w-full h-full animate-pulse" style={{ backgroundColor: theme.primary }} />
                      </div>
                    </div>
                  ) : fetchedReviews.length > 0 ? (
                    <div className="space-y-3">
                      {fetchedReviews.map((review) => (
                        <div key={review.id} className="border p-4 md:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 group" style={{ borderColor: `${theme.text}08` }}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-black uppercase tracking-wider">{review.userName}</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-current' : ''}`} style={{ color: s <= review.rating ? theme.primary : `${theme.text}15` }} />
                                ))}
                              </div>
                              <span className="text-[9px] opacity-30 font-mono">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs opacity-60 leading-relaxed">{review.text}</p>
                            <div className="flex items-center gap-3 mt-2 text-[9px] opacity-30 font-mono">
                              <span>Helpful: {review.helpful}</span>
                              <span>ID: {review.userId.slice(0, 8)}...</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-2 border border-red-500/20 text-red-500 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-all self-start shrink-0"
                            title={l.deleteReview}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : reviewTargetId && !reviewsLoading ? (
                    <p className="text-xs opacity-30 text-center py-12">{l.noReviews}</p>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
