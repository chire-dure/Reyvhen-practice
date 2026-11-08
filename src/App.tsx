import React, { useState, useEffect } from 'react';
import { ActiveTab, AppLanguage } from './types';
import { TRANSLATIONS } from './i18n/translations';
import { Header } from './components/Header';
import { UnitsSection } from './components/UnitsSection';
import { ToolsSection } from './components/ToolsSection';
import { EstimationSection } from './components/EstimationSection';
import { WordProblemsSection } from './components/WordProblemsSection';
import { NumberLineSection } from './components/NumberLineSection';
import { CertificateModal } from './components/CertificateModal';
import { sound } from './utils/sound';
import { speech } from './utils/speech';
import { Volume2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('units');
  const [language, setLanguage] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('grade2_math_lang') as AppLanguage;
      return saved === 'tl' ? 'tl' : 'en';
    } catch {
      return 'en';
    }
  });
  const [autoRead, setAutoRead] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('grade2_auto_read');
      return saved === 'false' ? false : true;
    } catch {
      return true;
    }
  });
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('grade2_math_stars');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });
  const [studentName, setStudentName] = useState<string>(() => {
    try {
      return localStorage.getItem('grade2_student_name') || 'Little Brother';
    } catch {
      return 'Little Brother';
    }
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    try {
      localStorage.setItem('grade2_math_lang', language);
    } catch {
      // ignore
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem('grade2_auto_read', autoRead.toString());
    } catch {
      // ignore
    }
  }, [autoRead]);

  useEffect(() => {
    try {
      localStorage.setItem('grade2_math_stars', stars.toString());
    } catch {
      // ignore
    }
  }, [stars]);

  useEffect(() => {
    try {
      localStorage.setItem('grade2_student_name', studentName);
    } catch {
      // ignore
    }
  }, [studentName]);

  const handleEarnStar = () => {
    setStars((prev) => prev + 1);
  };

  const readAloudIntro = () => {
    sound.playPop();
    const welcomeMsg =
      language === 'tl'
        ? `Maligayang pagdating ${studentName}! Piliin ang iyong aralin: Sentimetro at Metro, Kagamitang Panukat, Pagtantiya, Suliraning may kwento, o Number Line Talunan!`
        : `Welcome ${studentName}! Choose an adventure: Centimeters and Meters, Measuring Tools, Estimation Station, Story Problems, or Number Line Hop!`;
    speech.speak(welcomeMsg, language);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-200">
      {/* 3-Zone Top Navigation Bar with Language Switcher & Auto-Read */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stars={stars}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        language={language}
        setLanguage={setLanguage}
        autoRead={autoRead}
        setAutoRead={setAutoRead}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        studentName={studentName}
      />

      {/* Main Learning Center Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Child Welcome Strip */}
        <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center text-3xl shadow-sm shrink-0">
              🎒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                  {t.welcomeGreeting}, {studentName}!
                </h1>
                {/* Green 🔊 button */}
                <button
                  onClick={readAloudIntro}
                  className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xs transition-colors cursor-pointer"
                  title={t.readAloudBtn}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                {t.welcomeSub}
              </p>
            </div>
          </div>

          {/* Quick Station Jump Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => {
                setActiveTab('units');
                sound.playPop();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'units'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📏 1. {t.tabUnits}
            </button>
            <button
              onClick={() => {
                setActiveTab('tools');
                sound.playPop();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'tools'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🧰 2. {t.tabTools}
            </button>
            <button
              onClick={() => {
                setActiveTab('estimation');
                sound.playPop();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'estimation'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🎯 3. {t.tabEstimation}
            </button>
            <button
              onClick={() => {
                setActiveTab('word-problems');
                sound.playPop();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'word-problems'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🧩 4. {t.tabProblems}
            </button>
            <button
              onClick={() => {
                setActiveTab('number-line');
                sound.playPop();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'number-line'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🐸 5. {t.tabNumberLine}
            </button>
          </div>
        </section>

        {/* Dynamic Station Rendering with language & autoRead props */}
        {activeTab === 'units' && (
          <UnitsSection
            language={language}
            autoRead={autoRead}
            onEarnStar={handleEarnStar}
          />
        )}
        {activeTab === 'tools' && (
          <ToolsSection
            language={language}
            autoRead={autoRead}
            onEarnStar={handleEarnStar}
          />
        )}
        {activeTab === 'estimation' && (
          <EstimationSection
            language={language}
            autoRead={autoRead}
            onEarnStar={handleEarnStar}
          />
        )}
        {activeTab === 'word-problems' && (
          <WordProblemsSection
            language={language}
            autoRead={autoRead}
            onEarnStar={handleEarnStar}
          />
        )}
        {activeTab === 'number-line' && (
          <NumberLineSection
            language={language}
            autoRead={autoRead}
            onEarnStar={handleEarnStar}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              {language === 'tl'
                ? 'Baitang 2 Sentro ng Pagsukat at Matematika'
                : 'Grade 2 Measurement & Math Learning Center'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {language === 'tl'
                ? 'Nakaayon sa Pamantayang Pang-elementarya'
                : 'Aligned with Elementary Math Standards'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsCertificateOpen(true);
                sound.playPop();
              }}
              className="text-amber-700 hover:text-amber-800 font-bold transition-colors cursor-pointer"
            >
              {language === 'tl' ? 'Tingnan ang Sertipiko' : 'View Printable Certificate'}
            </button>
          </div>
        </div>
      </footer>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        stars={stars}
        studentName={studentName}
        setStudentName={setStudentName}
        language={language}
      />
    </div>
  );
}
