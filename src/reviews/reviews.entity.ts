import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsUUID } from 'class-validator';
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
  @Column({ type: 'boolean', default: false })
  isTasty: boolean;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isFriendly: boolean;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isValuable: boolean;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isComfortable: boolean;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  content: string | null;

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

  @Column({ type: 'boolean', default: false })
  isReported: boolean;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date | null;
}
