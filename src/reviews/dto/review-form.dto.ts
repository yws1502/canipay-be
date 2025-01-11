import { PickType } from '@nestjs/swagger';
import { ReviewEntity } from '../reviews.entity';

export class ReviewFormDTO extends PickType(ReviewEntity, [
  'isTasty',
  'isFriendly',
  'isValuable',
  'isComfortable',
  'content',
]) {}
