export interface BilingualEstimationItem {
  id: string;
  name: { en: string; tl: string };
  visualDescription: { en: string; tl: string };
  unit: 'cm' | 'm';
  actualValue: number;
  options: number[];
  benchmarkHint: { en: string; tl: string };
  category: 'small' | 'large';
  icon: string;
}

export const ESTIMATION_ITEMS_BILINGUAL: BilingualEstimationItem[] = [
  {
    id: 'glue-stick',
    name: { en: 'School Glue Stick', tl: 'Pandikit (Glue Stick)' },
    visualDescription: {
      en: 'A classic purple glue stick in your pencil box.',
      tl: 'Isang karaniwang lilang glue stick sa iyong lalagyan ng lapis.',
    },
    unit: 'cm',
    actualValue: 8,
    options: [2, 8, 25],
    benchmarkHint: {
      en: 'Think of your finger width: is a glue stick 2 cm (too tiny!), 8 cm, or 25 cm (as long as a full notebook)?',
      tl: 'Isipin ang lapad ng daliri: ang glue stick ba ay 2 cm (sobrang liit!), 8 cm, o 25 cm (kasinhaba ng buong kwaderno)?',
    },
    category: 'small',
    icon: '🟣',
  },
  {
    id: 'toothbrush',
    name: { en: 'Kids Toothbrush', tl: 'Pambatang Sipilyo' },
    visualDescription: {
      en: 'Your bright toothbrush by the bathroom sink.',
      tl: 'Ang iyong makulay na sipilyo sa tabi ng lababo.',
    },
    unit: 'cm',
    actualValue: 16,
    options: [4, 16, 50],
    benchmarkHint: {
      en: 'A toothbrush easily fits across your open hand. It is around 16 cm.',
      tl: 'Ang sipilyo ay madaling kumasya sa bukas mong palad. Ito ay mga 16 cm.',
    },
    category: 'small',
    icon: '🪥',
  },
  {
    id: 'skateboard',
    name: { en: 'Outdoor Skateboard', tl: 'Skateboard' },
    visualDescription: {
      en: 'A skateboard on the sidewalk.',
      tl: 'Isang skateboard sa bangketa.',
    },
    unit: 'cm',
    actualValue: 75,
    options: [15, 75, 180],
    benchmarkHint: {
      en: 'A skateboard is long enough for both feet, about three-quarters of a meter (75 cm)!',
      tl: 'Ang skateboard ay sapat ang haba para sa dalawang paa, mga tatlong-kapat ng isang metro (75 cm)!',
    },
    category: 'small',
    icon: '🛹',
  },
  {
    id: 'dining-table',
    name: { en: 'Kitchen Dining Table', tl: 'Mesa sa Kusina' },
    visualDescription: {
      en: 'A wooden table where the whole family eats dinner.',
      tl: 'Isang kahoy na hapag-kainan kung saan kumakain ang buong pamilya.',
    },
    unit: 'm',
    actualValue: 2,
    options: [2, 8, 20],
    benchmarkHint: {
      en: 'Remember: 1 meter is about a big kid leap. A dining table fits two big leaps across (2 meters).',
      tl: 'Tandaan: Ang 1 metro ay halos isang malaking hakbang. Ang hapag-kainan ay kasinghaba ng dalawang malalaking hakbang (2 metro).',
    },
    category: 'large',
    icon: '🪑',
  },
  {
    id: 'smart-phone',
    name: { en: 'Smart Phone', tl: 'Cell Phone' },
    visualDescription: {
      en: 'A mobile phone held in one hand.',
      tl: 'Isang teleponong hawak sa isang kamay.',
    },
    unit: 'cm',
    actualValue: 15,
    options: [5, 15, 45],
    benchmarkHint: {
      en: 'About 15 centimeters tall. 45 cm would be longer than an adult forearm!',
      tl: 'Mga 15 sentimetro ang taas. Ang 45 cm ay mas mahaba pa sa braso ng matanda!',
    },
    category: 'small',
    icon: '📱',
  },
  {
    id: 'classroom-door',
    name: { en: 'Height of a Refrigerator', tl: 'Taas ng Palamigan (Ref)' },
    visualDescription: {
      en: 'The tall fridge in the kitchen holding all the milk and snacks.',
      tl: 'Ang matangkad na ref sa kusina na lalagyan ng gatas at meryenda.',
    },
    unit: 'm',
    actualValue: 2,
    options: [1, 2, 6],
    benchmarkHint: {
      en: 'A fridge is as tall as a doorway: about 2 meters tall!',
      tl: 'Ang ref ay kasingtaas ng pintuan: humigit-kumulang 2 metro ang taas!',
    },
    category: 'large',
    icon: '🧊',
  },
];
