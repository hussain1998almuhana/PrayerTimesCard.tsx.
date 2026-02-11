
import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Music, Play, Square, Loader2, Check, Volume2, Info, User, Activity } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { SHIA_ADHAN_PARTS } from '../constants';

interface Props {
  onBack: () => void;
  lang: Language;
  isDarkMode?: boolean;
}

const AdhanCustomization: React.FC<Props> = ({ onBack, lang, isDarkMode }) => {
  const t = translations[lang];
  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;
  
  const [selectedVoice, setSelectedVoice] = useState(() => localStorage.getItem('default_adhan_voice') || 'osama');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const voices = [
    { id: 'maytham', name: t.maythamAdhan, url: 'https://ia801007.us.archive.org/1/items/AdanCollection/Maytham_Al_Tamar.mp3' },
    { id: 'osama', name: t.osamaAdhan, url: 'https://ia801007.us.archive.org/1/items/AdanCollection/Osama_Al_Karbalai.mp3' },
    { id: 'abather', name: t.abatherAdhan, url: 'https://ia600205.us.archive.org/21/items/Abather-Adhan/Abather-Adhan.mp3' },
    { id: 'amer', name: t.amerAdhan, url: 'https://ia801007.us.archive.org/1/items/AdanCollection/Amer_Al_Kazemi.mp3' },
    { id: 'bassem', name: t.bassemAdhan, url: 'https://ia903104.us.archive.org/28/items/shia-adhan-collection/Basim_Al-Karbalai.mp3' },
  ];

  const togglePreview = (id: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation(); // منع اختيار المؤذن عند الضغط على زر المعاينة

    if (audioRef.current) {
      audioRef.current.pause();
      if (currentlyPlaying === id) {
        setCurrentlyPlaying(null);
        return;
      }
    }

    setIsLoading(id);
    const audio = new Audio(url);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    audio.onplaying = () => {
      setIsLoading(null);
      setCurrentlyPlaying(id);
    };

    audio.onended = () => {
      setCurrentlyPlaying(null);
    };

    audio.onerror = () => {
      setIsLoading(null);
      setCurrentlyPlaying(null);
      alert(lang === 'ar' ? "خطأ في تشغيل الصوت" : "Error playing audio");
    };

    audio.play().catch(() => {
      setIsLoading(null);
      setCurrentlyPlaying(null);
    });
  };

  const saveSelection = (id: string) => {
    setSelectedVoice(id);
    localStorage.setItem('default_adhan_voice', id);
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  return (
    <div className={`min-h-screen flex flex-col animate-in fade-in duration-500 pb-40 ${isDarkMode ? 'bg-slate-950' : 'bg-emerald-50/30'}`}>
      <header className={`bg-white/80 backdrop-blur-xl p-6 pt-12 rounded-b-[3.5rem] sticky top-0 z-50 flex items-center border-b shadow-xl dark:bg-slate-900/80 dark:border-white/5`}>
        <button onClick={onBack} className={`${lang === 'ar' ? 'ml-4' : 'mr-4'} p-3 bg-emerald-50 rounded-2xl active:scale-90 border border-emerald-100 dark:bg-white/5 dark:border-white/10`}>
          <BackIcon size={24} className="text-emerald-700 dark:text-amber-400" />
        </button>
        <div className="flex-1 text-center">
          <h2 className={`text-xl font-black spiritual-heading ${isDarkMode ? 'text-white' : 'text-emerald-950'}`}>{lang === 'ar' ? 'تخصيص الأذان' : 'Adhan Customization'}</h2>
        </div>
        <div className="w-12"></div>
      </header>

      <div className="flex-1 p-5 space-y-10 overflow-y-auto">
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
             <div className="p-2 bg-amber-400/20 rounded-lg">
                <Music size={20} className="text-amber-500" />
             </div>
             <h3 className={`font-black text-sm uppercase tracking-widest ${isDarkMode ? 'text-amber-200' : 'text-emerald-900'}`}>
               {lang === 'ar' ? 'اختر صوت المؤذن' : 'Select Muezzin Voice'}
             </h3>
          </div>
          
          <div className="grid gap-4">
            {voices.map((voice) => (
              <div 
                key={voice.id}
                onClick={() => saveSelection(voice.id)}
                className={`group relative p-1 rounded-[2.8rem] border shadow-2xl transition-all active:scale-[0.98] cursor-pointer ${selectedVoice === voice.id ? (isDarkMode ? 'bg-amber-400 border-amber-300' : 'bg-emerald-600 border-emerald-500') : (isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-emerald-100')}`}
              >
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors relative overflow-hidden ${selectedVoice === voice.id ? 'bg-white/20' : (isDarkMode ? 'bg-white/5' : 'bg-emerald-50')}`}>
                      {currentlyPlaying === voice.id ? (
                        <Activity className="animate-pulse text-current" size={28} />
                      ) : (
                        <User size={28} className={selectedVoice === voice.id ? 'text-white' : (isDarkMode ? 'text-white/40' : 'text-emerald-600')} />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-black text-lg spiritual-heading ${selectedVoice === voice.id ? 'text-white' : (isDarkMode ? 'text-white' : 'text-emerald-950')}`}>{voice.name}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60 ${selectedVoice === voice.id ? 'text-white' : (isDarkMode ? 'text-white/40' : 'text-emerald-600')}`}>
                        {currentlyPlaying === voice.id ? (lang === 'ar' ? 'جاري الاستماع...' : 'Playing preview...') : (lang === 'ar' ? 'صوت شيعي' : 'Shia Voice')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* زر المعاينة المستقل */}
                    <button 
                      onClick={(e) => togglePreview(voice.id, voice.url, e)}
                      className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-90 ${currentlyPlaying === voice.id ? 'bg-white text-emerald-600 ring-4 ring-white/30' : (selectedVoice === voice.id ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600 dark:bg-white/10 dark:text-white')}`}
                    >
                      {isLoading === voice.id ? (
                        <Loader2 size={24} className="animate-spin" />
                      ) : currentlyPlaying === voice.id ? (
                        <Square size={24} fill="currentColor" />
                      ) : (
                        <Play size={24} fill="currentColor" className={lang === 'ar' ? 'rotate-180' : ''} />
                      )}
                    </button>
                    
                    {selectedVoice === voice.id && (
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-in zoom-in border border-white/20 shadow-inner">
                         <Check size={20} strokeWidth={4} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
           <div className="flex items-center gap-3 px-2">
             <div className="p-2 bg-emerald-400/20 rounded-lg">
                <Volume2 size={20} className="text-emerald-500" />
             </div>
             <h3 className={`font-black text-sm uppercase tracking-widest ${isDarkMode ? 'text-amber-200' : 'text-emerald-900'}`}>
               {lang === 'ar' ? 'فقرات الأذان الشيعي' : 'Shia Adhan Components'}
             </h3>
          </div>
          
          <div className={`p-8 rounded-[3.5rem] border backdrop-blur-3xl shadow-2xl relative overflow-hidden space-y-4 transition-all ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-emerald-100'}`}>
             <div className="absolute top-0 right-0 p-10 opacity-5">
               <Info size={180} />
             </div>
             
             <div className="relative z-10 grid gap-3">
               {SHIA_ADHAN_PARTS.map((part, idx) => (
                 <div key={idx} className={`flex items-center justify-between p-5 rounded-3xl border transition-all hover:translate-x-1 ${isDarkMode ? 'bg-white/5 border-white/5 text-white/80' : 'bg-emerald-50/50 border-emerald-100 text-emerald-900/80'}`}>
                    <span className="quran-text text-xl leading-relaxed">{part}</span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black tabular-nums border shadow-sm ${isDarkMode ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : 'bg-emerald-600 text-white border-emerald-500'}`}>
                      {idx + 1}
                    </div>
                 </div>
               ))}
             </div>
             
             <div className={`mt-8 p-6 rounded-[2rem] border flex items-start gap-4 animate-pulse ${isDarkMode ? 'bg-amber-400/10 border-amber-400/20 text-amber-100' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
               <Info size={24} className="shrink-0 mt-1" />
               <p className="text-xs font-bold leading-relaxed">
                 {lang === 'ar' 
                   ? 'تتضمن الطريقة الشيعية الإثني عشرية الشهادة لعلي بن أبي طالب (عليه السلام) بالولاية كفقرة مكملة، بالإضافة إلى عبارة "حي على خير العمل" التي سقطت في التعديلات المتأخرة.' 
                   : 'The Shia tradition includes the testimony for Imam Ali (AS) and the phrase "Hayya ala Khayril Amal" which are essential parts of the call to prayer.'}
               </p>
             </div>
          </div>
        </section>

        <div className="p-12 text-center opacity-30">
          <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-white' : 'text-emerald-950'}`}>نهج النور • Al-Noor Path</p>
        </div>
      </div>
    </div>
  );
};

export default AdhanCustomization;
