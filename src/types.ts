// Te Whare Tapa Whā Wellbeing Reflection App
// A digital interpretation for personal reflection, not a clinical tool.

export interface Domain {
  readonly id: string;
  readonly name: string;
  readonly maoriName: string;
  readonly description: string;
  readonly prompt: string;
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
    prompt: 'What does looking after your tinana mean for you right now?'
  },
  {
    id: 'hinengaro',
    name: 'Mental and emotional wellbeing',
    maoriName: 'Taha hinengaro',
    description:
      'Your thoughts, feelings, and how you make sense of the world. Clear thinking and expressing what is going on inside.',
    prompt: 'How are your thoughts and feelings sitting with you at the moment?'
  },
  {
    id: 'wairua',
    name: 'Spiritual wellbeing',
    maoriName: 'Taha wairua',
    description:
      'Your sense of meaning, connection to something greater, values, identity, and what gives your life purpose.',
    prompt: 'What gives your life meaning or a sense of connection right now?'
  },
  {
    id: 'whanau',
    name: 'Family and social wellbeing',
    maoriName: 'Taha whānau',
    description:
      'The people you belong with — family, friends, community, and the relationships that support and shape you.',
    prompt: 'Who helps you feel you belong, and how are those connections for you?'
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
