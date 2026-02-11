
import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Fingerprint, Compass, Settings, Bell, MapPin, 
  Moon, Sun, List, X, Heart, Star, ChevronLeft, ChevronRight, Sparkles, Globe, Palette,
  Youtube, Facebook, Instagram, Twitter, Share2, Book, Library, Loader2, RotateCcw,
  Languages, Info, Volume2, History, Compass as CompassIcon
} from 'lucide-react';
import PrayerTimesCard from './components/PrayerTimesCard';
import HijriCalendar from './components/HijriCalendar';
import QuranReader from './components/QuranReader';
import TasbihCounter from './components/TasbihCounter';
import QiblaFinder from './components/QiblaFinder';
import DailySupplications from './components/DailySupplications';
import DailyDuasList from './components/DailyDuasList';
import RajabDeeds from './components/RajabDeeds';
import ShaabanDeeds from './components/ShaabanDeeds';
import RamadanDeeds from './components/RamadanDeeds';
import RamadanSupplicationViewer from './components/RamadanSupplicationViewer';
import ZiyaratViewer from './components/ZiyaratViewer';
import NotificationSettings from './components/NotificationSettings';
import AdhanCustomization from './components/AdhanCustomization';
import KamilAlZiyarat from './components/KamilAlZiyarat';
import MafatihAlJinan from './components/MafatihAlJinan';
import RakaatCounter from './components/RakaatCounter';
import { Tab, Language, PrayerTimes } from './types';
import { translations } from './translations';

const BG_DARK = "https://images.unsplash.com/photo-1590076215667-875d45336102?q=80&w=2000&auto=format&fit=crop"; 
const BG_LIGHT = "https://images.unsplash.com/photo-1510421251302-3c4832560824?q=80&w=2000&auto=format&fit=crop"; 
const BG_QIBLA = "https://images.unsplash.com/photo-1614589201383-71a2a4726569?q=80&w=800&auto=format&fit=crop"; 

const AnimatedView: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="page-transition-enter min-h-screen">
    {children}
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Home);
  const [lang, setLang] = useState<Language>('ar');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') !== 'light');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const [showAdhan, setShowAdhan] = useState(true);
  const [showRamadan, setShowRamadan] = useState(() => localStorage.getItem('show_ramadan') === 'true');
  const [currentSubView, setCurrentSubView] = useState<'none' | 'dua' | 'duas-list' | 'ziyarat' | 'notifications' | 'adhan-customization' | 'rajab-deeds' | 'shaaban-deeds' | 'ramadan-deeds' | 'ramadan-dua' | 'developer-accounts' | 'kamil-ziyarat' | 'mafatih' | 'rakaat-counter'>('none');
  const [isDuaMenuOpen, setIsDuaMenuOpen] = useState(false);
  const [selectedDayDua, setSelectedDayDua] = useState<number | null>(null);
  const [selectedRamadanDuaId, setSelectedRamadanDuaId] = useState<string | null>(null);

  const t = translations[lang];

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleLanguage = () => setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const openSubView = (view: typeof currentSubView) => {
    setCurrentSubView(view);
    setIsDuaMenuOpen(false);
  };

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 z-[1000] bg-[#022C22] flex flex-col items-center justify-center">
        <div className="relative animate-in zoom-in duration-700">
          <div className="w-32 h-32 bg-white/5 rounded-[3.5rem] backdrop-blur-3xl border border-amber-400/20 flex items-center justify-center shadow-2xl animate-pulse">
            <Moon size={64} className="text-amber-400" fill="currentColor" />
          </div>
          <div className="absolute -bottom-3 -right-3 bg-amber-400 p-3 rounded-2xl shadow-lg">
             <Sparkles size={24} className="text-[#022C22]" />
          </div>
        </div>
        <h1 className="mt-10 text-5xl font-bold spiritual-heading text-white drop-shadow-2xl animate-in slide-in-from-bottom-8 duration-700 delay-200">نهج النور</h1>
        <p className="mt-4 text-sky-200/40 font-black uppercase tracking-[0.4em] text-[10px] animate-in fade-in duration-1000 delay-500">Al-Noor Path</p>
      </div>
    );
  }

  const renderContent = () => {
    if (currentSubView === 'developer-accounts') {
        return (
          <AnimatedView>
            <div className="p-6 md:p-12 pb-40 space-y-10 min-h-screen">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-4xl md:text-5xl font-bold spiritual-heading drop-shadow-xl flex items-center gap-4 ${isDarkMode ? 'text-white' : 'text-emerald-950'}`}>
                  {t.developerAccounts}
                  <Share2 size={32} className={isDarkMode ? 'text-amber-400' : 'text-emerald-600'} />
                </h2>
                <button onClick={() => setCurrentSubView('none')} className={`font-bold glass-card px-8 py-2 rounded-full gold-border active:scale-95 transition-all text-amber-200`}>{t.back}</button>
              </div>
              
              <div className="grid gap-6">
                <SocialLink icon={<Youtube />} label={t.youtube} url="https://youtube.com/channel/UCAK96Utx_8jzdbrTb4Ef9sQ?si=erFY-7SVxqWx9Frk" color="bg-red-500/20 text-red-500" isDarkMode={isDarkMode} />
                <SocialLink icon={<Facebook />} label={t.facebook} url="https://www.facebook.com/share/1FXhoAcEhQ/" color="bg-blue-600/20 text-blue-500" isDarkMode={isDarkMode} />
                <SocialLink icon={<Instagram />} label={t.instagram} url="https://www.instagram.com/hu_ex?igsh=MW1mZGJhMThhMHNodQ==" color="bg-pink-500/20 text-pink-500" isDarkMode={isDarkMode} />
                <SocialLink icon={<Twitter />} label={t.twitter} url="https://x.com/AlMuhanna_98_" color="bg-slate-400/20 text-slate-100" isDarkMode={isDarkMode} />
              </div>
            </div>
          </AnimatedView>
        );
      }
      if (currentSubView === 'mafatih') return <AnimatedView><MafatihAlJinan lang={lang} onBack={() => setCurrentSubView('none')} /></AnimatedView>;
      if (currentSubView === 'rakaat-counter') return <AnimatedView><RakaatCounter lang={lang} onBack={() => setCurrentSubView('none')} isDarkMode={isDarkMode} /></AnimatedView>;
      if (currentSubView === 'kamil-ziyarat') return <AnimatedView><KamilAlZiyarat lang={lang} onBack={() => setCurrentSubView('none')} /></AnimatedView>;
      if (currentSubView === 'ramadan-dua' && selectedRamadanDuaId) return <AnimatedView><RamadanSupplicationViewer lang={lang} supplicationId={selectedRamadanDuaId} onBack={() => setCurrentSubView('ramadan-deeds')} /></AnimatedView>;
      if (currentSubView === 'ramadan-deeds') return <AnimatedView><RamadanDeeds lang={lang} onBack={() => setCurrentSubView('none')} onViewSupplication={(id) => { setSelectedRamadanDuaId(id); setCurrentSubView('ramadan-dua'); }} /></AnimatedView>;
      if (currentSubView === 'rajab-deeds') return <AnimatedView><RajabDeeds lang={lang} onBack={() => setCurrentSubView('none')} /></AnimatedView>;
      if (currentSubView === 'shaaban-deeds') return <AnimatedView><ShaabanDeeds lang={lang} onBack={() => setCurrentSubView('none')} /></AnimatedView>;
      if (currentSubView === 'duas-list') return <AnimatedView><DailyDuasList lang={lang} onSelectDay={(idx) => { setSelectedDayDua(idx); setCurrentSubView('dua'); }} onBack={() => setCurrentSubView('none')} /></AnimatedView>;
      if (currentSubView === 'dua' && selectedDayDua !== null) return <AnimatedView><DailySupplications lang={lang} dayIndex={selectedDayDua} onBack={() => setCurrentSubView('duas-list')} /></AnimatedView>;
      if (currentSubView === 'ziyarat') return <AnimatedView><ZiyaratViewer lang={lang} onBack={() => setCurrentSubView('none')} /></AnimatedView>;
      if (currentSubView === 'notifications') return <AnimatedView><NotificationSettings lang={lang} onBack={() => setCurrentSubView('none')} /></AnimatedView>;
      if (currentSubView === 'adhan-customization') return <AnimatedView><AdhanCustomization lang={lang} onBack={() => setCurrentSubView('none')} isDarkMode={isDarkMode} /></AnimatedView>;

    switch (activeTab) {
      case Tab.Home:
        return (
          <div className="view-transition-slide-up flex flex-col min-h-screen pb-40">
            <header className={`${isDarkMode ? 'bg-black/40 text-white border-amber-400/10' : 'bg-[#022C22]/80 text-white border-white/10'} backdrop-blur-3xl p-8 md:p-12 pt-16 md:pt-24 rounded-b-[4.5rem] border-b relative overflow-hidden transition-all duration-700`}>
              <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex flex-col">
                  <h1 className={`text-4xl md:text-6xl font-bold spiritual-heading tracking-tight flex items-center gap-3 ${isDarkMode ? 'text-amber-400' : 'text-amber-200'} drop-shadow-lg`}>
                    {t.appName}
                    <Sparkles className="text-sky-400 animate-pulse" size={28} />
                  </h1>
                  <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mt-3 px-4 py-1.5 rounded-full w-fit glass-card gold-border text-sky-200`}>
                     <MapPin size={14} className="text-amber-400" />
                     <span>{t.currentLocation}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={toggleTheme} className={`p-5 rounded-[2rem] glass-card gold-border transition-all active:scale-90 shadow-2xl ${isDarkMode ? 'text-amber-300' : 'text-amber-200'}`}>
                    {isDarkMode ? <Sun size={28} /> : <Moon size={28} />}
                  </button>
                  <button onClick={() => setIsDuaMenuOpen(true)} className={`p-5 rounded-[2rem] glass-card gold-border transition-all active:scale-90 shadow-2xl text-white`}>
                    <List size={28} strokeWidth={3} />
                  </button>
                </div>
              </div>
              
              <div className="text-center py-8 relative z-10">
                <p className={`text-8xl md:text-[10rem] font-black tracking-tighter tabular-nums drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-white`}>
                  {currentTime.toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
                <div className={`mt-10 inline-block px-12 py-5 rounded-[3rem] glass-card gold-border shadow-2xl transition-all`}>
                  <HijriCalendar lang={lang} isDarkMode={isDarkMode} />
                </div>
              </div>
            </header>

            <main className="flex-1 px-6 md:px-12 pt-12 space-y-12">
              <div className={`rounded-[4rem] p-1 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] glass-card gold-border transition-all duration-700 overflow-hidden`}>
                <PrayerTimesCard lang={lang} showAdhanSection={showAdhan} showRamadanSection={showRamadan} onTimesLoad={(times) => setPrayerTimes(times)} isDarkMode={isDarkMode} />
              </div>
              
              <div className="grid grid-cols-2 gap-8 md:gap-12">
                <ServiceCardSimple 
                  onClick={() => setActiveTab(Tab.Quran)} 
                  icon={<BookOpen />} 
                  label={t.quranTitle} 
                  isDarkMode={isDarkMode} 
                  accentColor="text-amber-400" 
                  className="stagger-1 sky-glow"
                />
                <ServiceCardSimple 
                  onClick={() => setActiveTab(Tab.Tasbih)} 
                  icon={<Fingerprint />} 
                  label={t.tasbih} 
                  isDarkMode={isDarkMode} 
                  accentColor="text-sky-400" 
                  className="stagger-2 sky-glow"
                />
              </div>

              <button 
                 onClick={() => setActiveTab(Tab.Qibla)}
                 className="relative group w-full h-48 md:h-60 rounded-[4rem] overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6)] border gold-border transition-all active:scale-[0.98] stagger-3"
              >
                 <img src={BG_QIBLA} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60" />
                 <div className={`absolute inset-0 transition-colors duration-1000 ${isDarkMode ? 'bg-black/60 group-hover:bg-black/40' : 'bg-[#022C22]/60 group-hover:bg-[#022C22]/40'}`} />
                 <div className="relative z-10 flex items-center justify-between px-12 md:px-20 h-full">
                   <div className="flex items-center gap-8 md:gap-12">
                     <div className={`w-20 h-20 md:w-24 md:h-24 glass-card rounded-[2rem] flex items-center justify-center gold-border transition-all group-hover:rotate-6`}>
                        <Compass size={40} className="text-sky-400" strokeWidth={2.5} />
                     </div>
                     <span className={`font-bold spiritual-heading text-3xl md:text-5xl drop-shadow-2xl text-white`}>{t.qiblaTitle}</span>
                   </div>
                   <ChevronLeft className={`w-12 h-12 ${lang === 'ar' ? '' : 'rotate-180'} text-amber-300 drop-shadow-lg group-hover:translate-x-[-10px] transition-transform`} strokeWidth={3} />
                 </div>
              </button>
            </main>
          </div>
        );
      case Tab.Quran:
        return <AnimatedView><QuranReader lang={lang} onBack={() => setActiveTab(Tab.Home)} isDarkMode={isDarkMode} /></AnimatedView>;
      case Tab.Tasbih:
        return <AnimatedView><TasbihCounter lang={lang} onBack={() => setActiveTab(Tab.Home)} isDarkMode={isDarkMode} /></AnimatedView>;
      case Tab.Qibla:
        return <AnimatedView><QiblaFinder lang={lang} onBack={() => setActiveTab(Tab.Home)} /></AnimatedView>;
      case Tab.Settings:
        return (
          <div className="view-transition-slide-up p-8 md:p-16 pb-44 space-y-12 min-h-screen">
            <h2 className={`text-4xl md:text-6xl font-bold spiritual-heading drop-shadow-xl flex items-center gap-5 text-white`}>
              {t.settingsTitle}
              <Settings size={40} className="text-amber-400" />
            </h2>
            <section className="space-y-8">
              <div className={`glass-card rounded-[4rem] shadow-2xl gold-border p-4 divide-y divide-white/5`}>
                <SettingRow onClick={() => setCurrentSubView('notifications')} icon={<Bell size={28} className="text-sky-400" />} label={t.notificationSettings} isDarkMode={isDarkMode} lang={lang} />
                <SettingRow onClick={() => setCurrentSubView('adhan-customization')} icon={<Volume2 size={28} className="text-amber-400" />} label={lang === 'ar' ? 'تخصيص الأذان' : 'Adhan Customization'} isDarkMode={isDarkMode} lang={lang} />
                <SettingRow onClick={toggleLanguage} icon={<Globe size={28} className="text-sky-300" />} label={t.language} isDarkMode={isDarkMode} lang={lang} badge={lang === 'ar' ? 'English' : 'العربية'} />
                <div className={`w-full p-8 md:p-12 flex justify-between items-center text-white`}>
                   <div className="flex items-center gap-6">
                     <div className={`p-4 rounded-[1.5rem] bg-white/5 text-amber-400`}><Palette size={28} /></div>
                     <span className="font-bold text-xl md:text-3xl">{t.darkMode}</span>
                   </div>
                   <button onClick={toggleTheme} className={`w-16 h-9 rounded-full relative transition-all shadow-inner ${isDarkMode ? 'bg-amber-400' : 'bg-shia-green border border-white/10'}`}>
                      <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-md transition-all ${isDarkMode ? (lang === 'ar' ? 'left-1' : 'right-1') : (lang === 'ar' ? 'right-1' : 'left-1')}`} />
                   </button>
                </div>
              </div>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto min-h-screen relative overflow-hidden flex flex-col transition-colors duration-1000 bg-shia-green ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
        <img src={isDarkMode ? BG_DARK : BG_LIGHT} alt="Shrine Background" className="w-full h-full object-cover scale-105 blur-[2px] opacity-40" />
        <div className={`absolute inset-0 transition-colors duration-1000 ${isDarkMode ? 'bg-black/60' : 'bg-[#022C22]/80'}`} />
      </div>

      <div className="flex-1 overflow-y-auto relative z-10 scroll-smooth no-scrollbar">
        {renderContent()}
      </div>

      {isDuaMenuOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsDuaMenuOpen(false)}></div>
           <div className={`relative w-full max-w-lg glass-card rounded-[4rem] border gold-border shadow-[0_-20px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in slide-in-from-bottom-20 duration-500`}>
              <div className="p-8 pb-12 space-y-6">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-3xl font-bold spiritual-heading text-amber-200`}>{lang === 'ar' ? 'الخدمات الروحية' : 'Spiritual Services'}</h3>
                    <button onClick={() => setIsDuaMenuOpen(false)} className={`p-3 rounded-2xl bg-white/5 text-white`}>
                       <X size={24} />
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-3">
                    <MenuItem onClick={() => openSubView('mafatih')} icon={<Library className="text-amber-400" />} title={t.mafatihAlJinan} isDarkMode={isDarkMode} />
                    <MenuItem onClick={() => openSubView('duas-list')} icon={<Sun className="text-sky-400" />} title={t.dailyDuas} isDarkMode={isDarkMode} />
                    <MenuItem onClick={() => openSubView('ziyarat')} icon={<Heart className="text-rose-400" />} title={t.ziyaratTitle} isDarkMode={isDarkMode} />
                    <MenuItem onClick={() => openSubView('kamil-ziyarat')} icon={<Book className="text-amber-300" />} title={t.kamilAlZiyarat} isDarkMode={isDarkMode} />
                    <MenuItem onClick={() => openSubView('rakaat-counter')} icon={<History className="text-sky-300" />} title={t.rakaatCounter} isDarkMode={isDarkMode} />
                 </div>
              </div>
           </div>
        </div>
      )}

      <nav className={`fixed bottom-6 left-6 right-6 max-w-xl mx-auto glass-card gold-border flex justify-around items-center py-6 md:py-8 px-6 md:px-12 z-50 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]`}>
        <NavButton active={activeTab === Tab.Home} isDarkMode={isDarkMode} onClick={() => { setActiveTab(Tab.Home); setCurrentSubView('none'); }} icon={<Home className="w-8 h-8" />} label={t.home} />
        <NavButton active={activeTab === Tab.Quran} isDarkMode={isDarkMode} onClick={() => { setActiveTab(Tab.Quran); setCurrentSubView('none'); }} icon={<BookOpen className="w-8 h-8" />} label={t.quran} />
        <NavButton active={activeTab === Tab.Tasbih} isDarkMode={isDarkMode} onClick={() => { setActiveTab(Tab.Tasbih); setCurrentSubView('none'); }} icon={<Fingerprint className="w-8 h-8" />} label={t.tasbih} />
        <NavButton active={activeTab === Tab.Settings} isDarkMode={isDarkMode} onClick={() => { setActiveTab(Tab.Settings); setCurrentSubView('none'); }} icon={<Settings className="w-8 h-8" />} label={t.more} />
      </nav>
    </div>
  );
};

const MenuItem = ({ onClick, icon, title, isDarkMode }: any) => (
  <button onClick={onClick} className={`w-full p-6 rounded-[2rem] flex items-center justify-between border border-white/5 bg-white/5 hover:bg-white/10 transition-all active:scale-95 group`}>
     <div className="flex items-center gap-5">
        <div className={`p-3 rounded-2xl bg-black/20`}>
           {React.cloneElement(icon, { size: 24 })}
        </div>
        <span className={`text-xl font-bold spiritual-heading text-white`}>{title}</span>
     </div>
     <ChevronLeft size={24} className={`opacity-20 group-hover:opacity-100 group-hover:-translate-x-2 transition-all ${document.dir === 'ltr' ? 'rotate-180' : ''}`} />
  </button>
);

const SettingRow = ({ onClick, icon, label, isDarkMode, lang, badge }: any) => (
    <button onClick={onClick} className={`w-full p-8 md:p-12 flex justify-between items-center rounded-[2.5rem] transition-all hover:bg-white/5 active:scale-95 text-white`}>
      <div className="flex items-center gap-6">
        <div className={`p-4 rounded-[1.5rem] bg-white/5`}>{icon}</div>
        <span className="font-bold text-xl md:text-3xl">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        {badge && <span className={`font-black px-5 py-2 rounded-full text-xs gold-border text-amber-400 bg-white/5`}>{badge}</span>}
        <ChevronRight size={32} className={`${lang === 'ar' ? 'rotate-180' : ''} opacity-20`}/>
      </div>
    </button>
);

const ServiceCardSimple = ({ onClick, icon, label, isDarkMode, accentColor, className }: any) => (
    <button onClick={onClick} className={`h-48 md:h-64 rounded-[4rem] flex flex-col items-center justify-center space-y-6 shadow-2xl glass-card gold-border transition-all active:scale-95 group ${className}`}>
      <div className={`w-20 h-20 md:w-24 md:h-24 glass-card rounded-[2.5rem] flex items-center justify-center border gold-border transition-all group-hover:scale-110 group-hover:rotate-12 ${accentColor}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 40 })}
      </div>
      <span className={`font-bold spiritual-heading text-xl md:text-3xl drop-shadow-md text-center px-6 text-white`}>{label}</span>
    </button>
  );

const SocialLink = ({ icon, label, url, color, isDarkMode }: any) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className={`w-full p-8 rounded-[3.5rem] flex items-center gap-8 glass-card gold-border transition-all hover:scale-[1.02] active:scale-95 shadow-2xl group`}>
    <div className={`w-20 h-20 ${color} rounded-[1.8rem] flex items-center justify-center shadow-lg shrink-0 border border-white/5 group-hover:rotate-6 transition-transform`}>
      {React.cloneElement(icon as React.ReactElement, { size: 40, strokeWidth: 2.5 })}
    </div>
    <div className="flex-1 text-right">
      <span className={`text-2xl font-bold spiritual-heading block leading-tight text-white`}>{label}</span>
      <span className={`text-xs opacity-20 font-black tracking-widest block mt-2 uppercase`}>{url.replace('https://', '').split('/')[0]}</span>
    </div>
    <ChevronLeft size={32} className="opacity-10 group-hover:opacity-100 group-hover:translate-x-[-10px] transition-all" />
  </a>
);

const NavButton: React.FC<{ active: boolean, isDarkMode: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, isDarkMode, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-3 flex-1 transition-all duration-500 ${active ? 'text-amber-400 scale-110' : 'text-sky-100/40 hover:opacity-80'}`}>
    <div className={`p-4 md:p-5 rounded-[1.8rem] transition-all duration-500 relative ${active ? 'bg-amber-400/10 gold-border shadow-[0_0_30px_rgba(212,175,55,0.2)]' : ''}`}>
      {icon}
      {active && <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(212,175,55,1)]`}></div>}
    </div>
    <span className={`text-[11px] font-black uppercase tracking-widest transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
  </button>
);

export default App;
