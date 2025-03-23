import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum LikeAction {
  LIKE = 'like',
  UNLIKE = 'unlike',
}

export class StoreLikeDTO {
  @ApiProperty()
  @IsEnum(LikeAction)
  action: LikeAction;
}
