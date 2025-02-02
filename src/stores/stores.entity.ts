import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { ReviewEntity } from 'src/reviews/reviews.entity';
import { PaymentStatusEnum } from 'src/types/store';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Index('storeId', ['id'], { unique: true })
@Entity({
  name: 'STORE',
})
export class StoreEntity extends CommonEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '이름을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '카테고리를 작성해주세요.' }) // TODO: 추후 별도 테이블로 관리 예정
  @Column({ type: 'varchar', nullable: false })
  category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '주소를 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '경도를 작성해주세요.' })
  @Column({ type: 'numeric', nullable: false })
  lon: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '위도를 작성해주세요.' })
  @Column({ type: 'numeric', nullable: false })
  lat: string;

  @ApiProperty()
  @IsEnum(PaymentStatusEnum)
  @Column({ type: 'enum', enum: PaymentStatusEnum })
  paymentStatus: PaymentStatusEnum;

  @ApiProperty()
  @OneToMany(() => ReviewEntity, (review: ReviewEntity) => review.store, { cascade: true })
  reviews: ReviewEntity[];

  @ApiProperty()
  @IsNumber()
  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @ApiProperty()
  @IsNumber()
  @Column({ type: 'int', default: 0 })
  tastyCount: number;

  @ApiProperty()
  @IsNumber()
  @Column({ type: 'int', default: 0 })
  friendlyCount: number;

  @ApiProperty()
  @IsNumber()
  @Column({ type: 'int', default: 0 })
  valuableCount: number;

  @ApiProperty()
  @IsNumber()
  @Column({ type: 'int', default: 0 })
  comfortableCount: number;
}
