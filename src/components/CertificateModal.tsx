import React, { useState } from 'react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Award, Printer, X, Star } from 'lucide-react';
import { sound } from '../utils/sound';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stars: number;
  studentName: string;
  setStudentName: (name: string) => void;
  language: AppLanguage;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  stars,
  studentName,
  setStudentName,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [inputName, setInputName] = useState(studentName || 'Awesome Explorer');

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentName(inputName);
    sound.playPop();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-slate-900 font-display">
              {t.certHeader}
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6">
          <form onSubmit={handleSaveName} className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-amber-50/60 rounded-2xl border border-amber-200/70">
            <label className="text-xs font-bold text-amber-900 shrink-0">{t.studentNameLabel}</label>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Enter brother's name"
              className="bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-900 w-full outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {t.updateNameBtn}
            </button>
          </form>

          {/* PRINTABLE CERTIFICATE CARD */}
          <div
            id="printable-certificate"
            className="bg-gradient-to-b from-amber-50/40 via-white to-amber-50/40 p-8 rounded-3xl border-4 border-amber-500/80 shadow-md text-center space-y-4 relative"
          >
            <div className="absolute top-2 left-2 text-2xl text-amber-400 select-none">✦</div>
            <div className="absolute top-2 right-2 text-2xl text-amber-400 select-none">✦</div>
            <div className="absolute bottom-2 left-2 text-2xl text-amber-400 select-none">✦</div>
            <div className="absolute bottom-2 right-2 text-2xl text-amber-400 select-none">✦</div>

            <div className="space-y-1">
              <div className="text-xs font-bold tracking-widest text-amber-800 uppercase">
                {t.certAwardKicker}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                {t.certAwardTitle}
              </h2>
            </div>

            <div className="text-sm text-slate-600">{t.awardedTo}</div>

            <div className="py-2 border-b-2 border-dashed border-amber-400 max-w-sm mx-auto">
              <div className="text-2xl sm:text-3xl font-black text-amber-900 font-display underline decoration-amber-300 underline-offset-8">
                {inputName || 'Super Math Explorer'}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed pt-2">
              {t.certBody}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2 rounded-xl bg-white border border-amber-200 text-center">
                <div className="text-xl">📏</div>
                <div className="text-[10px] font-bold text-slate-800">{t.tabUnits}</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-amber-200 text-center">
                <div className="text-xl">🧰</div>
                <div className="text-[10px] font-bold text-slate-800">{t.tabTools}</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-amber-200 text-center">
                <div className="text-xl">🎯</div>
                <div className="text-[10px] font-bold text-slate-800">{t.tabEstimation}</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-amber-200 text-center">
                <div className="text-xl">🐸</div>
                <div className="text-[10px] font-bold text-slate-800">{t.tabNumberLine}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-amber-200 text-left">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">{t.certStarsLabel}</div>
                <div className="flex items-center gap-1 text-amber-600 font-extrabold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>
                    {stars} {t.starsLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-white">
                  SEAL 🏅
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="text-xs text-slate-500">{t.printHint}</div>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printCertBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
