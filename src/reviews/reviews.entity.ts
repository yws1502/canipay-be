import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsString, IsUUID } from 'class-validator';
import { StoreEntity } from 'src/stores/stores.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('reviewId', ['id'], { unique: true })
@Entity({
  name: 'REVIEW',
})
export class ReviewEntity {
  @ApiProperty()
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isTasty: boolean;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isFriendly: boolean;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isValuable: boolean;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isComfortable: boolean;

  @ApiProperty()
  @IsString()
  @Column({ type: 'varchar', length: 100 })
  content: string;

  @ApiProperty()
  @ManyToOne(() => StoreEntity, (store: StoreEntity) => store.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'store_id',
    referencedColumnName: 'id',
  })
  store: StoreEntity;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date | null;
}
