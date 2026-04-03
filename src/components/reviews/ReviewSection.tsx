import React, { useState, useEffect } from 'react';
import { useSeason } from '../../contexts/SeasonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { motion, AnimatePresence } from 'motion/react';
import { Star, User, Send, X, ChevronDown, ChevronUp } from '../ui/icons';
import { toast } from 'sonner@2.0.3';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
}

interface ReviewSectionProps {
  targetId: string;
  targetType: 'place' | 'tour' | 'stay';
  targetName: string;
}

export const ReviewSection = ({ targetId, targetType, targetName }: ReviewSectionProps) => {
  const { theme } = useSeason();
  const { language } = useLanguage();
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const labels: Record<string, Record<string, string>> = {
    en: {
      reviews: 'Reviews',
      writeReview: 'Write a Review',
      noReviews: 'No reviews yet. Be the first.',
      submit: 'Submit',
      placeholder: 'Share your experience...',
      loginRequired: 'Log in to write a review',
      submitted: 'Review submitted',
      showAll: 'Show all',
      showLess: 'Show less',
      helpful: 'Helpful',
      avgRating: 'Average',
    },
    ru: {
      reviews: 'Отзывы',
      writeReview: 'Написать отзыв',
      noReviews: 'Отзывов пока нет. Будьте первым.',
      submit: 'Отправить',
      placeholder: 'Поделитесь впечатлениями...',
      loginRequired: 'Войдите, чтобы оставить отзыв',
      submitted: 'Отзыв отправлен',
      showAll: 'Показать все',
      showLess: 'Свернуть',
      helpful: 'Полезно',
      avgRating: 'Средняя',
    },
    kz: {
      reviews: 'Пікірлер',
      writeReview: 'Пікір жазу',
      noReviews: 'Пікірлер жоқ. Бірінші болыңыз.',
      submit: 'Жіберу',
      placeholder: 'Тәжірибеңізбен бөлісіңіз...',
      loginRequired: 'Пікір жазу үшін кіріңіз',
      submitted: 'Пікір жіберілді',
      showAll: 'Барлығын көрсету',
      showLess: 'Жасыру',
      helpful: 'Пайдалы',
      avgRating: 'Орташа',
    },
  };

  const l = labels[language] || labels.en;

  useEffect(() => {
    fetchReviews();
  }, [targetId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/reviews/${targetType}/${targetId}`,
        { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
      );
      if (res.ok) {
        const data = await res.json().catch(() => []);
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to fetch reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.info(l.loginRequired);
      return;
    }
    if (!newText.trim()) return;
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/reviews/${targetType}/${targetId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'x-user-token': session.access_token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rating: newRating,
            text: newText,
            targetName,
          }),
        }
      );

      if (res.ok) {
        toast.success(l.submitted);
        setNewText('');
        setNewRating(5);
        setShowForm(false);
        fetchReviews();
      }
    } catch (e) {
      console.error('Submit review failed:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const markHelpful = async (reviewId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3ab99f71/reviews/${targetType}/${targetId}/${reviewId}/helpful`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            ...(token ? { 'x-user-token': token } : {}),
          },
        }
      );

      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
    } catch (e) {}
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const displayedReviews = expanded ? reviews : reviews.slice(0, 3);

  if (!theme) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: theme.text }}>
            {l.reviews} ({reviews.length})
          </span>
          {avgRating && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ backgroundColor: `${theme.primary}10` }}>
              <Star className="w-3 h-3 fill-current" style={{ color: theme.primary }} />
              <span className="text-[10px] font-black" style={{ color: theme.primary }}>{avgRating}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            if (!user) {
              toast.info(l.loginRequired);
              return;
            }
            setShowForm(!showForm);
          }}
          className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded border transition-all"
          style={{
            borderColor: `${theme.primary}30`,
            color: theme.primary,
          }}
        >
          {l.writeReview}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-lg border space-y-3" style={{ borderColor: `${theme.primary}15`, backgroundColor: `${theme.primary}03` }}>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= (hoverRating || newRating) ? 'fill-current' : ''
                      }`}
                      style={{ color: star <= (hoverRating || newRating) ? theme.primary : `${theme.text}20` }}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder={l.placeholder}
                rows={3}
                className="w-full p-3 rounded border text-sm bg-transparent outline-none resize-none"
                style={{ borderColor: `${theme.primary}15`, color: theme.text }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                  style={{ color: theme.text }}
                >
                  <X className="w-3 h-3" />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !newText.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
                  style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                >
                  <Send className="w-3 h-3" />
                  {l.submit}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="py-6 text-center">
          <div className="w-6 h-[2px] mx-auto overflow-hidden" style={{ backgroundColor: `${theme.primary}20` }}>
            <div className="w-full h-full animate-pulse" style={{ backgroundColor: theme.primary }} />
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-xs opacity-30 text-center py-6" style={{ color: theme.text }}>{l.noReviews}</p>
      ) : (
        <div className="space-y-3">
          {displayedReviews.map((review) => (
            <div key={review.id} className="p-4 rounded-lg border" style={{ borderColor: `${theme.primary}08` }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${theme.primary}15` }}>
                    <User className="w-3 h-3" style={{ color: theme.primary }} />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider" style={{ color: theme.text }}>
                      {review.userName}
                    </span>
                    <span className="text-[9px] opacity-30 ml-2" style={{ color: theme.text }}>
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${star <= review.rating ? 'fill-current' : ''}`}
                      style={{ color: star <= review.rating ? theme.primary : `${theme.text}15` }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs leading-relaxed opacity-70" style={{ color: theme.text }}>
                {review.text}
              </p>
              <button
                onClick={() => markHelpful(review.id)}
                className="mt-2 text-[9px] uppercase tracking-wider opacity-30 hover:opacity-60 transition-opacity flex items-center gap-1"
                style={{ color: theme.text }}
              >
                {l.helpful} ({review.helpful})
              </button>
            </div>
          ))}

          {reviews.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full py-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-70 transition-opacity flex items-center justify-center gap-1"
              style={{ color: theme.text }}
            >
              {expanded ? l.showLess : `${l.showAll} (${reviews.length})`}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
