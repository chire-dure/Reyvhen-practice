import { AppLanguage } from '../types';

export interface BilingualUnitItem {
  id: string;
  name: { en: string; tl: string };
  correctUnit: 'cm' | 'm';
  reason: { en: string; tl: string };
  iconName: string;
  typicalSize: { en: string; tl: string };
}

export const UNIT_ITEMS_BILINGUAL: BilingualUnitItem[] = [
  {
    id: 'crayon',
    name: { en: 'Crayon', tl: 'Krayola' },
    correctUnit: 'cm',
    reason: {
      en: 'A crayon is small and fits in your hand! It is usually about 9 cm long.',
      tl: 'Ang krayola ay maliit at kasya sa iyong kamay! Ito ay karaniwang 9 cm ang haba.',
    },
    iconName: '🖍️',
    typicalSize: { en: 'About 9 cm', tl: 'Tinatayang 9 cm' },
  },
  {
    id: 'school-bus',
    name: { en: 'School Bus', tl: 'School Bus' },
    correctUnit: 'm',
    reason: {
      en: 'A school bus is giant! You need meters to measure how long it stretches down the street.',
      tl: 'Napakalaki ng school bus! Kailangan mo ng metro upang sukatin ang haba nito sa kalsada.',
    },
    iconName: '🚌',
    typicalSize: { en: 'About 12 m', tl: 'Tinatayang 12 m' },
  },
  {
    id: 'paperclip',
    name: { en: 'Paperclip', tl: 'Paperclip' },
    correctUnit: 'cm',
    reason: {
      en: 'A paperclip is tiny. It is only about 3 cm long!',
      tl: 'Napakaliit ng paperclip. Ito ay may haba lamang na mga 3 cm!',
    },
    iconName: '📎',
    typicalSize: { en: 'About 3 cm', tl: 'Tinatayang 3 cm' },
  },
  {
    id: 'bedroom-door',
    name: { en: 'Bedroom Door Height', tl: 'Taas ng Pinto ng Kwarto' },
    correctUnit: 'm',
    reason: {
      en: 'A door is tall enough for adults to walk through. It is about 2 meters tall!',
      tl: 'Ang pinto ay mataas para makapasok ang mga matatanda. Ito ay mga 2 metro ang taas!',
    },
    iconName: '🚪',
    typicalSize: { en: 'About 2 m', tl: 'Tinatayang 2 m' },
  },
  {
    id: 'toothbrush',
    name: { en: 'Toothbrush', tl: 'Sipilyo' },
    correctUnit: 'cm',
    reason: {
      en: 'A toothbrush easily fits in your bathroom cup! It is about 18 cm long.',
      tl: 'Ang sipilyo ay madaling kumasya sa baso sa banyo! Ito ay mga 18 cm ang haba.',
    },
    iconName: '🪥',
    typicalSize: { en: 'About 18 cm', tl: 'Tinatayang 18 cm' },
  },
  {
    id: 'playground-slide',
    name: { en: 'Playground Slide', tl: 'Paus-usan sa Palaruan' },
    correctUnit: 'm',
    reason: {
      en: 'A playground slide is long and fast to slide down! It is measured in meters.',
      tl: 'Ang paus-usan ay mahaba at masayang dausdosan! Ito ay sinusukat sa metro.',
    },
    iconName: '🛝',
    typicalSize: { en: 'About 4 m', tl: 'Tinatayang 4 m' },
  },
  {
    id: 'chocolate-bar',
    name: { en: 'Chocolate Bar', tl: 'Tsokolate' },
    correctUnit: 'cm',
    reason: {
      en: 'A chocolate bar is a snack you can hold in both hands. About 15 cm long.',
      tl: 'Ang tsokolate ay meryendang nahahawakan sa kamay. Mga 15 cm ang haba nito.',
    },
    iconName: '🍫',
    typicalSize: { en: 'About 15 cm', tl: 'Tinatayang 15 cm' },
  },
  {
    id: 'tall-tree',
    name: { en: 'Oak Tree in Park', tl: 'Mataas na Puno sa Parke' },
    correctUnit: 'm',
    reason: {
      en: 'Trees reach high into the sky! We use meters to measure tall trees.',
      tl: 'Abot-langit ang taas ng mga puno! Gumagamit tayo ng metro para sa matatayog na puno.',
    },
    iconName: '🌳',
    typicalSize: { en: 'About 10 m', tl: 'Tinatayang 10 m' },
  },
];
