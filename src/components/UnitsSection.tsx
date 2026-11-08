import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { UNIT_ITEMS_BILINGUAL } from '../data/unitsData';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

interface UnitsSectionProps {
  language: AppLanguage;
  autoRead: boolean;
  onEarnStar: () => void;
}

export const UnitsSection: React.FC<UnitsSectionProps> = ({ language, autoRead, onEarnStar }) => {
  const t = TRANSLATIONS[language];
  const [activeSubTab, setActiveSubTab] = useState<'learn' | 'unpacker' | 'game'>('learn');
  const [meterDecomp, setMeterDecomp] = useState<number>(40);
  const [gameIndex, setGameIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'cm' | 'm' | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [completedGame, setCompletedGame] = useState<boolean>(false);

  const currentItem = UNIT_ITEMS_BILINGUAL[gameIndex];

  // Auto-read logic when tab or question changes
  useEffect(() => {
    if (!autoRead) return;

    if (activeSubTab === 'learn') {
      const speechText =
        language === 'tl'
          ? `${t.unit1Title}. ${t.unit1Subtitle}`
          : `${t.unit1Title}. ${t.unit1Subtitle}`;
      speech.speak(speechText, language);
    } else if (activeSubTab === 'unpacker') {
      const speechText =
        language === 'tl'
          ? `1 Metro ay 100 sentimetro. Mayroon kang ${meterDecomp} sentimetro dagdagan ng ${100 - meterDecomp} sentimetro.`
          : `1 meter equals 100 centimeters. You have ${meterDecomp} centimeters plus ${100 - meterDecomp} centimeters.`;
      speech.speak(speechText, language);
    } else if (activeSubTab === 'game' && !completedGame && !showExplanation) {
      const speechText =
        language === 'tl'
          ? `Aling yunit ang gagamitin mo upang sukatin ang: ${currentItem.name.tl}? Sentimetro o metro?`
          : `Which unit would you use to measure: ${currentItem.name.en}? Centimeters or meters?`;
      speech.speak(speechText, language);
    }
  }, [activeSubTab, gameIndex, autoRead, language, completedGame]);

  const readAloud = (text: string) => {
    sound.playPop();
    speech.speak(text, language);
  };

  const handleAnswer = (unit: 'cm' | 'm') => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(unit);
    setShowExplanation(true);

    const isCorrect = unit === currentItem.correctUnit;
    if (isCorrect) {
      sound.playChime();
      const newScore = score + 1;
      setScore(newScore);
      onEarnStar();
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      sound.playOops();
    }

    if (autoRead) {
      const resultText = isCorrect
        ? `${t.correctCheer} ${currentItem.reason[language]}`
        : `${t.tryAgainNote} ${currentItem.reason[language]}`;
      speech.speak(resultText, language);
    }
  };

  const handleNextQuestion = () => {
    sound.playPop();
    speech.stop();
    if (gameIndex + 1 < UNIT_ITEMS_BILINGUAL.length) {
      setGameIndex(gameIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompletedGame(true);
      sound.playFanfare();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
      if (autoRead) {
        speech.speak(`${t.unitGameWinTitle} ${t.unitGameWinDesc}`, language);
      }
    }
  };

  const restartGame = () => {
    sound.playPop();
    speech.stop();
    setGameIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompletedGame(false);
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 rounded-3xl p-6 sm:p-8 border border-amber-200/60 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 tracking-wide uppercase mb-2">
            <span>{t.unit1Kicker}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {t.unit1Title}
            </h2>
            {/* Green Read-Aloud Button */}
            <button
              onClick={() => readAloud(`${t.unit1Title}. ${t.unit1Subtitle}`)}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-transform active:scale-90 cursor-pointer flex items-center justify-center shrink-0"
              title={t.readAloudBtn}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            {t.unit1Subtitle}
          </p>

          {/* Sub-navigation tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <button
              onClick={() => {
                setActiveSubTab('learn');
                sound.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'learn'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t.lessonTab}
            </button>
            <button
              onClick={() => {
                setActiveSubTab('unpacker');
                sound.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'unpacker'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t.unpackerTab}
            </button>
            <button
              onClick={() => {
                setActiveSubTab('game');
                sound.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeSubTab === 'game'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              {t.gameTab}
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: LEARN CONCEPTS */}
      {activeSubTab === 'learn' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Centimeters Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl">
                  🫐
                </div>
                {/* Green 🔊 button */}
                <button
                  onClick={() =>
                    readAloud(
                      language === 'tl'
                        ? 'Sentimetro o c-m. Ang sentimetro ay maliit! Ito ay tinatayang kasinglapad ng iyong hintuturo o maliit na blueberry. Ginagamit natin ang sentimetro para sa lapis, pambura, at aklat.'
                        : 'Centimeter, short for c-m. A centimeter is tiny! It is about the width of your index finger or a blueberry. We use centimeters to measure small things like pencils, erasers, insects, and books.'
                    )
                  }
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  title={t.readAloudBtn}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{t.readAloudBtn}</span>
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mb-1">
                {t.cmTitle} <span className="text-amber-600 font-mono">(cm)</span>
              </h3>
              <p className="text-slate-600 text-sm mb-5">{t.cmSub}</p>

              <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/70 mb-5 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  {t.cmBenchmarkLabel}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">☝️</div>
                  <div className="text-sm font-medium text-amber-950">{t.cmBenchmarkText}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase">{t.cmExamplesLabel}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span>✏️</span> <span>{language === 'tl' ? 'Lapis (mga 15 cm)' : 'Pencil (about 15 cm)'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span>🪲</span> <span>{language === 'tl' ? 'Salagubang (mga 1 cm)' : 'Ladybug (about 1 cm)'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span>🧽</span> <span>{language === 'tl' ? 'Pambura (mga 5 cm)' : 'Eraser (about 5 cm)'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span>📗</span> <span>{language === 'tl' ? 'Aklat (mga 25 cm)' : 'Storybook (about 25 cm)'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meters Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl">
                  🚪
                </div>
                {/* Green 🔊 button */}
                <button
                  onClick={() =>
                    readAloud(
                      language === 'tl'
                        ? 'Metro o m. Ang metro ay malaki! Ang isang metro ay humigit-kumulang isang malaking hakbang ng bata o taas ng gitara. Ginagamit natin ang metro para sa pinto, kotse, at palaruan.'
                        : 'Meter, short for m. A meter is big! One meter is about one giant kid step, or the length of an acoustic guitar. We use meters to measure large things like doors, cars, bedrooms, and playground slides.'
                    )
                  }
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  title={t.readAloudBtn}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{t.readAloudBtn}</span>
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mb-1">
                {t.mTitle} <span className="text-emerald-600 font-mono">(m)</span>
              </h3>
              <p className="text-slate-600 text-sm mb-5">{t.mSub}</p>

              <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/70 mb-5 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {t.mBenchmarkLabel}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎸</div>
                  <div className="text-sm font-medium text-emerald-950">{t.mBenchmarkText}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase">{t.mExamplesLabel}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span>🚪</span> <span>{language === 'tl' ? 'Pinto (mga 2 m)' : 'Door (about 2 m tall)'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span>🚗</span> <span>{language === 'tl' ? 'Kotse (mga 4 m)' : 'Family Car (about 4 m)'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span>🏫</span> <span>{language === 'tl' ? 'Silid-aralan (mga 9 m)' : 'Classroom (about 9 m)'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span>🛝</span> <span>{language === 'tl' ? 'Paus-usan (mga 3 m)' : 'Slide (about 3 m long)'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Golden Rule Highlight */}
          <div className="bg-amber-500 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.goldenRuleKicker}</span>
              </div>
              <div className="flex items-center gap-3">
                <h4 className="text-2xl sm:text-3xl font-extrabold font-display">
                  {t.goldenRuleTitle}
                </h4>
                {/* Green 🔊 button */}
                <button
                  onClick={() => readAloud(`${t.goldenRuleTitle}. ${t.goldenRuleText}`)}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                  title={t.readAloudBtn}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-amber-100 text-sm sm:text-base max-w-xl">
                {t.goldenRuleText}
              </p>
            </div>
            <button
              onClick={() => {
                setActiveSubTab('unpacker');
                sound.playPop();
              }}
              className="px-6 py-3.5 bg-white text-amber-900 hover:bg-amber-50 rounded-2xl font-extrabold text-sm shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
            >
              <span>{t.exploreUnpackerBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 1 METER UNPACKER */}
      {activeSubTab === 'unpacker' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                  {t.unpackerTitle}
                </h3>
                {/* Green 🔊 button */}
                <button
                  onClick={() =>
                    readAloud(
                      language === 'tl'
                        ? `Ang 1 metro ay katumbas ng 100 sentimetro. Sa ngayon, mayroon kang ${meterDecomp} sentimetro dagdagan ng ${100 - meterDecomp} sentimetro, na katumbas ng 100 sentimetro o 1 buong metro.`
                        : `1 meter equals 100 centimeters. Currently you have ${meterDecomp} centimeters plus ${100 - meterDecomp} centimeters, which equals 100 centimeters or 1 full meter.`
                    )
                  }
                  className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                  title={t.readAloudBtn}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-600 text-sm">{t.unpackerDesc}</p>
            </div>
          </div>

          {/* Interactive Meter Bar Model */}
          <div className="space-y-4">
            <div className="relative pt-6 pb-2">
              <div className="text-center font-bold text-slate-700 text-sm mb-2 flex items-center justify-between">
                <span>0 cm</span>
                <span className="font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                  {t.totalOneMeter}
                </span>
                <span>100 cm</span>
              </div>

              <div className="h-14 sm:h-16 w-full rounded-2xl overflow-hidden border-2 border-slate-800 flex shadow-inner relative">
                <div
                  style={{ width: `${meterDecomp}%` }}
                  className="bg-amber-400 h-full flex items-center justify-center text-amber-950 font-extrabold text-sm sm:text-base border-r-2 border-slate-800 transition-all duration-150 select-none overflow-hidden"
                >
                  {meterDecomp >= 12 && <span>{meterDecomp} cm</span>}
                </div>
                <div
                  style={{ width: `${100 - meterDecomp}%` }}
                  className="bg-teal-400 h-full flex items-center justify-center text-teal-950 font-extrabold text-sm sm:text-base transition-all duration-150 select-none overflow-hidden"
                >
                  {100 - meterDecomp >= 12 && <span>{100 - meterDecomp} cm</span>}
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
                  <span key={tick}>| {tick}</span>
                ))}
              </div>
            </div>

            {/* Slider control */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                <span>{t.sliderLabel}</span>
                <span className="font-mono text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  {meterDecomp} cm + {100 - meterDecomp} cm = 100 cm
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                step="5"
                value={meterDecomp}
                onChange={(e) => {
                  setMeterDecomp(Number(e.target.value));
                  sound.playPop();
                }}
                className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-teal-50 border border-slate-200 flex flex-wrap items-center justify-center gap-3 text-center">
              <span className="text-lg font-bold text-amber-800">{meterDecomp} cm</span>
              <span className="text-xl font-black text-slate-400">+</span>
              <span className="text-lg font-bold text-teal-800">{100 - meterDecomp} cm</span>
              <span className="text-xl font-black text-slate-400">=</span>
              <span className="text-xl font-extrabold text-slate-900 bg-white px-3 py-1 rounded-xl shadow-xs border border-slate-200">
                {t.equalsOneMeter}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: WHICH UNIT GAME */}
      {activeSubTab === 'game' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {!completedGame ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'tl' ? 'Tanong' : 'Question'} {gameIndex + 1} / {UNIT_ITEMS_BILINGUAL.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                      {t.whichUnitQuestion}
                    </h3>
                    {/* Green 🔊 button */}
                    <button
                      onClick={() =>
                        readAloud(
                          language === 'tl'
                            ? `Aling yunit ang gagamitin mo upang sukatin ang: ${currentItem.name.tl}? Sentimetro o metro?`
                            : `Which unit would you use to measure: ${currentItem.name.en}? Centimeters or meters?`
                        )
                      }
                      className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                      title={t.readAloudBtn}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">{t.scoreLabel}:</span>
                  <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-sm">
                    {score} / {UNIT_ITEMS_BILINGUAL.length}
                  </span>
                </div>
              </div>

              {/* Current Question Card */}
              <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 sm:p-10 border-2 border-dashed border-slate-200 text-center space-y-5">
                <div className="text-6xl sm:text-7xl animate-bounce duration-1000">
                  {currentItem.iconName}
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                    {currentItem.name[language]}
                  </h4>
                  <p className="text-slate-500 text-sm mt-1">
                    {language === 'tl'
                      ? 'Ito ba ay maliit tulad ng daliri, o malaki tulad ng pinto?'
                      : 'Is this small like a finger, or big like a doorway?'}
                  </p>
                </div>

                {/* The Choice Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-4">
                  {/* Option CM */}
                  <button
                    onClick={() => handleAnswer('cm')}
                    disabled={selectedAnswer !== null}
                    className={`p-5 rounded-2xl font-extrabold text-lg flex flex-col items-center gap-1 border-2 transition-all cursor-pointer ${
                      selectedAnswer === null
                        ? 'bg-amber-50/80 hover:bg-amber-100 border-amber-300 text-amber-900 hover:scale-102 active:scale-98'
                        : selectedAnswer === 'cm'
                        ? currentItem.correctUnit === 'cm'
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                          : 'bg-rose-500 text-white border-rose-600'
                        : currentItem.correctUnit === 'cm'
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                        : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="text-2xl">📏</span>
                    <span>{t.cmButton}</span>
                    <span className="text-xs font-medium opacity-80">{t.cmButtonSub}</span>
                  </button>

                  {/* Option M */}
                  <button
                    onClick={() => handleAnswer('m')}
                    disabled={selectedAnswer !== null}
                    className={`p-5 rounded-2xl font-extrabold text-lg flex flex-col items-center gap-1 border-2 transition-all cursor-pointer ${
                      selectedAnswer === null
                        ? 'bg-emerald-50/80 hover:bg-emerald-100 border-emerald-300 text-emerald-900 hover:scale-102 active:scale-98'
                        : selectedAnswer === 'm'
                        ? currentItem.correctUnit === 'm'
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                          : 'bg-rose-500 text-white border-rose-600'
                        : currentItem.correctUnit === 'm'
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                        : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="text-2xl">🌲</span>
                    <span>{t.mButton}</span>
                    <span className="text-xs font-medium opacity-80">{t.mButtonSub}</span>
                  </button>
                </div>

                {/* Explanation Reveal */}
                {showExplanation && (
                  <div
                    className={`mt-4 p-5 rounded-2xl border text-left max-w-lg mx-auto space-y-2 animate-in fade-in duration-200 ${
                      selectedAnswer === currentItem.correctUnit
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-base">
                      <div className="flex items-center gap-2">
                        {selectedAnswer === currentItem.correctUnit ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>{t.correctCheer}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-rose-500" />
                            <span>{t.tryAgainNote}</span>
                          </>
                        )}
                      </div>
                      {/* Green 🔊 button on explanation */}
                      <button
                        onClick={() => readAloud(currentItem.reason[language])}
                        className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                        title={t.readAloudBtn}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm leading-relaxed">{currentItem.reason[language]}</p>
                    <div className="text-xs font-bold opacity-75">
                      {t.typicalSizeLabel} {currentItem.typicalSize[language]}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{t.nextQuestionBtn}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-5">
              <div className="text-6xl animate-bounce">🎉</div>
              <h3 className="text-3xl font-extrabold text-slate-900 font-display">
                {t.unitGameWinTitle}
              </h3>
              <p className="text-slate-600 text-base max-w-md mx-auto">
                {t.unitGameWinDesc} ({score} / {UNIT_ITEMS_BILINGUAL.length})
              </p>
              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={restartGame}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t.playAgainBtn}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
