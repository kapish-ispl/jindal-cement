// types/lenis.d.ts
declare module 'lenis' {
  export interface LenisOptions {
    lerp?: number;
    syncTouch?: boolean;
    wheelInertiaMultiplier?: number;
    touchInertiaMultiplier?: number;
    gestureMode?: 'touch' | 'wheel' | 'all';
    smoothTouch?: boolean;
    smoothWheel?: boolean;
    duration?: number;
    prevent?: (target: EventTarget | null) => boolean;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    destroy(): void;
  }
}
