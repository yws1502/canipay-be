import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './stores.entity';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity]), ReviewsModule],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
