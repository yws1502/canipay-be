import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { PaymentStatus } from 'src/types/payment';
import { Column, Entity, Index } from 'typeorm';

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
  @IsNumber()
  @IsNotEmpty({ message: '경도를 작성해주세요.' })
  @Column({ type: 'numeric', nullable: false })
  longitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: '위도를 작성해주세요.' })
  @Column({ type: 'numeric', nullable: false })
  latitude: number;

  @ApiProperty()
  @IsEnum(PaymentStatus)
  @Column({ type: 'enum', enum: PaymentStatus })
  paymentStatus: PaymentStatus;
}
