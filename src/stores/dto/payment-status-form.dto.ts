import { PickType } from '@nestjs/swagger';
import { StoreEntity } from '../stores.entity';

export class PaymentStatusFormDTO extends PickType(StoreEntity, ['paymentStatus'] as const) {}
