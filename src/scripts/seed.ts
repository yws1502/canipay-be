import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { ReviewEntity } from 'src/reviews/reviews.entity';
import { StoreEntity } from 'src/stores/stores.entity';
import { PaymentStatusEnum } from 'src/types/store';
import { makeMulberry32 } from './seed/rng';
import {
  aggregateCounts,
  generateReview,
  pickLikeCount,
  pickReviewCount,
} from './seed/generateReviews';

interface SampleStore {
  id: string;
  name: string;
  category: string;
  address: string;
  lon: string;
  lat: string;
  paymentStatus: PaymentStatusEnum;
}

interface SeedOptions {
  clean: boolean;
  skipExisting: boolean;
  seed?: number;
}

function parseArgs(argv: string[]): SeedOptions {
  const opts: SeedOptions = { clean: true, skipExisting: false, seed: undefined };
  for (const a of argv.slice(2)) {
    if (a === '--no-clean') opts.clean = false;
    else if (a === '--skip-existing') {
      opts.clean = false;
      opts.skipExisting = true;
    } else if (a.startsWith('--seed=')) {
      const n = Number(a.split('=')[1]);
      if (!Number.isFinite(n)) throw new Error(`Invalid seed: ${a}`);
      opts.seed = n;
    } else {
      throw new Error(`Unknown argument: ${a}`);
    }
  }
  return opts;
}

async function main() {
  const opts = parseArgs(process.argv);
  const seedValue = opts.seed ?? Date.now();
  const rng = makeMulberry32(seedValue);

  const sampleDataPath = path.resolve(process.cwd(), 'sampleData.json');
  if (!fs.existsSync(sampleDataPath)) {
    throw new Error(`sampleData.json not found at ${sampleDataPath}`);
  }
  const stores: SampleStore[] = JSON.parse(fs.readFileSync(sampleDataPath, 'utf-8'));

  console.info(
    `[seed] options: clean=${opts.clean}, skipExisting=${opts.skipExisting}, seed=${seedValue}`
  );
  console.info(`[seed] loaded ${stores.length} stores from sampleData.json`);

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const dataSource = app.get(DataSource);

  try {
    await dataSource.transaction(async (manager) => {
      if (opts.clean) {
        await manager.delete(ReviewEntity, {});
        await manager.delete(StoreEntity, {});
        console.info('[seed] cleaned STORE and REVIEW tables');
      }

      let totalReviews = 0;
      let insertedStores = 0;

      for (const r of stores) {
        if (!opts.clean && opts.skipExisting) {
          const exists = await manager.findOne(StoreEntity, { where: { id: r.id } });
          if (exists) continue;
        }

        const reviewCount = pickReviewCount(r.category, rng);
        const reviews = Array.from({ length: reviewCount }, () => generateReview(r.category, rng));
        const counts = aggregateCounts(reviews);

        const store = manager.create(StoreEntity, {
          id: r.id,
          name: r.name,
          category: r.category,
          address: r.address,
          lon: r.lon,
          lat: r.lat,
          paymentStatus: r.paymentStatus,
          reviewCount: counts.reviewCount,
          tastyCount: counts.tastyCount,
          friendlyCount: counts.friendlyCount,
          valuableCount: counts.valuableCount,
          comfortableCount: counts.comfortableCount,
          likeCount: pickLikeCount(reviewCount, rng),
        });
        await manager.save(store);
        insertedStores += 1;

        if (reviews.length) {
          const entities = reviews.map((rv) => manager.create(ReviewEntity, { ...rv, store }));
          await manager.save(ReviewEntity, entities);
          totalReviews += reviews.length;
        }
      }

      console.info(`[seed] inserted ${insertedStores} stores, ${totalReviews} reviews`);
    });
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
