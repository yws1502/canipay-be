import { OmitType } from '@nestjs/swagger';
import { StoreEntity } from '../stores.entity';

export class StoreFormDTO extends OmitType(StoreEntity, [
  'tastyCount',
  'friendlyCount',
  'valuableCount',
  'comfortableCount',
  'likeCount',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const) {}
