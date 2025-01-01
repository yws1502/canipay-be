import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DEFAULT_SKIP, DEFAULT_TAKE } from 'src/constants/page';
import { StoreFormDTO } from './dto/store-form.dto';
import { StoreEntity } from './stores.entity';
import { EXCEPTION } from 'src/constants/message';
import { PaymentStatusFormDTO } from './dto/payment-status-form.dto';

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

  async getStore(id: string) {
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) throw new NotFoundException(EXCEPTION.NOT_FOUND_STORE);

    return store;
  }

  async changePaymentStatus(id: string, paymentStatusFormDto: PaymentStatusFormDTO) {
    await this.storeRepository.update(id, paymentStatusFormDto);
    return this.getStore(id);
  }

  async deleteStore(id: string) {
    const store = await this.getStore(id);
    if (!store) throw new NotFoundException(EXCEPTION.NOT_FOUND_STORE);

    await this.storeRepository.softDelete(id);

    return {
      message: '삭제되었습니다.',
    };
  }
}
