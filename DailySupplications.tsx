
import React from 'react';
import { ArrowLeft, ArrowRight, Heart, Share2, Copy, Bookmark, Info } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface DailySupplicationsProps {
  onBack: () => void;
  lang: Language;
  dayIndex: number;
}

const DailySupplications: React.FC<DailySupplicationsProps> = ({ onBack, lang, dayIndex }) => {
  const t = translations[lang];
  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;
  
  // دالة لتحويل مؤشر اليوم إلى نص ترتيبي
  const getDayLabel = (idx: number) => {
    const labelsAr = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع"];
    const labelsEn = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh"];
    return lang === 'ar' ? `دعاء اليوم ${labelsAr[idx]}` : `${labelsEn[idx]} Day Supplication`;
  };

  // بيانات الأدعية (كمثال - يمكن توسيعها لاحقاً)
  const duaData = [
    { title: lang === 'ar' ? 'دعاء يوم السبت' : 'Saturday Supplication', content: "بِسْمِ اللهِ كَلِمَةِ الْمُعْتَصِمينَ وَ مَقالَةِ الْمُتَحَرِّزينَ، وَ اَعُوذُ بِاللهِ تَعالى مِنْ جَوْرِ الْجائِرينَ..." },
    { title: lang === 'ar' ? 'دعاء يوم الأحد' : 'Sunday Supplication', content: "بِسْمِ اللهِ الَّذى لا اَرْجُو اِلاّ فَضْلَهُ، وَ لا اَخْشى اِلاّ عَدْلَهُ، وَ لا اَعْتَمِدُ اِلاّ قَوْلَهُ..." },
    { title: lang === 'ar' ? 'دعاء يوم الاثنين' : 'Monday Supplication', content: "اَلْحَمْدُ للهِ الَّذى لَمْ يُشْهِدْ اَحَداً حينَ فَطَرَ السَّمواتِ وَ الاَرْضَ، وَ لاَ اتَّخَذَ مُعيناً حينَ بَرَأَ النَّسَماتِ..." },
    { title: lang === 'ar' ? 'دعاء يوم الثلاثاء' : 'Tuesday Supplication', content: "اَللّـهُمَّ اجْعَلْ اَوَّلَ يَوْمي هذا صَلاحاً، وَ اَوْسَطَهُ فَلاحاً، وَ آخِرَهُ نَجاحاً..." },
    { title: lang === 'ar' ? 'دعاء يوم الأربعاء' : 'Wednesday Supplication', content: "اَلْحَمْدُ للهِ الَّذى جَعَلَ اللَّيْلَ لِباساً، وَ النَّوْمَ سُباتاً، وَ جَعَلَ النَّهارَ نُشُوراً..." },
    { title: lang === 'ar' ? 'دعاء يوم الخميس' : 'Thursday Supplication', content: "اَلْحَمْدُ للهِ الَّذى اَذْهَبَ اللَّيْلَ مُظْلِماً بِقُدْرَتِهِ، وَ جاءَ بِالنَّهارُ مُبْصِراً بِرَحْمَتِهِ..." },
    { title: lang === 'ar' ? 'دعاء يوم الجمعة' : 'Friday Supplication', content: "اَلْحَمْدُ للهِ الاَْوَّلِ قَبْلَ الاِْنْشاءِ وَ الاِْحْياءِ، وَ الاْخِرِ بَعْدَ فَناءِ الاَْشْياءِ..." },
  ];

  const currentDua = duaData[dayIndex] || duaData[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDua.content);
    if ('vibrate' in navigator) navigator.vibrate(50);
    alert(lang === 'ar' ? "تم نسخ نص الدعاء" : "Supplication text copied");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentDua.title,
          text: currentDua.content,
        });
      } catch (err) { console.error(err); }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-in fade-in duration-500 bg-emerald-50/20 dark:bg-slate-950">
      <header className="bg-emerald-900/90 backdrop-blur-xl text-white p-6 pt-12 rounded-b-[3.5rem] sticky top-0 z-50 flex items-center border-b border-white/10 shadow-2xl">
        <button onClick={onBack} className={`${lang === 'ar' ? 'ml-4' : 'mr-4'} p-3 bg-white/10 rounded-2xl active:scale-90 border border-white/5`}>
          <BackIcon size={24} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-xl font-black text-amber-200 drop-shadow-lg spiritual-heading">{currentDua.title}</h2>
        </div>
        <div className="flex gap-2">
            <button onClick={handleShare} className="p-3 bg-white/10 rounded-2xl active:scale-90 border border-white/5">
                <Share2 size={20} className="text-amber-200" />
            </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-10 pb-40">
        <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3.5rem] p-10 border border-emerald-100 dark:border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center">
           {/* زخرفة علوية */}
           <div className="mb-8 p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl text-emerald-700 dark:text-amber-400">
              <Bookmark size={32} fill="currentColor" />
           </div>

           {/* نص الدعاء */}
           <p className="quran-text text-3xl md:text-5xl leading-[2.6] text-right text-emerald-950 dark:text-slate-100 drop-shadow-sm select-text" dir="rtl">
             {currentDua.content}
           </p>

           {/* القسم السفلي الجديد (رقم اليوم والمصدر) */}
           <div className="mt-12 w-full pt-8 border-t border-emerald-100 dark:border-white/5 flex flex-col items-center gap-6">
             <div className="flex items-center gap-3 px-6 py-2 bg-emerald-50 dark:bg-white/5 rounded-full border border-emerald-100 dark:border-white/10">
                <Info size={16} className="text-emerald-600 dark:text-amber-400" />
                <span className="text-xs font-black text-emerald-800 dark:text-amber-200 uppercase tracking-widest">
                  {getDayLabel(dayIndex)}
                </span>
             </div>

             <div className="flex gap-4 w-full">
               <button 
                onClick={handleCopy} 
                className="flex-1 bg-emerald-800 dark:bg-emerald-700 text-white py-5 rounded-[2rem] font-black shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                  <Copy size={20} />
                  <span>{lang === 'ar' ? 'نسخ الدعاء' : 'Copy Dua'}</span>
               </button>
               
               <button 
                className="w-16 h-16 bg-white dark:bg-slate-800 border border-emerald-100 dark:border-white/10 rounded-full flex items-center justify-center text-emerald-600 dark:text-amber-400 shadow-lg active:scale-90 transition-all"
               >
                 <Heart size={24} />
               </button>
             </div>
           </div>
        </div>

        <div className="mt-10 text-center opacity-20">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] dark:text-white">المصدر: مفاتيح الجنان • نهج النور</p>
        </div>
      </div>
    </div>
  );
};

export default DailySupplications;
