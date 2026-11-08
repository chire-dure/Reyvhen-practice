export interface BilingualToolScenario {
  id: string;
  question: { en: string; tl: string };
  correctTool: 'ruler' | 'tape' | 'meter_stick';
  explanation: { en: string; tl: string };
  hint: { en: string; tl: string };
  iconName: string;
}

export const TOOL_SCENARIOS_BILINGUAL: BilingualToolScenario[] = [
  {
    id: 'pumpkin',
    question: {
      en: 'You want to measure all the way around a giant round pumpkin. Which tool works best?',
      tl: 'Nais mong sukatin ang paligid ng isang malaking bilog na kalabasa. Aling kagamitan ang pinakamainam?',
    },
    correctTool: 'tape',
    explanation: {
      en: 'A tape measure is flexible and bendy! A rigid wooden ruler cannot bend around a round pumpkin without snapping.',
      tl: 'Ang tape measure ay nababaluktot! Ang matigas na ruler ay hindi maibabaluktot sa bilog na kalabasa nang hindi mababali.',
    },
    hint: {
      en: 'A pumpkin is curved and round. Which tool can wrap around it?',
      tl: 'Ang kalabasa ay bilog. Aling kagamitan ang makababalot dito?',
    },
    iconName: '🎃',
  },
  {
    id: 'crayon-box',
    question: {
      en: 'You want to measure the length of a brand new crayon on your desk. Which tool is perfect?',
      tl: 'Nais mong sukatin ang haba ng bagong krayola sa iyong mesa. Aling kagamitan ang nararapat?',
    },
    correctTool: 'ruler',
    explanation: {
      en: 'A 30 cm ruler is the right size for small flat items on your desk like crayons and pencils!',
      tl: 'Ang 30 cm ruler ay tamang sukat para sa maliliit at tuwid na gamit sa mesa tulad ng krayola at lapis!',
    },
    hint: {
      en: 'A crayon is small and straight. You have one in your pencil case!',
      tl: 'Ang krayola ay maliit at tuwid. Mayroon ka nito sa iyong pencil case!',
    },
    iconName: '🖍️',
  },
  {
    id: 'classroom-door',
    question: {
      en: 'You want to measure the height of your classroom door from the floor to the top. Which tool?',
      tl: 'Nais mong sukatin ang taas ng pinto ng inyong silid-aralan mula sa sahig hanggang itaas. Alin dito?',
    },
    correctTool: 'meter_stick',
    explanation: {
      en: 'A meter stick is rigid, straight, and 100 cm long. Two meter sticks stacked will measure a 2-meter door perfectly!',
      tl: 'Ang meter stick ay tuwid at may 100 cm ang haba. Dalawang meter stick ang sukat ng 2-metrong pinto!',
    },
    hint: {
      en: 'A door is straight and about 2 meters tall. A rigid long stick is easy to hold up.',
      tl: 'Ang pinto ay tuwid at mga 2 metro ang taas. Madaling itabi ang mahabang patpat.',
    },
    iconName: '🚪',
  },
  {
    id: 'birthday-hat',
    question: {
      en: 'You want to measure around your brother’s head to make a custom birthday party hat. Which tool?',
      tl: 'Nais mong sukatin ang paikot ng ulo ng iyong kapatid para sa sumbrero sa kaarawan. Aling gamit?',
    },
    correctTool: 'tape',
    explanation: {
      en: 'Heads are round! A flexible tape measure wraps gently around a forehead to get the exact size.',
      tl: 'Bilog ang ulo! Ang nababaluktot na tape measure ay dahan-dahang nakapaligid sa noo upang makuha ang eksaktong sukat.',
    },
    hint: {
      en: 'Can you bend a stiff wooden stick around a head? No way!',
      tl: 'Mababali mo ba ang matigas na kahoy sa paligid ng ulo? Hindi maaari!',
    },
    iconName: '👑',
  },
  {
    id: 'book-cover',
    question: {
      en: 'You need to measure how wide your favorite math storybook is. Which tool should you use?',
      tl: 'Kailangan mong sukatin ang lapad ng iyong paboritong kwaderno sa math. Alin ang dapat gamitin?',
    },
    correctTool: 'ruler',
    explanation: {
      en: 'A student ruler (30 cm) easily lines up with the straight edge of a book cover.',
      tl: 'Ang ruler ng mag-aaral (30 cm) ay madaling itapat sa tuwid na gilid ng aklat.',
    },
    hint: {
      en: 'The book is straight, flat, and shorter than your desk.',
      tl: 'Ang aklat ay tuwid, patag, at mas maikli kaysa sa iyong mesa.',
    },
    iconName: '📖',
  },
  {
    id: 'whiteboard',
    question: {
      en: 'Your teacher asks you to measure the straight bottom edge of the big classroom whiteboard. Which tool?',
      tl: 'Hiniling ng iyong guro na sukatin ang tuwid na ibabang gilid ng malaking pisara. Aling gamit?',
    },
    correctTool: 'meter_stick',
    explanation: {
      en: 'A meter stick is 1 meter (100 cm) long, making it fast and accurate to measure long straight boards in school.',
      tl: 'Ang meter stick ay may 1 metro (100 cm) ang haba, kaya mabilis at tumpak sukatin ang mahabang pisara sa paaralan.',
    },
    hint: {
      en: 'It is a straight wall object, about 3 meters across.',
      tl: 'Ito ay tuwid na bagay sa dingding, mga 3 metro ang haba.',
    },
    iconName: '📋',
  },
];

export const LAB_ITEMS_BILINGUAL = [
  { id: 'item-pencil', name: { en: 'Yellow Pencil', tl: 'Dilaw na Lapis' }, actualLengthCm: 14, color: '#f59e0b' },
  { id: 'item-leaf', name: { en: 'Garden Leaf', tl: 'Dahon sa Hardin' }, actualLengthCm: 8, color: '#10b981' },
  { id: 'item-key', name: { en: 'Golden Key', tl: 'Gintong Susi' }, actualLengthCm: 6, color: '#eab308' },
  { id: 'item-eraser', name: { en: 'Pink Eraser', tl: 'Rosas na Pambura' }, actualLengthCm: 5, color: '#ec4899' },
  { id: 'item-candy', name: { en: 'Chocolate Bar', tl: 'Barang Tsokolate' }, actualLengthCm: 11, color: '#78350f' },
  { id: 'item-spoon', name: { en: 'Soup Spoon', tl: 'Kutsara' }, actualLengthCm: 16, color: '#64748b' },
];
