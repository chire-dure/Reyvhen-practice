import React, { useState, useEffect } from 'react';
import { AppLanguage, HopStep } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { NUMBER_LINE_CHALLENGES_BILINGUAL } from '../data/numberLineData';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Volume2, RotateCcw, CheckCircle2, ArrowRight, Wand2 } from 'lucide-react';

interface NumberLineSectionProps {
  language: AppLanguage;
  autoRead: boolean;
  onEarnStar: () => void;
}

export const NumberLineSection: React.FC<NumberLineSectionProps> = ({
  language,
  autoRead,
  onEarnStar,
}) => {
  const t = TRANSLATIONS[language];
  const [mode, setMode] = useState<'challenges' | 'sandbox'>('challenges');
  const [challengeIndex, setChallengeIndex] = useState(0);

  const [startNum, setStartNum] = useState<number>(38);
  const [subNum, setSubNum] = useState<number>(14);

  const [currentPos, setCurrentPos] = useState<number>(38);
  const [hops, setHops] = useState<HopStep[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentChallenge = NUMBER_LINE_CHALLENGES_BILINGUAL[challengeIndex];
  const targetAnswer = startNum - subNum;
  const totalSubtractedSoFar = hops.reduce((acc, h) => acc + h.amount, 0);

  const readAloud = (text: string) => {
    sound.playPop();
    speech.speak(text, language);
  };

  const loadChallenge = (idx: number) => {
    const c = NUMBER_LINE_CHALLENGES_BILINGUAL[idx];
    setChallengeIndex(idx);
    setStartNum(c.start);
    setSubNum(c.subtract);
    setCurrentPos(c.start);
    setHops([]);
    setIsCompleted(false);
  };

  // Auto-read logic
  useEffect(() => {
    if (!autoRead) return;

    if (mode === 'challenges' && !isCompleted) {
      const speechText = `${currentChallenge.title[language]}. ${currentChallenge.description[language]}`;
      speech.speak(speechText, language);
    } else if (mode === 'sandbox' && !isCompleted) {
      const speechText = `${startNum} bawas ${subNum}. Magsimula sa ${startNum}. Lumukso pabalik.`;
      speech.speak(speechText, language);
    }
  }, [mode, challengeIndex, autoRead, language]);

  const hopBack = (amount: number) => {
    if (currentPos - amount < 0) return;
    sound.playHop();

    const from = currentPos;
    const to = currentPos - amount;
    const newHop: HopStep = {
      from,
      to,
      amount,
      label: `-${amount}`,
    };

    const newHops = [...hops, newHop];
    setHops(newHops);
    setCurrentPos(to);

    const nextTotalSub = newHops.reduce((acc, h) => acc + h.amount, 0);
    if (nextTotalSub === subNum && to === targetAnswer) {
      setIsCompleted(true);
      sound.playChime();
      onEarnStar();
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
      });
      if (autoRead) {
        speech.speak(`${t.landedExactTitle} ${targetAnswer}! ${t.landedExactDesc}`, language);
      }
    }
  };

  const undoLastHop = () => {
    if (hops.length === 0) return;
    sound.playPop();
    const last = hops[hops.length - 1];
    setHops(hops.slice(0, -1));
    setCurrentPos(last.from);
    setIsCompleted(false);
  };

  const resetHops = () => {
    sound.playPop();
    setCurrentPos(startNum);
    setHops([]);
    setIsCompleted(false);
  };

  const autoSolveStepByStep = () => {
    resetHops();
    sound.playPop();

    const tens = Math.floor(subNum / 10);
    const ones = subNum % 10;

    const plannedHops: number[] = [];
    for (let i = 0; i < tens; i++) plannedHops.push(10);
    if (ones > 0) {
      if (ones >= 5 && ones !== 5) {
        plannedHops.push(5);
        for (let j = 0; j < ones - 5; j++) plannedHops.push(1);
      } else {
        for (let j = 0; j < ones; j++) plannedHops.push(1);
      }
    }

    let delay = 300;
    let tempPos = startNum;
    const builtHops: HopStep[] = [];

    plannedHops.forEach((h, idx) => {
      setTimeout(() => {
        sound.playHop();
        const from = tempPos;
        const to = tempPos - h;
        tempPos = to;
        builtHops.push({
          from,
          to,
          amount: h,
          label: `-${h}`,
        });
        setCurrentPos(to);
        setHops([...builtHops]);

        if (idx === plannedHops.length - 1) {
          setIsCompleted(true);
          sound.playChime();
          if (autoRead) {
            speech.speak(`${t.landedExactTitle} ${to}! ${t.landedExactDesc}`, language);
          }
        }
      }, delay);
      delay += 450;
    });
  };

  const lineMin = Math.max(0, Math.min(targetAnswer - 5, ...hops.map((h) => h.to), currentPos - 5));
  const lineMax = Math.max(startNum + 5, ...hops.map((h) => h.from), 30);
  const rangeSpan = Math.max(20, lineMax - lineMin);

  const getXPercent = (num: number) => {
    return Math.max(4, Math.min(96, ((num - lineMin) / rangeSpan) * 92 + 4));
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 rounded-3xl p-6 sm:p-8 border border-emerald-200/60 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 tracking-wide uppercase mb-2">
            <span>{t.unit5Kicker}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {t.unit5Title}
            </h2>
            {/* Green 🔊 button */}
            <button
              onClick={() => readAloud(`${t.unit5Title}. ${t.unit5Subtitle}`)}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs cursor-pointer flex items-center justify-center shrink-0"
              title={t.readAloudBtn}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            {t.unit5Subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-6">
            <button
              onClick={() => {
                setMode('challenges');
                loadChallenge(0);
                sound.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                mode === 'challenges'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              {t.questTab}
            </button>
            <button
              onClick={() => {
                setMode('sandbox');
                setStartNum(54);
                setSubNum(23);
                setCurrentPos(54);
                setHops([]);
                setIsCompleted(false);
                sound.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                mode === 'sandbox'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              {t.sandboxTab}
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            {mode === 'challenges' ? (
              <>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'tl' ? 'Hamon' : 'Challenge'} {challengeIndex + 1} / {NUMBER_LINE_CHALLENGES_BILINGUAL.length}
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                    {startNum} - {subNum} = ?
                  </h3>
                  {/* Green 🔊 button */}
                  <button
                    onClick={() =>
                      readAloud(
                        `${currentChallenge.title[language]}. ${currentChallenge.description[language]}`
                      )
                    }
                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                    title={t.readAloudBtn}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.sandboxTab}
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                    {startNum} - {subNum} = ?
                  </h3>
                  {/* Green 🔊 button */}
                  <button
                    onClick={() =>
                      readAloud(
                        language === 'tl'
                          ? `Lutasin ang ${startNum} bawas ${subNum}. Magsimula sa ${startNum} at lumukso pabalik.`
                          : `Solve ${startNum} minus ${subNum}. Start at ${startNum} and hop backwards.`
                      )
                    }
                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
                    title={t.readAloudBtn}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {mode === 'challenges' && (
              <div className="flex items-center gap-1">
                {NUMBER_LINE_CHALLENGES_BILINGUAL.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      loadChallenge(i);
                      sound.playPop();
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      i === challengeIndex
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sandbox Custom Inputs */}
        {mode === 'sandbox' && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-4 text-sm font-bold text-slate-800">
            <span>{t.sandboxIntro}</span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">{t.startNumLabel}</label>
              <input
                type="number"
                min="10"
                max="99"
                value={startNum}
                onChange={(e) => {
                  const val = Math.max(5, Math.min(99, Number(e.target.value) || 0));
                  setStartNum(val);
                  setCurrentPos(val);
                  setHops([]);
                  setIsCompleted(false);
                }}
                className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-center font-bold font-mono"
              />
            </div>
            <span className="text-lg">-</span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">{t.subtractLabel}</label>
              <input
                type="number"
                min="1"
                max={startNum - 1}
                value={subNum}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(startNum - 1, Number(e.target.value) || 0));
                  setSubNum(val);
                  setCurrentPos(startNum);
                  setHops([]);
                  setIsCompleted(false);
                }}
                className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-center font-bold font-mono"
              />
            </div>
          </div>
        )}

        {/* THE INTERACTIVE NUMBER LINE CANVAS */}
        <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 relative overflow-hidden select-none">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-6">
            <div className="flex items-center gap-2">
              <span>{t.currentPosLabel}</span>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg text-sm font-extrabold font-mono">
                {currentPos}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>{t.totalSubtractedLabel}</span>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-sm font-extrabold font-mono">
                {totalSubtractedSoFar} / {subNum}
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative h-44 sm:h-52 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 220" preserveAspectRatio="none">
              <line x1="20" y1="160" x2="980" y2="160" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
              <polygon points="15,160 30,152 30,168" fill="#334155" />
              <polygon points="985,160 970,152 970,168" fill="#334155" />

              {Array.from({ length: rangeSpan + 1 }).map((_, i) => {
                const num = lineMin + i;
                const isTen = num % 10 === 0;
                const isFive = num % 5 === 0;
                const isStart = num === startNum;
                const isAnswer = num === targetAnswer;
                const x = (getXPercent(num) / 100) * 1000;

                return (
                  <g key={num}>
                    <line
                      x1={x}
                      y1={isTen ? 140 : isFive ? 148 : 153}
                      x2={x}
                      y2={isTen ? 175 : isFive ? 170 : 167}
                      stroke={isTen ? '#0f172a' : '#64748b'}
                      strokeWidth={isTen ? 3 : 1.5}
                    />

                    {(isTen || isStart || isAnswer || (rangeSpan <= 25 && isFive)) && (
                      <text
                        x={x}
                        y="196"
                        textAnchor="middle"
                        fontSize={isStart || isAnswer ? '16' : '13'}
                        fontWeight={isStart || isAnswer ? '800' : '600'}
                        fill={isStart ? '#d97706' : isAnswer ? '#059669' : '#475569'}
                        fontFamily="monospace"
                      >
                        {num}
                      </text>
                    )}
                  </g>
                );
              })}

              {hops.map((hop, idx) => {
                const x1 = (getXPercent(hop.from) / 100) * 1000;
                const x2 = (getXPercent(hop.to) / 100) * 1000;
                const midX = (x1 + x2) / 2;
                const arcHeight = hop.amount >= 10 ? 70 : hop.amount >= 5 ? 50 : 35;
                const peakY = 160 - arcHeight;

                return (
                  <g key={idx} className="animate-in fade-in duration-200">
                    <path
                      d={`M ${x1} 160 Q ${midX} ${peakY} ${x2} 160`}
                      fill="none"
                      stroke={hop.amount >= 10 ? '#0284c7' : '#10b981'}
                      strokeWidth="3.5"
                      strokeDasharray="4 2"
                    />

                    <polygon
                      points={`${x2},160 ${x2 + 7},153 ${x2 + 7},167`}
                      fill={hop.amount >= 10 ? '#0284c7' : '#10b981'}
                    />

                    <rect
                      x={midX - 16}
                      y={peakY - 14}
                      width="32"
                      height="18"
                      rx="9"
                      fill={hop.amount >= 10 ? '#0284c7' : '#10b981'}
                    />
                    <text
                      x={midX}
                      y={peakY - 1}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill="#ffffff"
                      fontFamily="monospace"
                    >
                      {hop.label}
                    </text>
                  </g>
                );
              })}

              {(() => {
                const frogX = (getXPercent(currentPos) / 100) * 1000;
                return (
                  <g transform={`translate(${frogX - 18}, 115)`}>
                    <circle cx="18" cy="18" r="22" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
                    <circle cx="18" cy="18" r="18" fill="#10b981" stroke="#065f46" strokeWidth="2" />
                    <text x="18" y="24" textAnchor="middle" fontSize="18">
                      🐸
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Hop Controls Strip */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-1">{t.hopBackLabel}</span>
              <button
                onClick={() => hopBack(10)}
                disabled={currentPos - 10 < 0 || isCompleted}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm shadow-xs transition-all cursor-pointer active:scale-95"
              >
                {t.jump10Btn}
              </button>
              <button
                onClick={() => hopBack(5)}
                disabled={currentPos - 5 < 0 || isCompleted}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm shadow-xs transition-all cursor-pointer active:scale-95"
              >
                {t.jump5Btn}
              </button>
              <button
                onClick={() => hopBack(1)}
                disabled={currentPos - 1 < 0 || isCompleted}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm shadow-xs transition-all cursor-pointer active:scale-95"
              >
                {t.jump1Btn}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={undoLastHop}
                disabled={hops.length === 0}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                title={t.undoBtn}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.undoBtn}</span>
              </button>

              <button
                onClick={resetHops}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {t.resetBtn}
              </button>

              <button
                onClick={autoSolveStepByStep}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{t.showStrategyBtn}</span>
              </button>
            </div>
          </div>

          {/* Victory Banner */}
          {isCompleted && (
            <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🎉</div>
                <div>
                  <div className="font-extrabold text-base flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>
                      {t.landedExactTitle} {targetAnswer}!
                    </span>
                  </div>
                  <div className="text-xs text-emerald-800 mt-0.5">
                    {startNum} - {subNum} = {targetAnswer}. {t.landedExactDesc}
                  </div>
                </div>
              </div>

              {mode === 'challenges' && challengeIndex + 1 < NUMBER_LINE_CHALLENGES_BILINGUAL.length && (
                <button
                  onClick={() => loadChallenge(challengeIndex + 1)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>{t.nextChallengeBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Grade 2 Strategy Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <span>{t.strat1Title}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{t.strat1Desc}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <span>{t.strat2Title}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{t.strat2Desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
