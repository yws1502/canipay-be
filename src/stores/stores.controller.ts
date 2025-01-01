import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { StoreFormDTO } from './dto/store-form.dto';
import { responseExampleForStore } from 'src/constants/swagger';

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
}
