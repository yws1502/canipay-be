import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from './stores.entity';
import { Repository } from 'typeorm';
import { StoreFormDTO } from './dto/store-form.dto';

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
}
