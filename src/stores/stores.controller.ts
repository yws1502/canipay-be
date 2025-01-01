import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
}
