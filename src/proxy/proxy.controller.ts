import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProxyService } from './proxy.service';
import { SearchTypCd } from 'src/types/tmap';
import { ResponseExampleForProxyStore } from 'src/constants/swagger';

@ApiTags('Proxy')
@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('store-list')
  @ApiOperation({
    summary: '장소 통합 검색 (T Map)',
  })
  @ApiQuery({ name: 'search', required: true, type: 'string' })
  @ApiQuery({ name: 'skip', required: false, type: 'number', default: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', default: 10 })
  @ApiQuery({
    name: 'radius',
    required: false,
    type: 'number',
    description: '검색 반경 1 ~ 33km, 0인 경우 전국',
  })
  @ApiQuery({
    name: 'sort-by',
    required: false,
    enum: ['A', 'R'],
    default: 'A',
    description: '결과 정렬 순서 A = 정확도순, R = 거리순',
  })
  @ApiResponse(ResponseExampleForProxyStore.list)
  searchStoreList(
    @Query('search') search: string,
    @Query('skip') skip?: number | typeof NaN,
    @Query('limit') limit?: number | typeof NaN,
    @Query('radius') radius?: number | typeof NaN,
    @Query('sort-by') sortBy?: SearchTypCd
  ) {
    return this.proxyService.searchStoreList(search, skip, limit, radius, sortBy);
  }
}
