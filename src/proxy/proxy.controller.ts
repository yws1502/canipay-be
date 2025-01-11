import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProxyService } from './proxy.service';
import { SearchTypCd } from 'src/types/tmap';
import { responseExampleForProxyStore } from 'src/constants/swagger';
import { RequiredValidationPipe } from 'src/common/pipes/required-validation.pipe';

@ApiTags('Proxy')
@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('stores')
  @ApiOperation({
    summary: '장소 통합 검색 (T Map)',
  })
  @ApiQuery({ name: 'search', required: true, type: 'string' })
  @ApiQuery({ name: 'skip', required: false, type: 'number', default: 0 })
  @ApiQuery({ name: 'take', required: false, type: 'number', default: 10 })
  @ApiQuery({
    name: 'radius',
    required: false,
    type: 'number',
    description: '검색 반경 1 ~ 33km, 0인 경우 전국',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['A', 'R'],
    default: 'A',
    description: '결과 정렬 순서 A = 정확도순, R = 거리순',
  })
  @ApiResponse(responseExampleForProxyStore.list)
  searchStoreList(
    @Query('search', new RequiredValidationPipe()) search: string,
    @Query('skip') skip?: number | typeof NaN,
    @Query('take') take?: number | typeof NaN,
    @Query('radius') radius?: number | typeof NaN,
    @Query('sortBy') sortBy?: SearchTypCd
  ) {
    return this.proxyService.searchStoreList(search, skip, take, radius, sortBy);
  }

  @Get('stores/:id')
  @ApiOperation({
    summary: '장소 상세 정보 조회 (T Map)',
  })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse(responseExampleForProxyStore.detail)
  getStore(@Param('id') id: string) {
    return this.proxyService.getStore(id);
  }
}
