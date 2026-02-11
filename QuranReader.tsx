
import React, { useState, useEffect } from 'react';
// Added ChevronRight to the imports from lucide-react
import { ArrowLeft, ArrowRight, Search, Book, Bookmark, Trash2, Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { Surah, Ayah, Language } from '../types';
import { translations } from '../translations';

interface QuranReaderProps {
  onBack: () => void;
  lang: Language;
  isDarkMode?: boolean;
}

interface SavedBookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
}

const QuranReader: React.FC<QuranReaderProps> = ({ onBack, lang, isDarkMode }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  
  const t = translations[lang];

  useEffect(() => {
    fetchSurahs();
    const saved = localStorage.getItem('quran_bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const fetchSurahs = async () => {
    try {
      const res = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await res.json();
      setSurahs(data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSurah = async (surah: Surah) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`);
      const data = await res.json();
      setAyahs(data.data.ayahs);
      setSelectedSurah(surah);
      setLoading(false);
      setShowBookmarksOnly(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAyahBookmark = (ayah: Ayah, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSurah) return;
    const isSaved = bookmarks.some(b => b.surahNumber === selectedSurah.number && b.ayahNumber === ayah.numberInSurah);
    if (isSaved) {
      setBookmarks(prev => prev.filter(b => !(b.surahNumber === selectedSurah.number && b.ayahNumber === ayah.numberInSurah)));
    } else {
      setBookmarks(prev => [...prev, {
        surahNumber: selectedSurah.number,
        surahName: lang === 'ar' ? selectedSurah.name : selectedSurah.englishName,
        ayahNumber: ayah.numberInSurah,
        text: ayah.text
      }]);
    }
  };

  const isAyahBookmarked = (ayahNumber: number) => {
    if (!selectedSurah) return false;
    return bookmarks.some(b => b.surahNumber === selectedSurah.number && b.ayahNumber === ayahNumber);
  };

  const deleteBookmark = (surahNumber: number, ayahNumber: number) => {
    setBookmarks(prev => prev.filter(b => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)));
  };

  const goToBookmarkedSurah = (surahNum: number) => {
    const surah = surahs.find(s => s.number === surahNum);
    if (surah) {
      loadSurah(surah);
    }
  };

  const filteredSurahs = surahs.filter(s => 
    s.name.includes(searchTerm) || 
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;

  // نمط المخطوطة (Manuscript Mode)
  if (selectedSurah) {
    return (
      <div className={`min-h-screen flex flex-col animate-in fade-in duration-500 pb-20 ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-[#fdfcf0]'}`}>
        <header className={`${isDarkMode ? 'bg-[#151515] border-amber-900/30' : 'bg-[#f5f2d0] border-[#e5e0a0]'} p-6 pt-12 rounded-b-[3.5rem] sticky top-0 z-50 flex items-center border-b shadow-xl`}>
          <button onClick={() => setSelectedSurah(null)} className={`p-2 rounded-2xl active:scale-90 ${isDarkMode ? 'bg-white/5 text-amber-200' : 'bg-[#8b4513]/10 text-[#8b4513]'}`}>
            <BackIcon size={24} />
          </button>
          <div className="flex-1 text-center">
            <h2 className={`text-3xl font-bold spiritual-heading drop-shadow-sm ${isDarkMode ? 'text-amber-200' : 'text-[#5d2e0a]'}`}>{lang === 'ar' ? selectedSurah.name : selectedSurah.englishName}</h2>
            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-amber-200/40' : 'text-[#8b4513]/40'}`}>{selectedSurah.numberOfAyahs} {t.ayahs}</p>
          </div>
          <div className="w-12"></div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-32">
          {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
            <div className="text-center py-8">
              <p className={`quran-text text-4xl leading-relaxed drop-shadow-sm ${isDarkMode ? 'text-amber-100/90' : 'text-[#2d1b0d]'}`}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <div className={`h-[1px] w-24 mx-auto mt-6 ${isDarkMode ? 'bg-amber-900/30' : 'bg-[#8b4513]/20'}`} />
            </div>
          )}
          
          {loading ? (
             <div className="flex justify-center p-20"><Loader2 className={`animate-spin ${isDarkMode ? 'text-amber-400' : 'text-[#8b4513]'}`} size={40} /></div>
          ) : (
            ayahs.map((ayah) => (
              <div 
                key={ayah.number} 
                className={`group relative rounded-[2rem] p-8 transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-[#faf7e6] hover:bg-[#f5f0d5] border border-[#e5e0a0]/30 shadow-sm'}`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black tabular-nums spiritual-heading shadow-md ${isDarkMode ? 'bg-amber-500 text-black' : 'bg-[#5d2e0a] text-amber-100'}`}>
                    {ayah.numberInSurah}
                  </div>
                  <button 
                    onClick={(e) => toggleAyahBookmark(ayah, e)}
                    className={`p-3 rounded-2xl transition-all ${isAyahBookmarked(ayah.numberInSurah) ? 'bg-amber-500 text-white' : 'bg-black/5 dark:bg-white/5 text-gray-400'}`}
                  >
                    <Bookmark size={20} fill={isAyahBookmarked(ayah.numberInSurah) ? "currentColor" : "none"} />
                  </button>
                </div>
                <p className={`quran-text text-3xl md:text-5xl leading-[2.5] text-right drop-shadow-sm select-text ${isDarkMode ? 'text-amber-50' : 'text-[#1a0f07]'}`} dir="rtl">
                  {ayah.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 space-y-6 pb-32 animate-in fade-in duration-700 min-h-screen ${isDarkMode ? 'bg-black' : 'bg-[#fdfcf0]'}`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-4xl font-bold spiritual-heading drop-shadow-lg ${isDarkMode ? 'text-amber-200' : 'text-[#5d2e0a]'}`}>{t.quranTitle}</h2>
        <button onClick={onBack} className={`font-bold px-6 py-2 rounded-full border active:scale-95 shadow-lg transition-all ${isDarkMode ? 'text-amber-100 bg-white/5 border-white/10' : 'text-[#8b4513] bg-white border-[#e5e0a0]'}`}>{t.back}</button>
      </div>

      <div className={`flex p-2 rounded-[2.5rem] shadow-xl border transition-colors ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-[#f5f2d0] border-[#e5e0a0]'}`}>
        <button 
          onClick={() => setShowBookmarksOnly(false)}
          className={`flex-1 py-4 rounded-[2rem] text-sm font-black transition-all ${!showBookmarksOnly ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-400'}`}
        >
          {t.allSurahs}
        </button>
        <button 
          onClick={() => setShowBookmarksOnly(true)}
          className={`flex-1 py-4 rounded-[2rem] text-sm font-black flex items-center justify-center gap-2 transition-all ${showBookmarksOnly ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-400'}`}
        >
          <Bookmark size={18} fill={showBookmarksOnly ? "currentColor" : "none"} />
          {t.bookmarks}
          {bookmarks.length > 0 && <span className="ml-2 bg-black/20 px-2 py-0.5 rounded-full text-[10px]">{bookmarks.length}</span>}
        </button>
      </div>

      {!showBookmarksOnly && (
        <div className="relative mb-8">
          <Search className={`absolute ${lang === 'ar' ? 'right-5' : 'left-5'} top-5 text-gray-400`} size={22} />
          <input 
            type="text" 
            placeholder={t.searchSurah}
            className={`w-full text-lg font-bold ${lang === 'ar' ? 'pr-14 pl-6' : 'pr-14 pl-6'} py-5 rounded-[2.5rem] border shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-white/20' : 'bg-white border-[#e5e0a0] text-[#5d2e0a] placeholder-[#8b4513]/20'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="grid gap-4">
        {showBookmarksOnly ? (
          bookmarks.length === 0 ? (
            <div className="py-32 text-center opacity-20">
              <Bookmark size={80} className="mx-auto mb-4" />
              <p className="font-bold text-xl">{t.noBookmarks}</p>
            </div>
          ) : (
            bookmarks.map((bookmark) => (
              <div 
                key={`${bookmark.surahNumber}-${bookmark.ayahNumber}`}
                className={`p-8 rounded-[2.5rem] shadow-xl border animate-in slide-in-from-bottom-4 duration-500 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-[#faf7e6] border-[#e5e0a0]/40'}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <button onClick={() => goToBookmarkedSurah(bookmark.surahNumber)} className="flex items-center gap-4 text-amber-500">
                    <Book size={20} />
                    <span className="font-bold spiritual-heading text-xl">{bookmark.surahName}</span>
                    <span className="text-[10px] bg-amber-500/10 px-3 py-1 rounded-full">{bookmark.ayahNumber}</span>
                  </button>
                  <button onClick={() => deleteBookmark(bookmark.surahNumber, bookmark.ayahNumber)} className="p-2 text-red-400/50 hover:text-red-500">
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className={`quran-text text-2xl leading-relaxed text-right select-text ${isDarkMode ? 'text-amber-50' : 'text-[#1a0f07]'}`} dir="rtl">
                  {bookmark.text}
                </p>
              </div>
            ))
          )
        ) : (
          filteredSurahs.map((surah) => (
            <button 
              key={surah.number} 
              onClick={() => loadSurah(surah)}
              className={`w-full p-6 rounded-[2.5rem] shadow-xl border flex items-center justify-between transition-all active:scale-[0.98] group ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-[#e5e0a0] hover:bg-[#faf7e6]'}`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black shadow-lg transition-transform group-hover:rotate-6 ${isDarkMode ? 'bg-amber-400 text-black' : 'bg-[#5d2e0a] text-amber-100'}`}>
                  {surah.number}
                </div>
                <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <h4 className={`font-bold spiritual-heading text-2xl leading-tight ${isDarkMode ? 'text-white' : 'text-[#5d2e0a]'}`}>{lang === 'ar' ? surah.name : surah.englishName}</h4>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-white/30' : 'text-[#8b4513]/40'}`}>{surah.englishName} • {surah.revelationType === 'Meccan' ? t.meccan : t.medinan}</p>
                </div>
              </div>
              <ChevronRight className={`w-8 h-8 opacity-10 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default QuranReader;
