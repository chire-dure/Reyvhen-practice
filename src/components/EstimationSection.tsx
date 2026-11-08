import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { ESTIMATION_ITEMS_BILINGUAL } from '../data/estimationData';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, ArrowRight, RefreshCw, Eye } from 'lucide-react';

interface EstimationSectionProps {
  language: AppLanguage;
  autoRead: boolean;
  onEarnStar: () => void;
}

export const EstimationSection: React.FC<EstimationSectionProps> = ({
  language,
  autoRead,
  onEarnStar,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'game'>('benchmarks');
  const [itemIndex, setItemIndex] = useState(0);
  const [userGuess, setUserGuess] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [gameDone, setGameDone] = useState(false);

  const currentItem = ESTIMATION_ITEMS_BILINGUAL[itemIndex];

  const readAloud = (text: string) => {
    sound.playPop();
    speech.speak(text, language);
  };

  // Auto-read logic
  useEffect(() => {
    if (!autoRead) return;

    if (activeTab === 'benchmarks') {
      speech.speak(`${t.unit3Title}. ${t.unit3Subtitle}`, language);
    } else if (activeTab === 'game' && !gameDone && !isRevealed) {
      const speechText =
        language === 'tl'
          ? `Tantiyahin ang haba ng ${currentItem.name.tl}. ${currentItem.benchmarkHint.tl}`
          : `Estimate the length of ${currentItem.name.en}. ${currentItem.benchmarkHint.en}`;
      speech.speak(speechText, language);
    }
  }, [activeTab, itemIndex, autoRead, language, gameDone]);

  const handleSelectGuess = (val: number) => {
    if (isRevealed) return;
    setUserGuess(val);
    sound.playPop();
  };

  const handleReveal = () => {
    if (userGuess === null) return;
    setIsRevealed(true);

    const isExact = userGuess === currentItem.actualValue;
    if (isExact) {
      sound.playChime();
      setScore((prev) => prev + 1);
      onEarnStar();
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      sound.playOops();
    }

    if (autoRead) {
      const speechFeedback = isExact
        ? `${t.bullseyeTitle} ${currentItem.benchmarkHint[language]}`
        : `${t.closeGuessTitle} ${currentItem.actualValue} ${currentItem.unit}. ${currentItem.benchmarkHint[language]}`;
      speech.speak(speechFeedback, language);
    }
  };

  const handleNext = () => {
    sound.playPop();
    speech.stop();
    if (itemIndex + 1 < ESTIMATION_ITEMS_BILINGUAL.length) {
      setItemIndex(itemIndex + 1);
      setUserGuess(null);
      setIsRevealed(false);
    } else {
      setGameDone(true);
      sound.playFanfare();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
      if (autoRead) {
        speech.speak(`${t.estChampionTitle} ${t.estChampionDesc}`, language);
      }
    }
  };

  const handleRestart = () => {
    sound.playPop();
    speech.stop();
    setItemIndex(0);
    setUserGuess(null);
    setIsRevealed(false);
    setScore(0);
    setGameDone(false);
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 rounded-3xl p-6 sm:p-8 border border-purple-200/60 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 tracking-wide uppercase mb-2">
            <span>{t.unit3Kicker}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {t.unit3Title}
            </h2>
            {/* Green 🔊 button */}
            <button
              onClick={() => readAloud(`${t.unit3Title}. ${t.unit3Subtitle}`)}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs cursor-pointer flex items-center justify-center shrink-0"
              title={t.readAloudBtn}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            {t.unit3Subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-6">
            <button
              onClick={() => {
                setActiveTab('benchmarks');
                sound.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'benchmarks'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
              }`}
            >
              {t.benchmarksTab}
            </button>
            <button
              onClick={() => {
                setActiveTab('game');
                sound.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'game'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
              }`}
            >
              {t.estGameTab}
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: BENCHMARKS */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                    {t.benchmarksHeader}
                  </h3>
                  {/* Green 🔊 button */}
                  <button
                    onClick={() => readAloud(`${t.benchmarksHeader}. ${t.benchmarksDesc}`)}
                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                    title={t.readAloudBtn}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-600 text-sm">{t.benchmarksDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/70 text-center space-y-2">
                <div className="text-4xl">💅</div>
                <div className="font-extrabold text-lg text-amber-950 font-display">
                  {language === 'tl' ? 'Tinatayang 1 cm' : 'About 1 cm'}
                </div>
                <div className="text-xs font-semibold text-amber-800">
                  {language === 'tl' ? 'Lapad ng Kuko' : 'Fingernail Width'}
                </div>
                <p className="text-xs text-slate-600">
                  {language === 'tl'
                    ? 'Ang lapad ng iyong hintuturo o kuko sa hinliliit ay mga 1 sentimetro.'
                    : 'The width of your index finger or pinky nail is roughly 1 centimeter.'}
                </p>
              </div>

              <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-200/70 text-center space-y-2">
                <div className="text-4xl">📎</div>
                <div className="font-extrabold text-lg text-blue-950 font-display">
                  {language === 'tl' ? 'Tinatayang 3 cm' : 'About 3 cm'}
                </div>
                <div className="text-xs font-semibold text-blue-800">
                  {language === 'tl' ? 'Karaniwang Paperclip' : 'Standard Paperclip'}
                </div>
                <p className="text-xs text-slate-600">
                  {language === 'tl'
                    ? 'Ang maliit na pilak na paperclip ay halos eksaktong 3 sentimetro ang haba.'
                    : 'A small silver paperclip is almost exactly 3 centimeters long.'}
                </p>
              </div>

              <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200/70 text-center space-y-2">
                <div className="text-4xl">🖍️</div>
                <div className="font-extrabold text-lg text-emerald-950 font-display">
                  {language === 'tl' ? 'Tinatayang 10 cm' : 'About 10 cm'}
                </div>
                <div className="text-xs font-semibold text-emerald-800">
                  {language === 'tl' ? 'Bagong Krayola' : 'Brand New Crayon'}
                </div>
                <p className="text-xs text-slate-600">
                  {language === 'tl'
                    ? 'Ang bagong krayola o patpat ng popsicle ay humigit-kumulang 9 hanggang 10 sentimetro.'
                    : 'A new crayon or popsicle stick is around 9 to 10 centimeters long.'}
                </p>
              </div>

              <div className="bg-purple-50/60 rounded-2xl p-5 border border-purple-200/70 text-center space-y-2">
                <div className="text-4xl">🚪</div>
                <div className="font-extrabold text-lg text-purple-950 font-display">
                  {language === 'tl' ? 'Tinatayang 1 Metro' : 'About 1 Meter'}
                </div>
                <div className="text-xs font-semibold text-purple-800">
                  {language === 'tl' ? 'Sahig Hanggang Hawakan ng Pinto' : 'Floor to Doorknob'}
                </div>
                <p className="text-xs text-slate-600">
                  {language === 'tl'
                    ? 'Mula sa sahig hanggang sa hawakan ng pinto ay halos eksaktong 1 metro!'
                    : 'Standing up, the height from the floor to the doorknob is almost exactly 1 meter!'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.unit3Kicker}</span>
              </div>
              <div className="flex items-center gap-3">
                <h4 className="text-2xl sm:text-3xl font-extrabold font-display">
                  {t.secretHeader}
                </h4>
                {/* Green 🔊 button */}
                <button
                  onClick={() => readAloud(`${t.secretHeader}. ${t.secretDesc}`)}
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs cursor-pointer"
                  title={t.readAloudBtn}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-purple-100 text-sm max-w-xl leading-relaxed">
                {t.secretDesc}
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('game');
                sound.playPop();
              }}
              className="px-6 py-3.5 bg-white text-purple-900 hover:bg-purple-50 rounded-2xl font-extrabold text-sm shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
            >
              <span>{t.estGameTab}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ESTIMATION GAME */}
      {activeTab === 'game' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {!gameDone ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'tl' ? 'Bagay' : 'Item'} {itemIndex + 1} / {ESTIMATION_ITEMS_BILINGUAL.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                      {t.estimateQuestion} ({currentItem.unit})!
                    </h3>
                    {/* Green 🔊 button */}
                    <button
                      onClick={() =>
                        readAloud(
                          language === 'tl'
                            ? `Tantiyahin ang haba ng ${currentItem.name.tl}. ${currentItem.benchmarkHint.tl}`
                            : `Estimate the length of ${currentItem.name.en}. ${currentItem.benchmarkHint.en}`
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
                  <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-900 font-extrabold text-sm">
                    {score} / {ESTIMATION_ITEMS_BILINGUAL.length}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50/90 rounded-3xl p-6 sm:p-8 border-2 border-dashed border-purple-200 text-center space-y-4">
                <div className="text-7xl animate-pulse">{currentItem.icon}</div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                    {currentItem.name[language]}
                  </h4>
                  <p className="text-slate-600 text-sm mt-1">{currentItem.visualDescription[language]}</p>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    {t.estimateQuestion} ({currentItem.unit}):
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                    {currentItem.options.map((opt) => {
                      const isSelected = userGuess === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectGuess(opt)}
                          disabled={isRevealed}
                          className={`p-4 rounded-2xl font-extrabold text-lg sm:text-xl border-2 transition-all cursor-pointer flex flex-col items-center ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105'
                              : 'bg-white hover:bg-purple-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          <span>
                            {opt} {currentItem.unit}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!isRevealed && (
                  <div className="pt-4">
                    <button
                      onClick={handleReveal}
                      disabled={userGuess === null}
                      className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{t.rollOutTapeBtn}</span>
                    </button>
                  </div>
                )}

                {isRevealed && (
                  <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 animate-in fade-in duration-300">
                    <div className="bg-amber-100 border-2 border-amber-900/60 rounded-xl p-4 max-w-md mx-auto flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-2 font-mono text-sm font-extrabold text-amber-950">
                        <span>0 {currentItem.unit}</span>
                        <div className="h-0.5 w-24 sm:w-36 bg-amber-950/40 border-b border-dashed border-amber-900" />
                        <span className="bg-amber-400 px-2 py-0.5 rounded text-amber-950 text-base font-black">
                          {currentItem.actualValue} {currentItem.unit}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-amber-900 uppercase">
                        {language === 'tl' ? 'Tunay na Sukat' : 'Actual Size'}
                      </span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl border max-w-md mx-auto text-left space-y-1 ${
                        userGuess === currentItem.actualValue
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="flex items-center justify-between font-extrabold text-base">
                        <span>
                          {userGuess === currentItem.actualValue
                            ? t.bullseyeTitle
                            : `${t.closeGuessTitle} ${currentItem.actualValue} ${currentItem.unit}.`}
                        </span>
                        {/* Green 🔊 button on feedback */}
                        <button
                          onClick={() => readAloud(currentItem.benchmarkHint[language])}
                          className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                          title={t.readAloudBtn}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-700">
                        {currentItem.benchmarkHint[language]}
                      </p>
                    </div>

                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={handleNext}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span>{t.nextItemBtn}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-5">
              <div className="text-6xl animate-bounce">🎯</div>
              <h3 className="text-3xl font-extrabold text-slate-900 font-display">
                {t.estChampionTitle}
              </h3>
              <p className="text-slate-600 text-base max-w-md mx-auto">
                {t.estChampionDesc} ({score} / {ESTIMATION_ITEMS_BILINGUAL.length})
              </p>
              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
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
