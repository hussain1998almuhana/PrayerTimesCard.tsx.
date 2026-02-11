
import React, { useState, useEffect } from 'react';
import { Clock, Moon, Sparkles, ChevronRight } from 'lucide-react';
import { PrayerTimes, Language } from '../types';
import { translations } from '../translations';

interface Props {
  lang: Language;
  showAdhanSection?: boolean;
  showRamadanSection?: boolean;
  onTimesLoad?: (times: PrayerTimes) => void;
  isDarkMode?: boolean;
}

const PrayerTimesCard: React.FC<Props> = ({ lang, showAdhanSection, showRamadanSection, onTimesLoad, isDarkMode }) => {
  const [times, setTimes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState<{name: string, time: string, remaining: string} | null>(null);
  const t = translations[lang];

  useEffect(() => {
    initAutoLocation();
  }, []);

  useEffect(() => {
    if (times) {
      const interval = setInterval(calculateNextPrayer, 1000);
      return () => clearInterval(interval);
    }
  }, [times]);

  const calculateNextPrayer = () => {
    if (!times) return;
    const now = new Date();
    const prayerKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const prayerNames: any = { Fajr: t.fajr, Dhuhr: t.dhuhr, Asr: t.asr, Maghrib: t.maghrib, Isha: t.isha };

    for (let key of prayerKeys) {
      const [hours, minutes] = times[key].split(':').map(Number);
      const prayerDate = new Date();
      prayerDate.setHours(hours, minutes, 0);

      if (prayerDate > now) {
        const diff = prayerDate.getTime() - now.getTime();
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        setNextPrayer({
          name: prayerNames[key],
          time: formatTime12(times[key]),
          remaining: `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        });
        return;
      }
    }
    setNextPrayer({ name: t.fajr, time: formatTime12(times.Fajr), remaining: "--:--" });
  };

  const formatTime12 = (time24?: string) => {
    if (!time24) return '';
    const [hoursStr, minutesStr] = time24.split(':');
    let h = parseInt(hoursStr, 10);
    const m = minutesStr.split(' ')[0];
    const ampm = h >= 12 ? (lang === 'ar' ? 'م' : 'PM') : (lang === 'ar' ? 'ص' : 'AM');
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const initAutoLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => updateTimesByCoords(pos.coords.latitude, pos.coords.longitude),
        () => updateTimesByCoords(31.9922, 44.3508)
      );
    } else {
      updateTimesByCoords(31.9922, 44.3508);
    }
  };

  const updateTimesByCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=0`);
      const data = await response.json();
      if (data.code === 200) {
        setTimes(data.data.timings);
        if (onTimesLoad) onTimesLoad(data.data.timings);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return (
    <div className="p-20 text-center space-y-4">
      <div className={`animate-spin h-14 w-14 border-[6px] rounded-full mx-auto border-white/5 border-t-amber-400`} />
      <p className={`font-black animate-pulse uppercase tracking-widest text-[10px] text-amber-200/40`}>جاري تهيئة أوقات الصلاة...</p>
    </div>
  );

  const prayerItems = [
    { key: 'Fajr', name: t.fajr, time: formatTime12(times?.Fajr), icon: '🌅' },
    { key: 'Dhuhr', name: t.dhuhr, time: formatTime12(times?.Dhuhr), icon: '☀️' },
    { key: 'Asr', name: t.asr, time: formatTime12(times?.Asr), icon: '⛅' },
    { key: 'Maghrib', name: t.maghrib, time: formatTime12(times?.Maghrib), icon: '🌇' },
    { key: 'Isha', name: t.isha, time: formatTime12(times?.Isha), icon: '🌙' },
    { key: 'Midnight', name: t.midnight, time: formatTime12(times?.Midnight), icon: '🌌' },
  ];

  return (
    <div className="space-y-4">
      {nextPrayer && (
        <div className={`mx-4 mt-6 p-6 rounded-[3rem] border border-amber-400/30 bg-amber-400/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden flex items-center justify-between transition-all`}>
          <div className="relative z-10">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 text-amber-200`}>الصلاة القادمة</p>
            <h4 className="text-3xl font-black drop-shadow-lg text-white">{nextPrayer.name}</h4>
            <p className="text-sm font-bold mt-1 text-sky-200 opacity-70">{nextPrayer.time}</p>
          </div>
          <div className="relative z-10 text-right">
             <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-white/40">الوقت المتبقي</p>
             <p className="text-3xl font-black tabular-nums tracking-tighter drop-shadow-xl text-white">{nextPrayer.remaining}</p>
          </div>
          <Sparkles className="absolute -right-4 -bottom-4 text-white/5" size={120} />
        </div>
      )}

      {showRamadanSection && times && (
        <div className={`backdrop-blur-3xl p-6 md:p-8 rounded-[3rem] border border-amber-400/20 bg-amber-400/10 m-4 shadow-2xl relative overflow-hidden transition-all`}>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className={`p-2.5 rounded-xl border bg-amber-500/30 text-amber-100 border-amber-400/30`}>
                <Moon size={22} fill="currentColor" />
              </div>
              <h3 className={`font-black text-sm tracking-widest uppercase text-amber-100`}>
                {t.ramadanSection}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3 relative z-10">
              {[
                { n: t.imsakTime, t: formatTime12(times?.Imsak) },
                { n: t.suhoorTime, t: formatTime12(times?.Imsak) },
                { n: t.iftarTime, t: formatTime12(times?.Maghrib) }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-2xl text-center border bg-white/5 border-white/5 text-white backdrop-blur-md`}>
                  <p className={`text-[9px] font-black mb-1 uppercase tracking-tighter text-amber-200/50`}>{item.n}</p>
                  <p className="text-sm font-black tabular-nums">{item.t}</p>
                </div>
              ))}
            </div>
        </div>
      )}

      <div className="p-6 md:p-8 space-y-8">
        <div className="flex justify-between items-center px-2">
          <div className={`flex items-center gap-4 text-white`}>
            <div className={`p-3.5 rounded-2xl shadow-xl border bg-white/5 border-amber-400/10`}>
               <Clock size={24} strokeWidth={3} className="text-amber-400" />
            </div>
            <h3 className="font-black text-xl md:text-3xl tracking-tight">{t.prayerTimes}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {prayerItems.map((prayer, idx) => {
            const isNext = nextPrayer?.name === prayer.name;
            return (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-5 md:p-6 rounded-[2.5rem] transition-all border relative overflow-hidden ${isNext ? 'bg-amber-400 text-[#022C22] border-amber-300 shadow-[0_0_30px_rgba(212,175,55,0.4)] scale-105 z-10' : 'bg-white/5 text-white border-white/5'}`}
              >
                <div className="flex flex-col relative z-10">
                  <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isNext ? 'opacity-70' : 'text-sky-200/40'}`}>{prayer.name}</span>
                  <span className="text-lg md:text-xl font-black tabular-nums">{prayer.time}</span>
                </div>
                <span className="text-3xl opacity-80 relative z-10">{prayer.icon}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesCard;
