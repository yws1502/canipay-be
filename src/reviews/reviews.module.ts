import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './reviews.entity';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity])],
  providers: [ReviewsService],
  exports: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
