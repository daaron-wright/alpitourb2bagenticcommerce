/* ============================================================
   Alpitour Platform · shared trip thread (PlatformBus)
   One Bianchi thread, two lenses: traveler (Alpitour.it) and
   agent (EasyBook Next). In-memory pub/sub — demo theatre.
   ============================================================ */
import type { PlatformBusState } from './types';

type BusSub = (state: PlatformBusState, key?: string) => void;

const THREAD_KEY = 'alpitour.platform.thread';
const SPINE_KEY = 'alpitour.spine.event';
const WF_KEY = 'alpitour.agentic.activeWf';

// FE milestone → the spine workflow it lights up in the Agentic Pipeline
const WF_FOR: Record<string, string> = {
  handoff: 'inquiry-to-requirements',
  brief: 'context-to-persona',
  accepted: 'search-to-recommend',
  hold: 'hold-to-booking',
  proposal: 'quote-to-proposal',
  v2: 'modification-self-service',
};

const initialState: PlatformBusState = {
  handoff: false,
  accepted: false,
  hold: null,
  v2: null,
  proposal: null,
  brief: null,
  feed: [],
};

export const bus = {
  state: { ...initialState } as PlatformBusState,
  subs: [] as BusSub[],

  emit(key: string, val?: any): void {
    (this.state as any)[key] = val === undefined ? true : val;
    this.subs.forEach((f) => { try { f(this.state, key); } catch (e) {} });
    try {
      localStorage.setItem(THREAD_KEY, JSON.stringify({ state: this.state, key, at: Date.now() }));
    } catch (e) {}
    if (WF_FOR[key]) {
      try { localStorage.setItem(WF_KEY, WF_FOR[key]); } catch (e) {}
    }
  },

  on(f: BusSub): () => void {
    this.subs.push(f);
    return () => { this.subs = this.subs.filter((x) => x !== f); };
  },

  push(key: string, item: any): void {
    const now = new Date();
    const ts =
      String(now.getHours()).padStart(2, '0') +
      ':' +
      String(now.getMinutes()).padStart(2, '0');
    this.emit(key, [...((this.state as any)[key] || []), { ...item, ts }]);
  },
};

// spine → FE: planner actions surface as live feed items (toast)
try {
  window.addEventListener('storage', (e) => {
    if (e.key !== SPINE_KEY || !e.newValue) return;
    let evt: any = null;
    try { evt = JSON.parse(e.newValue); } catch (err) {}
    if (evt && evt.t) bus.push('feed', { who: 'agent', t: evt.t });
  });
} catch (e) {}
