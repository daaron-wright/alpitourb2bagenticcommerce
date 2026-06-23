// Shared TypeScript interfaces for the Alpitour demo project

export interface Persona {
  id: string;
  code: string;
  idx: number;
  name: string;
  role: string;
  archetype: string;
  init?: string;
  img: string | null;
  tone: string;
  toneSoft: string;
  moodLine: string;
  orbMood: string;
  tags: string[];
  pron: string;
  quote: string;
  greet: string;
  bio: string;
  context: [string, string][];
  goals: [string, string][];
  frustrations: [string, string, string][];
  trust: [string, string, number, string][];
  moods: [string, string, boolean?][];
  sys: string;
}

export interface DemoBeat {
  n: number;
  kicker: string;
  title: string;
  point: string;
  show: string[];
  say: string;
  cap: string[];
  stage: string;
  agents: string[];
  you: string;
  policy?: {
    pkg: string;
    title: string;
    plain: string;
    rego: string;
  };
}

export interface TravelPackage {
  id: string;
  name: string;
  brand?: string;
  price?: number;
  [key: string]: any;
}

export interface PlatformEvent {
  type: string;
  payload?: unknown;
}

export interface PlatformBusState {
  handoff: boolean | any;
  accepted: boolean | any;
  hold: { ref: string; until: string; total: number } | null;
  v2: { total: number; window: string } | null;
  proposal: { file: string } | null;
  brief: { answers: Array<{ k: string; v: string }>; cluster: string; conf: number } | null;
  feed: Array<{ who: string; t: string; ts: string }>;
  [key: string]: any;
}

export interface PlatformBus {
  state: PlatformBusState;
  subs: Array<(state: PlatformBusState, key?: string) => void>;
  emit(key: string, val?: any): void;
  on(f: (state: PlatformBusState, key?: string) => void): () => void;
  push(key: string, item: any): void;
}

export interface DemoBus {
  s: { stage: string; approval: boolean; [key: string]: any };
  subs: Array<(state: any) => void>;
  set(p: Partial<{ stage: string; approval: boolean; request: boolean }>): void;
  on(f: (state: any) => void): () => void;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface CompleteOptions {
  messages: Message[];
  max_tokens?: number;
}
