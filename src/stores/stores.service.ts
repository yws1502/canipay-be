import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DEFAULT_SKIP, DEFAULT_TAKE } from 'src/constants/page';
import { StoreFormDTO } from './dto/store-form.dto';
import { StoreEntity } from './stores.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>
  ) {}

  async registerStore(storeFormDto: StoreFormDTO) {
    const store = this.storeRepository.create(storeFormDto);
    await this.storeRepository.save(store);

    return store;
  }

  async getStores(take = DEFAULT_TAKE, skip = DEFAULT_SKIP) {
    console.log(take, skip);

    const [stores, totalCount] = await this.storeRepository
      .createQueryBuilder('store')
      .orderBy('store.createdAt')
      .take(take)
      .skip(skip)
      .getManyAndCount();

    return {
      stores,
      totalCount,
      totalPage: Math.ceil(totalCount / take),
    };
  }
}
