export interface BilingualNumberLineChallenge {
  id: string;
  title: { en: string; tl: string };
  start: number;
  subtract: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: { en: string; tl: string };
}

export const NUMBER_LINE_CHALLENGES_BILINGUAL: BilingualNumberLineChallenge[] = [
  {
    id: 'c1',
    title: { en: 'Warm-up: Small Hops', tl: 'Pampasigla: Maliliit na Lukso' },
    start: 17,
    subtract: 5,
    difficulty: 'easy',
    description: {
      en: 'Start at 17. Hop backwards 5 times by 1s (or one hop of 5) to find 17 - 5!',
      tl: 'Magsimula sa 17. Lumukso pabalik nang 5 beses (isahan o lukso ng 5) upang malutas ang 17 - 5!',
    },
  },
  {
    id: 'c2',
    title: { en: 'Subtracting Tens', tl: 'Pagbabawas ng Sampuan' },
    start: 45,
    subtract: 20,
    difficulty: 'easy',
    description: {
      en: 'Start at 45. Make 2 big hops of -10 back: 45 -> 35 -> 25!',
      tl: 'Magsimula sa 45. Gumawa ng 2 malalaking lukso ng -10 pabalik: 45 -> 35 -> 25!',
    },
  },
  {
    id: 'c3',
    title: { en: 'Tens and Ones', tl: 'Sampuan at Isahan' },
    start: 38,
    subtract: 14,
    difficulty: 'medium',
    description: {
      en: 'Break 14 into 10 and 4. Jump back 10 first, then 4 small hops!',
      tl: 'Hatiin ang 14 sa 10 at 4. Lumukso muna ng 10 pabalik, pagkatapos ay 4 na maliliit na lukso!',
    },
  },
  {
    id: 'c4',
    title: { en: 'Friendly Ten Bridge', tl: 'Tulay sa Kaibigang Sampu' },
    start: 32,
    subtract: 7,
    difficulty: 'medium',
    description: {
      en: 'Hop back 2 to hit the friendly ten (30), then hop back 5 more to 25!',
      tl: 'Lumukso pabalik ng 2 upang tumuntong sa 30, pagkatapos ay lumukso ng 5 pa papuntang 25!',
    },
  },
  {
    id: 'c5',
    title: { en: '2-Digit with Regrouping', tl: '2-Digit na Pagbabawas' },
    start: 64,
    subtract: 27,
    difficulty: 'hard',
    description: {
      en: 'Start at 64. Hop back two 10s (leaves 44), then hop back 7 (leaves 37)!',
      tl: 'Magsimula sa 64. Lumukso ng dalawang 10 pabalik (44), pagkatapos ay lumukso ng 7 pabalik (37)!',
    },
  },
  {
    id: 'c6',
    title: { en: 'The Grand Hop Challenge', tl: 'Ang Dakilang Hamon sa Paglukso' },
    start: 85,
    subtract: 39,
    difficulty: 'hard',
    description: {
      en: 'Start at 85. Subtract 39 by jumping back 30, then 9 more!',
      tl: 'Magsimula sa 85. Ibawas ang 39 sa pamamagitan ng paglukso ng 30 pabalik, at 9 pa!',
    },
  },
];
