import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './reviews.entity';
import { DataSource, Repository } from 'typeorm';
import { ReviewFormDTO } from './dto/review-form.dto';
import { StoreEntity } from 'src/stores/stores.entity';
import { EXCEPTION } from 'src/constants/message';

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
}
