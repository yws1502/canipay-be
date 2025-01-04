import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { DEFAULT_SKIP, DEFAULT_TAKE } from 'src/constants/page';
import { ResponseSearchPoiInfo } from 'src/types/tmap';
import { SearchTypCd } from 'src/types/tmap';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async searchStoreList(
    search: string,
    skip = DEFAULT_SKIP + 1,
    limit = DEFAULT_TAKE,
    radius?: number,
    sortBy?: SearchTypCd
  ) {
    this.logger.log(
      `Sending Open API GET request to ${this.configService.get<string>('T_MAP_API_URL')}`
    );
    const response = await firstValueFrom(
      this.httpService
        .get<ResponseSearchPoiInfo>('', {
          params: {
            searchKeyword: search,
            page: skip,
            count: limit,
            radius,
            searchtypCd: sortBy,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw 'An error happened!';
          })
        )
    );

    const { searchPoiInfo } = response.data;

    const storeList = searchPoiInfo.pois.poi.map((item) => {
      return {
        id: item.id,
        name: item.name,
        lat: item.newAddressList.newAddress[0].centerLat,
        lon: item.newAddressList.newAddress[0].centerLon,
        address: item.newAddressList.newAddress[0].fullAddressRoad,
        tel: item.telNo,
        category: item.lowerBizName,
      };
    });

    return {
      stores: storeList,
      totalCount: searchPoiInfo.totalCount,
      totalPage: Math.ceil(Number(searchPoiInfo.totalCount) / Number(searchPoiInfo.count)),
    };
  }
}
