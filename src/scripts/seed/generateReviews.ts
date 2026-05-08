import { pickOne, pickWeighted, Rng } from './rng';
import { CATEGORY_CONTENTS, TRAIT_CONTENTS } from './reviewContents';

export interface ReviewFlags {
  isTasty: boolean;
  isFriendly: boolean;
  isValuable: boolean;
  isComfortable: boolean;
}

export interface GeneratedReview extends ReviewFlags {
  content: string;
  isReported: boolean;
}

export interface AggregatedCounts {
  reviewCount: number;
  tastyCount: number;
  friendlyCount: number;
  valuableCount: number;
  comfortableCount: number;
}

const REVIEW_COUNT_WEIGHTS = [
  { v: 0, w: 5 },
  { v: 1, w: 8 },
  { v: 2, w: 10 },
  { v: 3, w: 9 },
  { v: 4, w: 7 },
  { v: 5, w: 5 },
  { v: 6, w: 4 },
  { v: 7, w: 3 },
  { v: 8, w: 3 },
  { v: 9, w: 2 },
  { v: 10, w: 2 },
  { v: 11, w: 1 },
  { v: 12, w: 1 },
];

const CATEGORY_MULTIPLIER: Record<string, number> = {
  약국: 0.4,
};

interface CategoryProb {
  tasty: number;
  friendly: number;
  valuable: number;
  comfortable: number;
}

const PROB_TABLE: Record<string, CategoryProb> = {
  한식: { tasty: 0.75, friendly: 0.55, valuable: 0.5, comfortable: 0.4 },
  일식: { tasty: 0.8, friendly: 0.5, valuable: 0.35, comfortable: 0.45 },
  중식: { tasty: 0.7, friendly: 0.5, valuable: 0.55, comfortable: 0.4 },
  양식: { tasty: 0.75, friendly: 0.55, valuable: 0.4, comfortable: 0.55 },
  햄버거: { tasty: 0.65, friendly: 0.5, valuable: 0.55, comfortable: 0.5 },
  돈까스: { tasty: 0.8, friendly: 0.5, valuable: 0.6, comfortable: 0.4 },
  카레: { tasty: 0.7, friendly: 0.55, valuable: 0.5, comfortable: 0.45 },
  찜닭: { tasty: 0.75, friendly: 0.55, valuable: 0.5, comfortable: 0.4 },
  동남아요리: { tasty: 0.7, friendly: 0.55, valuable: 0.45, comfortable: 0.5 },
  음식점: { tasty: 0.65, friendly: 0.5, valuable: 0.5, comfortable: 0.45 },
  카페: { tasty: 0.55, friendly: 0.65, valuable: 0.4, comfortable: 0.75 },
  '제과/베이커리': { tasty: 0.7, friendly: 0.55, valuable: 0.45, comfortable: 0.55 },
  약국: { tasty: 0.05, friendly: 0.75, valuable: 0.65, comfortable: 0.55 },
};

const DEFAULT_PROB: CategoryProb = {
  tasty: 0.6,
  friendly: 0.55,
  valuable: 0.45,
  comfortable: 0.45,
};

export function pickReviewCount(category: string, rng: Rng): number {
  const base = pickWeighted(REVIEW_COUNT_WEIGHTS, rng);
  const m = CATEGORY_MULTIPLIER[category] ?? 1.0;
  return Math.max(0, Math.min(12, Math.round(base * m)));
}

export function generateReview(category: string, rng: Rng): GeneratedReview {
  const p = PROB_TABLE[category] ?? DEFAULT_PROB;
  const flags: ReviewFlags = {
    isTasty: rng() < p.tasty,
    isFriendly: rng() < p.friendly,
    isValuable: rng() < p.valuable,
    isComfortable: rng() < p.comfortable,
  };

  if (!flags.isTasty && !flags.isFriendly && !flags.isValuable && !flags.isComfortable) {
    const key = pickWeighted<keyof ReviewFlags>(
      [
        { v: 'isTasty', w: p.tasty },
        { v: 'isFriendly', w: p.friendly },
        { v: 'isValuable', w: p.valuable },
        { v: 'isComfortable', w: p.comfortable },
      ],
      rng
    );
    flags[key] = true;
  }

  const content = pickContent(category, flags, rng);
  return { ...flags, content, isReported: false };
}

function pickContent(category: string, flags: ReviewFlags, rng: Rng): string {
  const pool: string[] = [...(CATEGORY_CONTENTS[category] ?? CATEGORY_CONTENTS.default)];
  if (flags.isTasty) pool.push(...TRAIT_CONTENTS.tasty);
  if (flags.isFriendly) pool.push(...TRAIT_CONTENTS.friendly);
  if (flags.isValuable) pool.push(...TRAIT_CONTENTS.valuable);
  if (flags.isComfortable) pool.push(...TRAIT_CONTENTS.comfortable);

  let base = pickOne(pool, rng);
  if (rng() < 0.2) base = `${base} ${pickOne(pool, rng)}`;
  if (rng() < 0.1) base = '';
  return base;
}

export function aggregateCounts(reviews: ReviewFlags[]): AggregatedCounts {
  return reviews.reduce<AggregatedCounts>(
    (acc, r) => ({
      reviewCount: acc.reviewCount + 1,
      tastyCount: acc.tastyCount + (r.isTasty ? 1 : 0),
      friendlyCount: acc.friendlyCount + (r.isFriendly ? 1 : 0),
      valuableCount: acc.valuableCount + (r.isValuable ? 1 : 0),
      comfortableCount: acc.comfortableCount + (r.isComfortable ? 1 : 0),
    }),
    { reviewCount: 0, tastyCount: 0, friendlyCount: 0, valuableCount: 0, comfortableCount: 0 }
  );
}

export function pickLikeCount(reviewCount: number, rng: Rng): number {
  if (reviewCount === 0) return Math.floor(rng() * 3);
  const multiplier = 1 + Math.floor(rng() * 5);
  const noise = Math.floor(rng() * 10);
  return reviewCount * multiplier + noise;
}
