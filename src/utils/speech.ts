// Text-to-speech helper for Grade 2 reading support with English and Tagalog
export type SupportedLang = 'en' | 'tl';

class SpeechHelper {
  private isSpeaking = false;

  speak(text: string, lang: SupportedLang = 'en', onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Clean markdown or symbol clutter from speech
      const cleanText = text
        .replace(/[#*_`]/g, '')
        .replace(/cm/gi, lang === 'tl' ? 'sentimetro' : 'centimeters')
        .replace(/\bm\b/gi, lang === 'tl' ? 'metro' : 'meters');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.88; // clear cadence for a 7-8 year old
      utterance.pitch = 1.05; // Friendly, warm pitch

      const voices = window.speechSynthesis.getVoices();

      if (lang === 'tl') {
        utterance.lang = 'tl-PH';
        // Look for Filipino or Tagalog voice
        const filipinoVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('tl') ||
            v.lang.toLowerCase().startsWith('fil') ||
            v.name.toLowerCase().includes('filipino') ||
            v.name.toLowerCase().includes('tagalog')
        );
        if (filipinoVoice) {
          utterance.voice = filipinoVoice;
        }
      } else {
        utterance.lang = 'en-US';
        const englishVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('en') &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny'))
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
    }
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  get speaking() {
    return this.isSpeaking;
  }
}

export const speech = new SpeechHelper();

