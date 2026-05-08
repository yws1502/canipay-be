export type Rng = () => number;

export function makeMulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Weighted<T> {
  v: T;
  w: number;
}

export function pickWeighted<T>(items: Weighted<T>[], rng: Rng): T {
  const total = items.reduce((s, it) => s + it.w, 0);
  let r = rng() * total;
  for (const it of items) {
    r -= it.w;
    if (r <= 0) return it.v;
  }
  return items[items.length - 1].v;
}

export function pickOne<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}
