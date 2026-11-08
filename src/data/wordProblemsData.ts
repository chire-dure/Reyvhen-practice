export interface BilingualWordProblem {
  id: string;
  title: { en: string; tl: string };
  story: { en: string; tl: string };
  category: 'addition' | 'subtraction' | 'comparison' | 'distance';
  partA: number;
  partB: number;
  unit: 'cm' | 'm';
  operation: '+' | '-';
  correctAnswer: number;
  barModelType: 'part-part-whole' | 'comparison' | 'take-away';
  hint: { en: string; tl: string };
  stepExplanation: { en: string; tl: string };
}

export const WORD_PROBLEMS_BILINGUAL: BilingualWordProblem[] = [
  {
    id: 'prob-1',
    title: { en: 'Leo the Lizard', tl: 'Si Leo ang Butiki' },
    story: {
      en: 'Leo the Lizard is 28 cm long from nose to tail. His tail is 12 cm long. How long is the rest of Leo’s body?',
      tl: 'Si Leo ang Butiki ay may habang 28 cm mula sa ilong hanggang sa dulo ng buntot. Ang kanyang buntot ay 12 cm. Gaano kahaba ang natitirang bahagi ng katawan ni Leo?',
    },
    category: 'subtraction',
    partA: 28,
    partB: 12,
    unit: 'cm',
    operation: '-',
    correctAnswer: 16,
    barModelType: 'take-away',
    hint: {
      en: 'You know the WHOLE lizard is 28 cm. Take away the 12 cm tail to find the body: 28 - 12 = ?',
      tl: 'Alam mong ang KABUUANG butiki ay 28 cm. Ibawas ang 12 cm na buntot upang malaman ang katawan: 28 - 12 = ?',
    },
    stepExplanation: {
      en: '28 cm (total lizard) - 12 cm (tail) = 16 cm (body).',
      tl: '28 cm (kabuuang butiki) - 12 cm (buntot) = 16 cm (katawan).',
    },
  },
  {
    id: 'prob-2',
    title: { en: 'Maya’s Gift Ribbon', tl: 'Ang Laso ng Regalo ni Maya' },
    story: {
      en: 'Maya cuts 35 cm of red ribbon and 40 cm of gold ribbon to wrap a birthday gift. How many centimeters of ribbon did Maya cut in all?',
      tl: 'Pumutol si Maya ng 35 cm na pulang laso at 40 cm na gintong laso para sa regalo. Ilang sentimetro ng laso ang pinutol ni Maya sa kabuuan?',
    },
    category: 'addition',
    partA: 35,
    partB: 40,
    unit: 'cm',
    operation: '+',
    correctAnswer: 75,
    barModelType: 'part-part-whole',
    hint: {
      en: 'Add the two ribbons together! 35 + 40 = ?',
      tl: 'Pagsamahin ang dalawang laso! 35 + 40 = ?',
    },
    stepExplanation: {
      en: '35 cm (red) + 40 cm (gold) = 75 cm in total.',
      tl: '35 cm (pula) + 40 cm (ginto) = 75 cm sa kabuuan.',
    },
  },
  {
    id: 'prob-3',
    title: { en: 'Oliver the Puppy’s Run', tl: 'Ang Takbo ng Tutang si Oliver' },
    story: {
      en: 'Oliver the Puppy ran 18 meters to the big oak tree, and then ran 15 meters to catch a tennis ball. How many meters did Oliver run in total?',
      tl: 'Ang tutang si Oliver ay tumakbo nang 18 metro papunta sa malaking puno, at pagkatapos ay tumakbo nang 15 metro upang hulihin ang bola. Ilang metro ang tinakbo ni Oliver sa kabuuan?',
    },
    category: 'distance',
    partA: 18,
    partB: 15,
    unit: 'm',
    operation: '+',
    correctAnswer: 33,
    barModelType: 'part-part-whole',
    hint: {
      en: 'Add the first run (18 m) to the second run (15 m): 18 + 15 = ?',
      tl: 'Pagsamahin ang unang takbo (18 m) at ang pangalawang takbo (15 m): 18 + 15 = ?',
    },
    stepExplanation: {
      en: '18 m + 15 m = 33 meters total distance.',
      tl: '18 m + 15 m = 33 metrong kabuuang distansya.',
    },
  },
  {
    id: 'prob-4',
    title: { en: 'Sammy Snake vs. Toby Turtle', tl: 'Si Sammy Ahas at Toby Pagong' },
    story: {
      en: 'Sammy Snake is 84 cm long. Toby Turtle is 25 cm long. How much longer is Sammy Snake than Toby Turtle?',
      tl: 'Si Sammy Ahas ay may habang 84 cm. Si Toby Pagong naman ay may habang 25 cm. Gaano kahaba si Sammy Ahas kaysa kay Toby Pagong?',
    },
    category: 'comparison',
    partA: 84,
    partB: 25,
    unit: 'cm',
    operation: '-',
    correctAnswer: 59,
    barModelType: 'comparison',
    hint: {
      en: 'When comparing "how much longer", we subtract! 84 - 25 = ?',
      tl: 'Kapag naghahambing kung "gaano kahaba", tayo ay nagbabawas! 84 - 25 = ?',
    },
    stepExplanation: {
      en: '84 cm - 25 cm = 59 cm longer.',
      tl: '84 cm - 25 cm = 59 cm na mas mahaba.',
    },
  },
  {
    id: 'prob-5',
    title: { en: 'The Park Garden Path', tl: 'Ang Daanan sa Hardin ng Parke' },
    story: {
      en: 'The park garden path is 90 meters long. Sofia has already walked 55 meters. How many more meters does she need to walk to reach the end?',
      tl: 'Ang daanan sa hardin ng parke ay 90 metro ang haba. Nakalakad na si Sofia ng 55 metro. Ilang metro pa ang kailangan niyang lakarin upang marating ang dulo?',
    },
    category: 'distance',
    partA: 90,
    partB: 55,
    unit: 'm',
    operation: '-',
    correctAnswer: 35,
    barModelType: 'take-away',
    hint: {
      en: 'Start with 90 meters. Subtract 55 meters: 90 - 55 = ?',
      tl: 'Magsimula sa 90 metro. Ibawas ang 55 metro: 90 - 55 = ?',
    },
    stepExplanation: {
      en: '90 m (total path) - 55 m (already walked) = 35 meters left.',
      tl: '90 m (kabuuang daan) - 55 m (nalakad na) = 35 metrong natitira.',
    },
  },
  {
    id: 'prob-6',
    title: { en: 'Ben’s Jump Rope', tl: 'Ang Tali sa Luksong-Lubid ni Ben' },
    story: {
      en: 'Ben had a jump rope that was 100 cm long. He cut off 18 cm because it was tripping his feet. How long is the jump rope now?',
      tl: 'May lubid si Ben na 100 cm ang haba. Pinutol niya ang 18 cm dahil sumasabit sa kanyang paa. Gaano kahaba ang lubid ngayon?',
    },
    category: 'subtraction',
    partA: 100,
    partB: 18,
    unit: 'cm',
    operation: '-',
    correctAnswer: 82,
    barModelType: 'take-away',
    hint: {
      en: '100 - 10 = 90. Now subtract 8 more: 90 - 8 = ?',
      tl: '100 - 10 = 90. Ngayon ay ibawas ang 8 pa: 90 - 8 = ?',
    },
    stepExplanation: {
      en: '100 cm - 18 cm = 82 cm long now.',
      tl: '100 cm - 18 cm = 82 cm ang haba ngayon.',
    },
  },
];
