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

      store.reviewCount += 1;

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
      .andWhere('review.isReported = false')
      .orderBy('review.createdAt', 'DESC')
      .take(take)
      .skip(skip * take)
      .getManyAndCount();

    return {
      data: reviews,
      totalCount,
      totalPage: Math.ceil(totalCount / take),
    };
  }

  async report(id: string) {
    const review = await this.findOneById(id);

    review.isReported = true;
    await this.reviewRepository.update(id, review);

    return review;
  }

  async unreport(id: string) {
    const review = await this.findOneById(id);

    review.isReported = false;
    await this.reviewRepository.update(id, review);

    return review;
  }

  async delete(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const review = await queryRunner.manager.findOne(ReviewEntity, {
        where: { id },
        relations: ['store'],
      });
      const { store } = review;

      await queryRunner.manager.softDelete(ReviewEntity, id);
      store.reviewCount -= 1;
      await queryRunner.manager.save(store);

      await queryRunner.commitTransaction();
      return { message: '삭제되었습니다.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOneById(id: string) {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) throw new NotFoundException(EXCEPTION.NOT_FOUND_REVIEW);

    return review;
  }

  async list(take = DEFAULT_TAKE, skip = DEFAULT_SKIP, isReported = false) {
    const queryBuilder = this.reviewRepository.createQueryBuilder('review');

    if (isReported) queryBuilder.where('review.isReported = :isReported', { isReported });

    const [reviews, totalCount] = await queryBuilder
      .orderBy('review.createdAt', 'DESC')
      .take(take)
      .skip(skip * take)
      .getManyAndCount();

    return {
      data: reviews,
      totalCount,
      totalPage: Math.ceil(totalCount / take),
    };
  }
}
