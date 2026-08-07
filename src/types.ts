// Te Whare Tapa Whā Wellbeing Reflection App
// A digital interpretation for personal reflection, not a clinical tool.

export interface Domain {
  readonly id: string;
  readonly name: string;
  readonly maoriName: string;
  readonly description: string;
  readonly descriptionMi?: string;
  readonly prompt: string;
  readonly promptMi?: string;
  score: number;
  reflection: string;
}

export interface AssessmentState {
  readonly domains: Domain[];
  readonly currentStep: number;
  readonly showSummary: boolean;
}

export const DEFAULT_SCORE = 3;
export const MAX_SCORE = 5;
export const MIN_SCORE = 1;
export const STORAGE_KEY = 'te-whare-tapa-wha-assessment';

export const DOMAINS: readonly Omit<Domain, 'score' | 'reflection'>[] = [
  {
    id: 'tinana',
    name: 'Physical wellbeing',
    maoriName: 'Taha tinana',
    description:
      'How your body feels and how you care for it — movement, rest, nourishment, and physical strength.',
    descriptionMi:
      'He aha tō kiko e noho nei, me tūpato koe i a ia — neke, moemoeā, kaiponu, me kaha tinana.',
    prompt: 'What does looking after your tinana mean for you right now?',
    promptMi: 'He aha te tikanga o tūpato i tō tinana mō koe kei ināianei?'
  },
  {
    id: 'hinengaro',
    name: 'Mental and emotional wellbeing',
    maoriName: 'Taha hinengaro',
    description:
      'Your thoughts, feelings, and how you make sense of the world. Clear thinking and expressing what is going on inside.',
    descriptionMi:
      'Ōu whakaaro, ōu rongo, me tūpato koe i te ao. Whakaaro clear me āwhina i te mea e noho nei ki roto.',
    prompt: 'How are your thoughts and feelings sitting with you at the moment?',
    promptMi: 'He aha ōu whakaaro me rongo e noho nei mā koe pēlā?'
  },
  {
    id: 'wairua',
    name: 'Spiritual wellbeing',
    maoriName: 'Taha wairua',
    description:
      'Your sense of meaning, connection to something greater, values, identity, and what gives your life purpose.',
    descriptionMi:
      'Tō whakapono o tētahi, hononga ki tētahi mea nui, āhua, whakapono, me te mea e homai nei he-āhua ki tō ao.',
    prompt: 'What gives your life meaning or a sense of connection right now?',
    promptMi: 'He aha e homai nei he-āhua ki tō ao rānei hononga kei ināianei?'
  },
  {
    id: 'whanau',
    name: 'Family and social wellbeing',
    maoriName: 'Taha whānau',
    description:
      'The people you belong with — family, friends, community, and the relationships that support and shape you.',
    descriptionMi:
      'Ngā tāngata e tūpato ana koe — whānau, hoa, hapai, me ngā whakapā e tautoko ana me āhua koe.',
    prompt: 'Who helps you feel you belong, and how are those connections for you?',
    promptMi: 'Ko wai e āwhina ana kia tūpato koe, me he aha āu hononga?'
  }
] as const;

export const createDefaultDomains = (): Domain[] =>
  DOMAINS.map((d) => ({
    ...d,
    score: DEFAULT_SCORE,
    reflection: ''
  }));

export const cloneDomains = (domains: Domain[]): Domain[] =>
  domains.map((d) => ({ ...d }));
