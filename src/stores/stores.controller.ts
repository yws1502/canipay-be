import { Controller, Get, Query, Post, Body, Param, Patch } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { StoreFormDTO } from './dto/store-form.dto';
import { responseExampleForStore } from 'src/constants/swagger';
import { PaymentStatusFormDTO } from './dto/payment-status-form.dto';

@ApiTags('Store')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiOperation({
    summary: '매장 등록',
  })
  @ApiResponse(responseExampleForStore.register)
  registerStore(@Body() storeFormDto: StoreFormDTO) {
    return this.storesService.registerStore(storeFormDto);
  }

  @Get()
  @ApiOperation({
    summary: '매장 목록 조회',
  })
  @ApiQuery({ name: 'skip', required: false, type: 'number' })
  @ApiQuery({ name: 'take', required: false, type: 'number' })
  @ApiResponse(responseExampleForStore.list)
  getStores(@Query('take') take?: number | typeof NaN, @Query('skip') skip?: number | typeof NaN) {
    return this.storesService.getStores(take, skip);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '매장 단건 조회',
  })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse(responseExampleForStore.detail)
  getStore(@Param('id') id: string) {
    return this.storesService.getStore(id);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: '매장 결제 가능 여부 변경',
    description: 'paymentStatus의 값은 available, unavailable만 가능합니다.',
  })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse(responseExampleForStore.changePaymentStatus)
  changePaymentStatus(@Param('id') id: string, @Body() paymentStatusFormDto: PaymentStatusFormDTO) {
    return this.storesService.changePaymentStatus(id, paymentStatusFormDto);
  }
}
