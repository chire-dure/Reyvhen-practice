import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { TOOL_SCENARIOS_BILINGUAL, LAB_ITEMS_BILINGUAL } from '../data/toolsData';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RefreshCw, MoveHorizontal, Check } from 'lucide-react';

interface ToolsSectionProps {
  language: AppLanguage;
  autoRead: boolean;
  onEarnStar: () => void;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({ language, autoRead, onEarnStar }) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'overview' | 'lab' | 'quiz'>('overview');

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<'ruler' | 'tape' | 'meter_stick' | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Lab State
  const [currentLabItemIndex, setCurrentLabItemIndex] = useState(0);
  const [userEnteredLength, setUserEnteredLength] = useState<string>('');
  const [labResult, setLabResult] = useState<'correct' | 'incorrect' | null>(null);
  const [rulerOffsetPx, setRulerOffsetPx] = useState(0);

  const currentScenario = TOOL_SCENARIOS_BILINGUAL[quizIndex];
  const currentLabItem = LAB_ITEMS_BILINGUAL[currentLabItemIndex];
  const CM_TO_PX = 24;

  const readAloud = (text: string) => {
    sound.playPop();
    speech.speak(text, language);
  };

  // Auto-read logic
  useEffect(() => {
    if (!autoRead) return;

    if (activeTab === 'overview') {
      speech.speak(`${t.unit2Title}. ${t.unit2Subtitle}`, language);
    } else if (activeTab === 'lab') {
      const speechText =
        language === 'tl'
          ? `${t.labItemTitle} ${currentLabItem.name.tl}. ${t.labInstruction}`
          : `${t.labItemTitle} ${currentLabItem.name.en}. ${t.labInstruction}`;
      speech.speak(speechText, language);
    } else if (activeTab === 'quiz' && !quizFinished && !selectedTool) {
      speech.speak(currentScenario.question[language], language);
    }
  }, [activeTab, quizIndex, currentLabItemIndex, autoRead, language, quizFinished]);

  const handleToolAnswer = (tool: 'ruler' | 'tape' | 'meter_stick') => {
    if (selectedTool !== null) return;
    setSelectedTool(tool);

    const isCorrect = tool === currentScenario.correctTool;
    if (isCorrect) {
      sound.playChime();
      setQuizScore((prev) => prev + 1);
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
      const speechFeedback = isCorrect
        ? `${language === 'tl' ? 'Tama!' : 'Correct!'} ${currentScenario.explanation[language]}`
        : `${language === 'tl' ? 'Magandang subok!' : 'Good try!'} ${currentScenario.explanation[language]}`;
      speech.speak(speechFeedback, language);
    }
  };

  const handleNextQuiz = () => {
    sound.playPop();
    speech.stop();
    if (quizIndex + 1 < TOOL_SCENARIOS_BILINGUAL.length) {
      setQuizIndex(quizIndex + 1);
      setSelectedTool(null);
    } else {
      setQuizFinished(true);
      sound.playFanfare();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
      if (autoRead) {
        speech.speak(`${t.toolDetectiveWinTitle} ${t.toolDetectiveWinDesc}`, language);
      }
    }
  };

  const restartQuiz = () => {
    sound.playPop();
    speech.stop();
    setQuizIndex(0);
    setSelectedTool(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const checkLabMeasurement = () => {
    const entered = parseInt(userEnteredLength.trim(), 10);
    if (isNaN(entered)) return;

    if (entered === currentLabItem.actualLengthCm) {
      setLabResult('correct');
      sound.playChime();
      onEarnStar();
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
      });
      if (autoRead) {
        speech.speak(
          `${t.labCorrectTitle} ${currentLabItem.actualLengthCm} cm! ${t.labCorrectDesc}`,
          language
        );
      }
    } else {
      setLabResult('incorrect');
      sound.playOops();
      if (autoRead) {
        speech.speak(`${t.labIncorrectTitle} ${userEnteredLength} cm. ${t.labIncorrectDesc}`, language);
      }
    }
  };

  const nextLabItem = () => {
    sound.playPop();
    setLabResult(null);
    setUserEnteredLength('');
    setRulerOffsetPx(0);
    setCurrentLabItemIndex((prev) => (prev + 1) % LAB_ITEMS_BILINGUAL.length);
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 rounded-3xl p-6 sm:p-8 border border-blue-200/60 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 tracking-wide uppercase mb-2">
            <span>{t.unit2Kicker}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {t.unit2Title}
            </h2>
            {/* Green 🔊 button */}
            <button
              onClick={() => readAloud(`${t.unit2Title}. ${t.unit2Subtitle}`)}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs cursor-pointer flex items-center justify-center shrink-0"
              title={t.readAloudBtn}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            {t.unit2Subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-6">
            <button
              onClick={() => {
                setActiveTab('overview');
                sound.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
              }`}
            >
              {t.toolMeetTab}
            </button>
            <button
              onClick={() => {
                setActiveTab('lab');
                sound.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'lab'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
              }`}
            >
              {t.toolLabTab}
            </button>
            <button
              onClick={() => {
                setActiveTab('quiz');
                sound.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
              }`}
            >
              {t.toolQuizTab}
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: MEET THE 3 TOOLS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Ruler */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mb-4">
                  📏
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-extrabold text-slate-900 font-display">{t.rulerTitle}</h3>
                  {/* Green 🔊 button */}
                  <button
                    onClick={() => readAloud(`${t.rulerTitle}. ${t.rulerDesc} ${t.rulerUsedFor}`)}
                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                    title={t.readAloudBtn}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs font-semibold text-amber-700 mb-3">{t.rulerFeature}</div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{t.rulerDesc}</p>

                <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200/60 text-xs space-y-1.5">
                  <div className="text-slate-700">{t.rulerUsedFor}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                💡 <strong>{t.rulerRule}</strong>
              </div>
            </div>

            {/* 2. Tape Measure */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-3xl mb-4">
                  🟡
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-extrabold text-slate-900 font-display">{t.tapeTitle}</h3>
                  {/* Green 🔊 button */}
                  <button
                    onClick={() => readAloud(`${t.tapeTitle}. ${t.tapeDesc} ${t.tapeUsedFor}`)}
                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                    title={t.readAloudBtn}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs font-semibold text-teal-700 mb-3">{t.tapeFeature}</div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{t.tapeDesc}</p>

                <div className="bg-teal-50 rounded-2xl p-3.5 border border-teal-200/60 text-xs space-y-1.5">
                  <div className="text-slate-700">{t.tapeUsedFor}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                💡 <strong>{t.tapeRule}</strong>
              </div>
            </div>

            {/* 3. Meter Stick */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl mb-4">
                  🪵
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-extrabold text-slate-900 font-display">{t.meterStickTitle}</h3>
                  {/* Green 🔊 button */}
                  <button
                    onClick={() => readAloud(`${t.meterStickTitle}. ${t.meterStickDesc} ${t.meterStickUsedFor}`)}
                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                    title={t.readAloudBtn}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs font-semibold text-indigo-700 mb-3">{t.meterStickFeature}</div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{t.meterStickDesc}</p>

                <div className="bg-indigo-50 rounded-2xl p-3.5 border border-indigo-200/60 text-xs space-y-1.5">
                  <div className="text-slate-700">{t.meterStickUsedFor}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                💡 <strong>{t.meterStickRule}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DRAG-AND-MEASURE LAB */}
      {activeTab === 'lab' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.labKicker} · {currentLabItemIndex + 1} / {LAB_ITEMS_BILINGUAL.length}
              </span>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                  {t.labItemTitle} {currentLabItem.name[language]}
                </h3>
                {/* Green 🔊 button */}
                <button
                  onClick={() =>
                    readAloud(
                      `${t.labItemTitle} ${currentLabItem.name[language]}. ${t.labInstruction}`
                    )
                  }
                  className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                  title={t.readAloudBtn}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm">{t.labInstruction}</p>
            </div>
          </div>

          {/* Virtual Workbench Area */}
          <div className="bg-slate-50/90 rounded-3xl p-6 border-2 border-slate-200/80 overflow-x-auto">
            <div className="min-w-[620px] max-w-[750px] mx-auto space-y-8 select-none">
              {/* Target Object Stage */}
              <div className="h-28 flex items-center relative pl-8">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-red-400 z-10">
                  <span className="absolute -top-5 -left-4 text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded">
                    0 cm
                  </span>
                </div>

                <div
                  style={{
                    width: `${currentLabItem.actualLengthCm * CM_TO_PX}px`,
                    marginLeft: '0px',
                  }}
                  className="h-16 rounded-xl flex items-center justify-between px-3 shadow-md border-2 border-slate-800 transition-all duration-200 relative group"
                >
                  <div
                    className="absolute inset-0 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                    style={{ backgroundColor: currentLabItem.color }}
                  >
                    <span className="drop-shadow-sm font-display">
                      {currentLabItem.name[language]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Virtual Ruler with draggable / slide controls */}
              <div className="relative pl-8 pt-2">
                <div
                  style={{ transform: `translateX(${rulerOffsetPx}px)` }}
                  className="h-20 bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-900/60 rounded-xl shadow-lg relative flex flex-col justify-between overflow-hidden transition-transform duration-100"
                >
                  <div className="relative flex h-full items-start px-0">
                    {Array.from({ length: 26 }).map((_, cm) => (
                      <div
                        key={cm}
                        style={{ width: `${CM_TO_PX}px` }}
                        className="h-full shrink-0 relative flex flex-col items-start border-l border-amber-950/70"
                      >
                        <div className="h-6 w-full flex items-start">
                          <span className="text-[11px] font-extrabold font-mono text-amber-950 -ml-1 mt-6">
                            {cm}
                          </span>
                        </div>
                        <div className="absolute left-[12px] top-0 h-3.5 border-l border-amber-900/40" />
                      </div>
                    ))}
                  </div>

                  <div className="px-3 pb-1 text-[10px] font-bold text-amber-900 flex justify-between items-center opacity-75">
                    <span>CENTIMETERS (cm)</span>
                    <span>STUDENT RULER (30 cm)</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MoveHorizontal className="w-4 h-4 text-slate-400" />
                    <span>{t.slideRuler}</span>
                    <button
                      onClick={() => {
                        setRulerOffsetPx((prev) => Math.max(-50, prev - 10));
                        sound.playPop();
                      }}
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 font-bold cursor-pointer"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => {
                        setRulerOffsetPx(0);
                        sound.playPop();
                      }}
                      className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-bold hover:bg-amber-200 cursor-pointer"
                    >
                      0 cm
                    </button>
                    <button
                      onClick={() => {
                        setRulerOffsetPx((prev) => Math.min(80, prev + 10));
                        sound.playPop();
                      }}
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 font-bold cursor-pointer"
                    >
                      →
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {rulerOffsetPx === 0
                      ? t.alignedPerfect
                      : `${Math.round(rulerOffsetPx / CM_TO_PX)} cm ${t.shiftedLabel}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-slate-800 text-sm sm:text-base">
                  {t.whatLength}
                </span>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    placeholder="?"
                    value={userEnteredLength}
                    onChange={(e) => {
                      setUserEnteredLength(e.target.value);
                      setLabResult(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') checkLabMeasurement();
                    }}
                    className="w-20 text-center font-extrabold text-xl py-2 px-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none tabular-nums bg-white"
                  />
                  <span className="absolute -top-2.5 -right-2 bg-blue-100 text-blue-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-200">
                    cm
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={checkLabMeasurement}
                  disabled={!userEnteredLength}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{t.checkAnswerBtn}</span>
                </button>

                <button
                  onClick={nextLabItem}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>{t.nextItemBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Feedback Alert */}
            {labResult && (
              <div
                className={`mt-4 p-4 rounded-2xl max-w-md mx-auto text-center border animate-in fade-in duration-200 ${
                  labResult === 'correct'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {labResult === 'correct' ? (
                  <div className="space-y-1">
                    <div className="font-extrabold text-base flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>
                        {t.labCorrectTitle} {currentLabItem.actualLengthCm} cm!
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700">{t.labCorrectDesc}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="font-extrabold text-base flex items-center justify-center gap-2">
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>
                        {t.labIncorrectTitle} {userEnteredLength} cm.
                      </span>
                    </div>
                    <p className="text-xs text-rose-700">{t.labIncorrectDesc}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TOOL DETECTIVE QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {!quizFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'tl' ? 'Tanong' : 'Question'} {quizIndex + 1} / {TOOL_SCENARIOS_BILINGUAL.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                      {t.toolQuizTitle}
                    </h3>
                    {/* Green 🔊 button */}
                    <button
                      onClick={() => readAloud(currentScenario.question[language])}
                      className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                      title={t.readAloudBtn}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">{t.scoreLabel}:</span>
                  <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-900 font-extrabold text-sm">
                    {quizScore} / {TOOL_SCENARIOS_BILINGUAL.length}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 text-center space-y-4">
                <div className="text-6xl animate-bounce duration-1000">
                  {currentScenario.iconName}
                </div>
                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display max-w-xl mx-auto leading-snug">
                  {currentScenario.question[language]}
                </h4>

                {/* 3 Tool Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
                  {/* Ruler */}
                  <button
                    onClick={() => handleToolAnswer('ruler')}
                    disabled={selectedTool !== null}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      selectedTool === null
                        ? 'bg-white hover:bg-amber-50 border-amber-200 text-slate-800 hover:scale-102'
                        : selectedTool === 'ruler'
                        ? currentScenario.correctTool === 'ruler'
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                          : 'bg-rose-500 text-white border-rose-600'
                        : currentScenario.correctTool === 'ruler'
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                        : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="text-3xl">📏</span>
                    <span className="font-extrabold text-base">30 cm Ruler</span>
                    <span className="text-[11px] opacity-75">{t.cmButtonSub}</span>
                  </button>

                  {/* Tape Measure */}
                  <button
                    onClick={() => handleToolAnswer('tape')}
                    disabled={selectedTool !== null}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      selectedTool === null
                        ? 'bg-white hover:bg-teal-50 border-teal-200 text-slate-800 hover:scale-102'
                        : selectedTool === 'tape'
                        ? currentScenario.correctTool === 'tape'
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                          : 'bg-rose-500 text-white border-rose-600'
                        : currentScenario.correctTool === 'tape'
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                        : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="text-3xl">🟡</span>
                    <span className="font-extrabold text-base">{language === 'tl' ? 'Tape Measure (Medida)' : 'Tape Measure'}</span>
                    <span className="text-[11px] opacity-75">{language === 'tl' ? 'Pabilog o mahaba' : 'Curved / round / long'}</span>
                  </button>

                  {/* Meter Stick */}
                  <button
                    onClick={() => handleToolAnswer('meter_stick')}
                    disabled={selectedTool !== null}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      selectedTool === null
                        ? 'bg-white hover:bg-indigo-50 border-indigo-200 text-slate-800 hover:scale-102'
                        : selectedTool === 'meter_stick'
                        ? currentScenario.correctTool === 'meter_stick'
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                          : 'bg-rose-500 text-white border-rose-600'
                        : currentScenario.correctTool === 'meter_stick'
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                        : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="text-3xl">🪵</span>
                    <span className="font-extrabold text-base">Meter Stick</span>
                    <span className="text-[11px] opacity-75">{language === 'tl' ? 'Tuwid na 100 cm' : 'Straight 100 cm items'}</span>
                  </button>
                </div>

                {/* Feedback */}
                {selectedTool && (
                  <div
                    className={`mt-4 p-5 rounded-2xl border text-left max-w-xl mx-auto space-y-2 animate-in fade-in duration-200 ${
                      selectedTool === currentScenario.correctTool
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-base">
                      <div className="flex items-center gap-2">
                        {selectedTool === currentScenario.correctTool ? (
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
                        onClick={() => readAloud(currentScenario.explanation[language])}
                        className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                        title={t.readAloudBtn}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm leading-relaxed">{currentScenario.explanation[language]}</p>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleNextQuiz}
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
              <div className="text-6xl animate-bounce">🏆</div>
              <h3 className="text-3xl font-extrabold text-slate-900 font-display">
                {t.toolDetectiveWinTitle}
              </h3>
              <p className="text-slate-600 text-base max-w-md mx-auto">
                {t.toolDetectiveWinDesc} ({quizScore} / {TOOL_SCENARIOS_BILINGUAL.length})
              </p>
              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={restartQuiz}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
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
