
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface Props {
  lang: Language;
  isDarkMode?: boolean;
}

const HijriCalendar: React.FC<Props> = ({ lang, isDarkMode }) => {
  const t = translations[lang];
  
  // تنسيق التاريخ الهجري ليشمل اليوم والشهر والسنة
  const hijriFormatter = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA-u-ca-islamic-umalqura' : 'en-US-u-ca-islamic-umalqura', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const gregorianFormatter = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const hijriDate = hijriFormatter.format(new Date());
  const gregorianDate = gregorianFormatter.format(new Date());

  return (
    <div className="flex flex-col items-center text-center">
      <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border ${isDarkMode ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' : 'bg-emerald-100 border-emerald-200 text-emerald-800'}`}>
        {t.hijriDate}
      </div>
      <p className={`text-2xl md:text-4xl font-black tabular-nums drop-shadow-xl transition-colors ${isDarkMode ? 'text-amber-100' : 'text-emerald-950'}`}>
        {hijriDate}
      </p>
      <div className={`mt-3 flex items-center gap-2 text-xs md:text-sm font-bold opacity-60 transition-colors ${isDarkMode ? 'text-white' : 'text-emerald-900'}`}>
        <span className="tabular-nums">{gregorianDate}</span>
        <span>{t.gregorianDate}</span>
      </div>
    </div>
  );
};

export default HijriCalendar;
