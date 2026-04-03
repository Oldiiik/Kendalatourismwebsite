import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Handshake } from './icons';
import { useAppNavigate } from '../../hooks/useAppNavigate';

interface PartnerCTAProps {
  variant: 'stays' | 'places' | 'tours';
  theme: any;
  language: string;
}

const content = {
  stays: {
    en: { tag: 'FOR PROPERTY OWNERS', title: 'Want to see your property here?', desc: 'Join Kazakhstan\'s premier travel platform. List your hotel, yurt camp, or guesthouse and reach thousands of travelers exploring the Great Steppe.' },
    ru: { tag: 'ДЛЯ ВЛАДЕЛЬЦЕВ', title: 'Хотите видеть здесь свой объект?', desc: 'Присоединяйтесь к премиальной платформе путешествий по Казахстану. Разместите свой отель, юрточный лагерь или гостевой дом.' },
    kz: { tag: 'МЕНШІК ИЕЛЕРІНЕ', title: 'Мүлкіңізді осында көргіңіз келе ме?', desc: 'Қазақстанның премиум саяхат платформасына қосылыңыз. Қонақ үйіңізді, киіз үйіңізді осында орналастырыңыз.' },
  },
  places: {
    en: { tag: 'DISCOVERED SOMETHING?', title: 'Know a hidden gem?', desc: 'Submit a place you\'ve discovered in Kazakhstan. Our AI verifies its authenticity and publishes it for all travelers to explore.' },
    ru: { tag: 'НАШЛИ НОВОЕ МЕСТО?', title: 'Знаете скрытую жемчужину?', desc: 'Предложите место, которое вы открыли в Казахстане. Наш AI проверит подлинность и опубликует для всех.' },
    kz: { tag: 'ЖАҢА ЖЕР ТАПТЫҢЫЗ БА?', title: 'Жасырын асыл тас білесіз бе?', desc: 'Қазақстанда тапқан жеріңізді ұсыныңыз. AI тексеріп, барлық саяхатшыларға жариялайды.' },
  },
  tours: {
    en: { tag: 'FOR TOUR OPERATORS', title: 'Run amazing tours?', desc: 'Partner with Kendala to showcase your expeditions, cultural tours, and adventures to a global audience of travel enthusiasts.' },
    ru: { tag: 'ДЛЯ ТУРОПЕРАТОРОВ', title: 'Проводите потрясающие туры?', desc: 'Станьте партнёром Kendala, чтобы показать свои экспедиции, культурные туры и приключения мировой аудитории.' },
    kz: { tag: 'ТУР ОПЕРАТОРЛАРЫНА', title: 'Керемет турлар ұйымдастырасыз ба?', desc: 'Экспедицияларыңыз бен мәдени турларыңызды әлемдік аудиторияға көрсету үшін Kendala серіктесі болыңыз.' },
  },
};

const ctaLabel = {
  en: 'Become a Partner',
  ru: 'Стать партнёром',
  kz: 'Серіктес болу',
};

const ctaLabelPlace = {
  en: 'Submit a Place',
  ru: 'Предложить место',
  kz: 'Жер ұсыну',
};

export const PartnerCTA: React.FC<PartnerCTAProps> = ({ variant, theme, language }) => {
  const onNavigate = useAppNavigate();
  const lang = (language as 'en' | 'ru' | 'kz') || 'en';
  const c = content[variant][lang] || content[variant]['en'];
  const isPlaceVariant = variant === 'places';
  const label = isPlaceVariant ? (ctaLabelPlace[lang] || ctaLabelPlace['en']) : (ctaLabel[lang] || ctaLabel['en']);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden border-y my-16"
      style={{ borderColor: `${theme.primary}30` }}
    >
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(${theme.primary} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative container mx-auto px-6 md:px-12 max-w-[1800px] py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 border backdrop-blur-md"
              style={{ borderColor: `${theme.primary}40`, backgroundColor: `${theme.primary}10` }}
            >
              <Handshake className="w-4 h-4" style={{ color: theme.primary }} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.primary }}>
                {c.tag}
              </span>
            </div>
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.9]">
              {c.title}
            </h3>
            <p className="text-sm md:text-base opacity-70 max-w-xl leading-relaxed">
              {c.desc}
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={() => onNavigate(isPlaceVariant ? 'create-place' : 'partner')}
              className="group px-10 md:px-16 py-6 md:py-8 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-4 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
            >
              <span>{label}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};