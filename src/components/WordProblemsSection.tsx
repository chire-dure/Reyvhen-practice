import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { WORD_PROBLEMS_BILINGUAL } from '../data/wordProblemsData';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Volume2, HelpCircle, Check, ArrowRight, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface WordProblemsSectionProps {
  language: AppLanguage;
  autoRead: boolean;
  onEarnStar: () => void;
}

export const WordProblemsSection: React.FC<WordProblemsSectionProps> = ({
  language,
  autoRead,
  onEarnStar,
}) => {
  const t = TRANSLATIONS[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [allFinished, setAllFinished] = useState<boolean>(false);

  const problem = WORD_PROBLEMS_BILINGUAL[currentIndex];

  const readAloud = (text: string) => {
    sound.playPop();
    speech.speak(text, language);
  };

  // Auto-read logic
  useEffect(() => {
    if (!autoRead) return;

    if (!allFinished && !isSubmitted) {
      const speechText = `${problem.title[language]}. ${problem.story[language]}`;
      speech.speak(speechText, language);
    }
  }, [currentIndex, autoRead, language, allFinished]);

  const handleKeypadPress = (digit: string) => {
    sound.playPop();
    if (isSubmitted && isCorrect) return;
    if (digit === 'C') {
      setUserAnswer('');
    } else if (digit === 'DEL') {
      setUserAnswer((prev) => prev.slice(0, -1));
    } else {
      if (userAnswer.length < 3) {
        setUserAnswer((prev) => prev + digit);
      }
    }
  };

  const handleCheckAnswer = () => {
    const val = parseInt(userAnswer.trim(), 10);
    if (isNaN(val)) return;

    setIsSubmitted(true);
    const correct = val === problem.correctAnswer;
    if (correct) {
      setIsCorrect(true);
      sound.playChime();
      setSolvedCount((prev) => prev + 1);
      onEarnStar();
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setIsCorrect(false);
      sound.playOops();
    }

    if (autoRead) {
      const speechFeedback = correct
        ? `${t.storySolvedTitle} ${problem.stepExplanation[language]}`
        : `${t.storyTryAgain} ${problem.hint[language]}`;
      speech.speak(speechFeedback, language);
    }
  };

  const handleNextProblem = () => {
    sound.playPop();
    speech.stop();
    if (currentIndex + 1 < WORD_PROBLEMS_BILINGUAL.length) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer('');
      setShowHint(false);
      setIsSubmitted(false);
      setIsCorrect(false);
    } else {
      setAllFinished(true);
      sound.playFanfare();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
      if (autoRead) {
        speech.speak(`${t.storyMasterTitle} ${t.storyMasterDesc}`, language);
      }
    }
  };

  const restartAll = () => {
    sound.playPop();
    speech.stop();
    setCurrentIndex(0);
    setUserAnswer('');
    setShowHint(false);
    setIsSubmitted(false);
    setIsCorrect(false);
    setSolvedCount(0);
    setAllFinished(false);
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-3xl p-6 sm:p-8 border border-emerald-200/60 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 tracking-wide uppercase mb-2">
            <span>{t.unit4Kicker}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {t.unit4Title}
            </h2>
            {/* Green 🔊 button */}
            <button
              onClick={() => readAloud(`${t.unit4Title}. ${t.unit4Subtitle}`)}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs cursor-pointer flex items-center justify-center shrink-0"
              title={t.readAloudBtn}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            {t.unit4Subtitle}
          </p>
        </div>
      </div>

      {!allFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story & Model Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'tl' ? 'Suliranin' : 'Story'} {currentIndex + 1} / {WORD_PROBLEMS_BILINGUAL.length}
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                    {problem.title[language]}
                  </h3>
                  {/* Green 🔊 button */}
                  <button
                    onClick={() => readAloud(problem.story[language])}
                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                    title={t.readAloudBtn}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Story Box */}
            <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80">
              <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
                &ldquo;{problem.story[language]}&rdquo;
              </p>
            </div>

            {/* Visual Tape Diagram Bar Model */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.tapeModelLabel}</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {problem.operation === '+' ? t.partPartWhole : t.wholeMinusPart}
                </span>
              </div>

              <div className="p-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-slate-200 space-y-4">
                {problem.barModelType === 'part-part-whole' && (
                  <div className="space-y-2">
                    <div className="flex rounded-xl overflow-hidden border-2 border-slate-800 h-12 shadow-sm font-extrabold text-xs sm:text-sm">
                      <div
                        style={{ width: `${(problem.partA / (problem.partA + problem.partB)) * 100}%` }}
                        className="bg-amber-300 text-amber-950 flex items-center justify-center border-r-2 border-slate-800"
                      >
                        {problem.partA} {problem.unit}
                      </div>
                      <div
                        style={{ width: `${(problem.partB / (problem.partA + problem.partB)) * 100}%` }}
                        className="bg-teal-300 text-teal-950 flex items-center justify-center"
                      >
                        {problem.partB} {problem.unit}
                      </div>
                    </div>
                    <div className="text-center font-extrabold text-sm text-slate-800">
                      {language === 'tl' ? 'Kabuuang Haba =' : 'Total Length ='} <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">? {problem.unit}</span>
                    </div>
                  </div>
                )}

                {problem.barModelType === 'take-away' && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-600 text-center">
                      {language === 'tl' ? 'Kabuuan =' : 'Total ='} {problem.partA} {problem.unit}
                    </div>
                    <div className="flex rounded-xl overflow-hidden border-2 border-slate-800 h-12 shadow-sm font-extrabold text-xs sm:text-sm">
                      <div
                        style={{ width: `${(problem.partB / problem.partA) * 100}%` }}
                        className="bg-rose-300 text-rose-950 flex items-center justify-center border-r-2 border-slate-800"
                      >
                        {language === 'tl' ? 'Pinutol:' : 'Cut:'} {problem.partB} {problem.unit}
                      </div>
                      <div
                        style={{ width: `${((problem.partA - problem.partB) / problem.partA) * 100}%` }}
                        className="bg-emerald-200 text-emerald-950 flex items-center justify-center font-black"
                      >
                        {language === 'tl' ? 'Natira: ?' : 'Left: ?'} {problem.unit}
                      </div>
                    </div>
                  </div>
                )}

                {problem.barModelType === 'comparison' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-xs font-bold text-slate-600">Sammy:</span>
                      <div className="h-9 w-full bg-indigo-300 rounded-lg border-2 border-slate-800 flex items-center px-3 font-extrabold text-xs text-indigo-950">
                        {problem.partA} {problem.unit}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-xs font-bold text-slate-600">Toby:</span>
                      <div
                        style={{ width: `${(problem.partB / problem.partA) * 100}%` }}
                        className="h-9 bg-amber-300 rounded-lg border-2 border-slate-800 flex items-center px-3 font-extrabold text-xs text-amber-950 shrink-0"
                      >
                        {problem.partB} {problem.unit}
                      </div>
                      <span className="text-xs font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {language === 'tl' ? 'Pagkakaiba = ?' : 'Difference = ?'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hint Accordion */}
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowHint(!showHint);
                    sound.playPop();
                  }}
                  className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>{showHint ? t.hideHintBtn : t.hintBtn}</span>
                </button>
                {showHint && (
                  <button
                    onClick={() => readAloud(problem.hint[language])}
                    className="p-1 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                    title={t.readAloudBtn}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {showHint && (
                <div className="mt-2 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 leading-relaxed animate-in fade-in duration-150">
                  {problem.hint[language]}
                </div>
              )}
            </div>
          </div>

          {/* Keypad & Answer Column (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h4 className="text-lg font-extrabold text-slate-900 font-display">
                {t.solutionBoxTitle}
              </h4>
              <p className="text-slate-500 text-xs">{t.solutionBoxDesc}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">{t.answerLabel}</span>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-3xl font-mono text-slate-900 min-w-16 text-right">
                  {userAnswer || '_'}
                </span>
                <span className="font-bold text-base text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200">
                  {problem.unit}
                </span>
              </div>
            </div>

            {/* Child-Friendly Touch Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleKeypadPress(btn)}
                  className={`py-3.5 rounded-xl font-extrabold text-lg transition-all cursor-pointer ${
                    btn === 'C' || btn === 'DEL'
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm'
                      : 'bg-white hover:bg-emerald-50 text-slate-900 border border-slate-200 shadow-xs hover:border-emerald-300'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>

            {/* Check Button */}
            <div className="pt-2">
              <button
                onClick={handleCheckAnswer}
                disabled={!userAnswer}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-base shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>{t.checkStoryBtn}</span>
              </button>
            </div>

            {/* Feedback Callout */}
            {isSubmitted && (
              <div
                className={`p-4 rounded-2xl border animate-in fade-in duration-200 space-y-2 ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center justify-between font-extrabold text-base">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>{t.storySolvedTitle}</span>
                      </>
                    ) : (
                      <span>{t.storyTryAgain}</span>
                    )}
                  </div>
                  {/* Green 🔊 button on feedback */}
                  <button
                    onClick={() =>
                      readAloud(isCorrect ? problem.stepExplanation[language] : problem.hint[language])
                    }
                    className="p-1 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                    title={t.readAloudBtn}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {isCorrect && (
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    {problem.stepExplanation[language]}
                  </p>
                )}

                {isCorrect && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextProblem}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{t.nextStoryBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center space-y-5">
          <div className="text-6xl animate-bounce">🎖️</div>
          <h3 className="text-3xl font-extrabold text-slate-900 font-display">
            {t.storyMasterTitle}
          </h3>
          <p className="text-slate-600 text-base max-w-md mx-auto">
            {t.storyMasterDesc} ({solvedCount} / {WORD_PROBLEMS_BILINGUAL.length})
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={restartAll}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.playAgainBtn}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
