import React from 'react';
import { ActiveTab, AppLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Volume2, VolumeX, Award, Star, Info, Volume } from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stars: number;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  autoRead: boolean;
  setAutoRead: (val: boolean) => void;
  onOpenCertificate: () => void;
  studentName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stars,
  soundEnabled,
  setSoundEnabled,
  language,
  setLanguage,
  autoRead,
  setAutoRead,
  onOpenCertificate,
  studentName,
}) => {
  const t = TRANSLATIONS[language];

  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'units', label: t.tabUnits, icon: '📏' },
    { id: 'tools', label: t.tabTools, icon: '🧰' },
    { id: 'estimation', label: t.tabEstimation, icon: '🎯' },
    { id: 'word-problems', label: t.tabProblems, icon: '🧩' },
    { id: 'number-line', label: t.tabNumberLine, icon: '🐸' },
  ];

  const toggleSound = () => {
    const next = !soundEnabled;
    sound.enabled = next;
    setSoundEnabled(next);
    if (next) sound.playPop();
  };

  const switchLanguage = (lang: AppLanguage) => {
    setLanguage(lang);
    sound.playPop();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Bar: Language Toggles & Auto-Read & Note */}
      <div className="bg-amber-500/10 border-b border-amber-200/50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          {/* Left: Language Toggle Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Language / Wika:</span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-amber-300 shadow-2xs">
              <button
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                🇺🇸 English
              </button>
              <button
                onClick={() => switchLanguage('tl')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  language === 'tl'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                🇵🇭 Tagalog
              </button>
            </div>

            {/* Auto Read Aloud Checkbox */}
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700 bg-white/90 px-2.5 py-1 rounded-xl border border-emerald-300 hover:bg-emerald-50 transition-colors ml-1">
              <input
                type="checkbox"
                checked={autoRead}
                onChange={(e) => {
                  setAutoRead(e.target.checked);
                  sound.playPop();
                }}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <span className="text-emerald-700">🔊</span>
                <span>{t.autoReadLabel}</span>
              </span>
            </label>
          </div>

          {/* Right: Small Note about Tagalog Filipino Voice */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 leading-tight">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="max-w-xl">{t.langNote}</span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-18">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveTab('units');
                sound.playPop();
              }}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label="ruler">📏</span>
                <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors whitespace-nowrap">
                  {t.appTitle} <span className="text-amber-500 font-bold text-lg">{t.gradeBadge}</span>
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    sound.playPop();
                  }}
                  className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-100 text-amber-900 shadow-sm ring-1 ring-amber-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Audio SFX Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? t.soundOn : t.soundOff}
              aria-label={soundEnabled ? t.soundOn : t.soundOff}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </button>

            {/* Stars Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="font-bold text-sm text-amber-900 tabular-nums">
                {stars} <span className="hidden sm:inline font-normal text-xs text-amber-700">{t.starsLabel}</span>
              </span>
            </div>

            {/* Certificate Primary CTA */}
            <button
              onClick={() => {
                sound.playPop();
                onOpenCertificate();
              }}
              className="px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>{studentName ? `${studentName}'s Award` : t.certificateBtn}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  sound.playPop();
                }}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-amber-100 text-amber-900 font-bold ring-1 ring-amber-300'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
