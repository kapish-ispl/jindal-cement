// types/lenis.d.ts
declare module 'lenis' {
  export interface LenisOptions {
    lerp?: number;
    syncTouch?: boolean;
    wheelInertiaMultiplier?: number;
    touchInertiaMultiplier?: number;
    touchMultiplier?: number;
    wheelMultiplier?: number;
    infinite?: boolean;
    gestureOrientation?: 'vertical' | 'horizontal' | 'both';
    gestureDirection?: 'vertical' | 'horizontal' | 'both';
    syncTouchLerp?: number;
    gestureMode?: 'touch' | 'wheel' | 'all';
    smoothTouch?: boolean;
    smoothWheel?: boolean;
    duration?: number;
    wrapper?: HTMLElement | Window;
    content?: HTMLElement;
    easing?: (t: number) => number;
    prevent?: (target: EventTarget | null) => boolean;
  }

  export default class Lenis {
    constructor(options?: LenisOptions)

    raf(time: number): void
    destroy(): void

    on(event: 'scroll', callback: (e: LenisEvent) => void): void
    off(event: 'scroll', callback: (e: LenisEvent) => void): void

    scrollTo(
      target: number | string | HTMLElement,
      options?: {
        offset?: number
        duration?: number
        easing?: (t: number) => number
        immediate?: boolean
      }
    ): void
  }
}




