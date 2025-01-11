import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './reviews.entity';
import { DataSource, Repository } from 'typeorm';
import { ReviewFormDTO } from './dto/review-form.dto';
import { StoreEntity } from 'src/stores/stores.entity';
import { EXCEPTION } from 'src/constants/message';
import { DEFAULT_SKIP, DEFAULT_TAKE } from 'src/constants/page';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly dataSource: DataSource
  ) {}

  async create(storeId: string, reviewForm: ReviewFormDTO) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const store = await queryRunner.manager.findOne(StoreEntity, { where: { id: storeId } });

      if (!store) throw new NotFoundException(EXCEPTION.NOT_FOUND_STORE);

      const review = queryRunner.manager.create(ReviewEntity, reviewForm);
      review.store = store;
      await queryRunner.manager.save(review);

      if (reviewForm.isTasty) store.tastyCount += 1;
      if (reviewForm.isFriendly) store.friendlyCount += 1;
      if (reviewForm.isValuable) store.valuableCount += 1;
      if (reviewForm.isComfortable) store.comfortableCount += 1;

      await queryRunner.manager.save(store);

      await queryRunner.commitTransaction();
      return review;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getReviewsByStore(storeId: string, take = DEFAULT_TAKE, skip = DEFAULT_SKIP) {
    const [reviews, totalCount] = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoin('review.store', 'store')
      .where('store.id = :storeId', { storeId })
      .take(take)
      .skip(skip - 1)
      .getManyAndCount();

    return {
      data: reviews,
      totalCount,
      totalPage: Math.ceil(totalCount / take),
    };
  }

  async report(id: string) {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) throw new NotFoundException(EXCEPTION.NOT_FOUND_REVIEW);

    review.isReported = true;
    await this.reviewRepository.update(id, review);

    const reportedReview = await this.reviewRepository.findOneBy({ id });
    return reportedReview;
  }

  async list(take = DEFAULT_TAKE, skip = DEFAULT_SKIP, isReported = false) {
    const queryBuilder = this.reviewRepository.createQueryBuilder('review');

    if (isReported) queryBuilder.where('review.isReported = :isReported', { isReported });

    const [reviews, totalCount] = await queryBuilder
      .take(take)
      .skip(skip - 1)
      .getManyAndCount();

    return {
      data: reviews,
      totalCount,
      totalPage: Math.ceil(totalCount / take),
    };
  }
}
