
import React, { useState, useEffect, useRef } from 'react';
import { Compass, Navigation, AlertCircle, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { calculateQibla, getCurrentPosition, calculateMagneticDeclination } from '../services/locationService';
import { Language } from '../types';
import { translations } from '../translations';

interface QiblaFinderProps {
  onBack: () => void;
  lang: Language;
}

const QiblaFinder: React.FC<QiblaFinderProps> = ({ onBack, lang }) => {
  const [qiblaDir, setQiblaDir] = useState<number | null>(null);
  const [declination, setDeclination] = useState(0);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isAligned, setIsAligned] = useState(false);
  const t = translations[lang];
  const headingRef = useRef(0);

  useEffect(() => {
    const initQibla = async () => {
      try {
        const pos = await getCurrentPosition();
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        
        const angle = calculateQibla(lat, lng);
        const magDecl = calculateMagneticDeclination(lat, lng);
        
        setQiblaDir(angle);
        setDeclination(magDecl);
        setLoading(false);
      } catch (err) {
        setError(t.locationError);
        setLoading(false);
      }
    };
    
    initQibla();
    
    const setupListeners = () => {
      if ('ondeviceorientationabsolute' in window) {
        (window as any).addEventListener('deviceorientationabsolute', handleOrientation as any);
      } else if ('ondeviceorientation' in window) {
        (window as any).addEventListener('deviceorientation', handleOrientation as any);
      }
    };

    if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      setPermissionGranted(true);
      setupListeners();
    }
    
    return () => {
      (window as any).removeEventListener('deviceorientationabsolute', handleOrientation as any);
      (window as any).removeEventListener('deviceorientation', handleOrientation as any);
    };
  }, []);

  const handleOrientation = (e: DeviceOrientationEvent) => {
    let heading = 0;
    if ((e as any).webkitCompassHeading) {
      heading = (e as any).webkitCompassHeading;
    } else if (e.absolute && e.alpha !== null) {
      heading = 360 - e.alpha;
    } else if (e.alpha !== null) {
      heading = (360 - e.alpha) + declination;
    }

    setDeviceHeading(heading);
    headingRef.current = heading;

    if (qiblaDir !== null) {
      const diff = Math.abs(((qiblaDir - heading + 540) % 360) - 180);
      const isNowAligned = diff < 4;
      setIsAligned(isNowAligned);
      if (isNowAligned && !isAligned && 'vibrate' in navigator) navigator.vibrate(30);
    }
  };

  const requestPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          (window as any).addEventListener('deviceorientation', handleOrientation as any);
        } else {
          setError(t.locationError);
          setPermissionGranted(false);
        }
      } catch (err) { setError(t.locationError); }
    }
  };

  const needleAngle = qiblaDir !== null ? (qiblaDir - deviceHeading) : 0;

  return (
    <div className={`min-h-screen flex flex-col items-center animate-in fade-in duration-1000 bg-[#020617]`}>
      {/* خلفية فلكية (Stars) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-1 h-1 bg-white rounded-full animate-pulse opacity-20"></div>
        <div className="absolute top-60 right-20 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-40 left-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent"></div>
      </div>

      <header className="w-full flex justify-between items-center p-6 relative z-10 pt-12">
        <h2 className="text-3xl font-bold spiritual-heading text-white drop-shadow-lg">{t.qiblaTitle}</h2>
        <button onClick={onBack} className="text-cyan-100 font-bold bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 active:scale-95 transition-all">{t.back}</button>
      </header>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-cyan-500/20 animate-ping"></div>
            <Compass size={40} className="absolute inset-0 m-auto text-cyan-400 animate-pulse" />
          </div>
          <p className="text-cyan-400/60 font-black uppercase tracking-[0.3em] text-[10px]">{t.locating}</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center px-10 text-center space-y-6">
          <div className="p-6 bg-red-500/10 rounded-[3rem] border border-red-500/20 shadow-2xl">
            <AlertCircle className="mx-auto text-red-400" size={60} />
          </div>
          <p className="text-white font-bold text-xl">{error}</p>
        </div>
      ) : permissionGranted === false || permissionGranted === null ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-12">
          <div className="w-32 h-32 bg-cyan-500/10 backdrop-blur-3xl rounded-[3rem] flex items-center justify-center text-cyan-400 shadow-2xl gold-border relative">
            <Compass size={64} className="relative z-10" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-3xl"></div>
          </div>
          <div className="space-y-4 max-w-xs">
            <h3 className="text-3xl font-black text-white spiritual-heading">{t.enableCompass}</h3>
            <p className="text-sm text-cyan-100/50 leading-relaxed font-bold">{t.compassReason}</p>
          </div>
          <button 
            onClick={requestPermission}
            className="bg-cyan-600 text-white px-12 py-5 rounded-[2.5rem] font-black shadow-[0_0_30px_rgba(8,145,178,0.3)] active:scale-95 transition-all flex items-center gap-4 text-lg"
          >
            <ShieldCheck size={28} />
            {t.enableSensors}
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center w-full space-y-16 relative z-10 pt-10">
          <div className="h-12 flex flex-col items-center">
             {isAligned ? (
               <div className="flex items-center gap-3 text-cyan-400 animate-in zoom-in duration-500 bg-cyan-400/10 px-8 py-3 rounded-full border border-cyan-400/20 shadow-[0_0_25px_rgba(34,211,238,0.2)]">
                 <CheckCircle2 size={24} />
                 <span className="font-black text-sm uppercase tracking-widest drop-shadow-md">{t.alignedWithQibla}</span>
               </div>
             ) : (
               <div className="flex items-center gap-2 text-cyan-100/30 font-black text-[10px] uppercase tracking-[0.4em]">
                 <Info size={14} />
                 <span>Celestial Navigation Active</span>
               </div>
             )}
          </div>

          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* توهج كوكبي */}
            <div className={`absolute inset-0 rounded-full blur-[60px] transition-all duration-1000 ${isAligned ? 'bg-cyan-500/40 scale-125' : 'bg-indigo-950/20'}`}></div>
            
            {/* حلقة البوصلة */}
            <div className={`absolute inset-0 border-[1.5px] rounded-full shadow-2xl glass-card transition-all duration-700 ${isAligned ? 'border-cyan-400 shadow-cyan-500/20' : 'border-white/5'}`}></div>
            
            {/* تدريجات البوصلة */}
            <div className="absolute inset-0" style={{ transform: `rotate(${-deviceHeading}deg)`, transition: 'transform 0.2s cubic-bezier(0.1, 0, 0.3, 1)' }}>
               {[...Array(36)].map((_, i) => (
                 <div key={i} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${i * 10}deg)` }}>
                   <div className={`w-[1px] ${i % 9 === 0 ? 'h-5 bg-cyan-400/60' : 'h-2 bg-cyan-100/10'}`}></div>
                 </div>
               ))}
               <span className="absolute top-8 left-1/2 -translate-x-1/2 font-black text-cyan-400 text-lg spiritual-heading">N</span>
               <span className="absolute bottom-8 left-1/2 -translate-x-1/2 font-black text-white/20 text-xs">S</span>
               <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-white/20 text-xs">W</span>
               <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-white/20 text-xs">E</span>
            </div>

            {/* سهم القبلة (الملاحة) */}
            <div className="absolute inset-0 pointer-events-none" style={{ transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.15s cubic-bezier(0.1, 0, 0.3, 1)' }}>
               <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className={`w-16 h-20 glass-card rounded-[2rem] border-2 shadow-2xl flex flex-col items-center justify-center transition-all ${isAligned ? 'border-cyan-400 scale-110 shadow-cyan-400/50 bg-cyan-400/10' : 'border-indigo-500/30'}`}>
                     <Navigation size={36} className={isAligned ? 'text-cyan-300' : 'text-indigo-400'} fill="currentColor" />
                  </div>
                  <div className={`w-[1px] h-12 mt-2 transition-colors ${isAligned ? 'bg-cyan-400 shadow-[0_0_10px_cyan]' : 'bg-indigo-500/20'}`}></div>
               </div>
            </div>

            {/* المركز (The Star) */}
            <div className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full blur-2xl transition-opacity ${isAligned ? 'bg-cyan-400/40 opacity-100' : 'bg-transparent opacity-0'}`}></div>
              <div className={`w-16 h-16 rounded-full glass-card border flex flex-col items-center justify-center shadow-2xl transition-all ${isAligned ? 'border-cyan-300 scale-110' : 'border-white/5'}`}>
                 <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">🕋</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-8xl font-black text-white tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] spiritual-heading">
                {Math.round((needleAngle + 360) % 360)}°
              </span>
              <span className="text-cyan-400 font-bold text-2xl drop-shadow-lg">{t.degree}</span>
            </div>
            <p className="text-cyan-100/30 text-xs font-black uppercase tracking-[0.6em]">{t.qiblaAngle}</p>
          </div>

          <div className="w-full max-w-sm px-6 space-y-8 pb-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-[2.5rem] shadow-xl text-center gold-border">
                <p className="text-[9px] font-black text-cyan-100/20 uppercase tracking-[0.2em] mb-2">Qibla Path</p>
                <span className="text-2xl font-black text-cyan-300 tabular-nums">{Math.round(qiblaDir || 0)}°</span>
              </div>
              <div className="glass-card p-6 rounded-[2.5rem] shadow-xl text-center gold-border">
                <p className="text-[9px] font-black text-cyan-100/20 uppercase tracking-[0.2em] mb-2">Mag Correction</p>
                <span className="text-2xl font-black text-indigo-400 tabular-nums">{declination.toFixed(1)}°</span>
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-[3.5rem] shadow-2xl border-white/5 relative overflow-hidden group">
               <div className="relative z-10 flex items-start gap-5">
                 <div className="p-3 bg-cyan-400/10 rounded-2xl">
                    <AlertCircle className="text-cyan-400" size={24} />
                 </div>
                 <p className="text-[11px] leading-relaxed font-bold text-cyan-100/60">
                   {t.compassNote} 
                   <br />
                   <span className="text-indigo-400/80 block mt-2 italic font-medium">Auto-calibrated using True North Celestial Model.</span>
                 </p>
               </div>
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-400/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-colors"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QiblaFinder;
