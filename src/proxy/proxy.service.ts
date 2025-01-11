import { HttpService } from '@nestjs/axios';
import { NotFoundException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { DEFAULT_SKIP, DEFAULT_TAKE } from 'src/constants/page';
import { StoresService } from 'src/stores/stores.service';
import { Store } from 'src/types/store';
import { Poi, RequestSearchPoiInfo, ResponsePoiInfo, ResponseSearchPoiInfo } from 'src/types/tmap';
import { SearchTypCd } from 'src/types/tmap';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly storesService: StoresService
  ) {}

  async searchStoreList(
    search: string,
    skip = DEFAULT_SKIP,
    take = DEFAULT_TAKE,
    radius?: number,
    sortBy?: SearchTypCd
  ) {
    this.logger.log(
      `Sending Open API GET request to ${this.configService.get<string>('T_MAP_API_URL')}`
    );

    const params: RequestSearchPoiInfo = {
      version: '1',
      searchKeyword: search,
      page: skip + 1,
      count: take,
      radius,
      searchtypCd: sortBy,
      multiPoint: 'Y',
    };

    const response = await firstValueFrom(
      this.httpService.get<ResponseSearchPoiInfo>('', { params }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw 'An error happened!';
        })
      )
    );

    const { searchPoiInfo } = response.data;

    const storeList = await this.generateStoreList(searchPoiInfo.pois.poi);

    return {
      data: storeList,
      totalCount: searchPoiInfo.totalCount,
      totalPage: Math.ceil(Number(searchPoiInfo.totalCount) / Number(searchPoiInfo.count)),
    };
  }

  private async generateStoreList(poi: Poi[]) {
    const storeList = await Promise.all(
      poi.map<Promise<Store>>(async (item) => {
        const existsStore = await this.storesService.getStore(item.id).catch(() => null);

        return {
          id: item.id,
          name: item.name,
          address: item.newAddressList.newAddress[0].fullAddressRoad,
          category: item.lowerBizName,
          lat: item.newAddressList.newAddress[0].centerLat,
          lon: item.newAddressList.newAddress[0].centerLon,
          paymentStatus: existsStore ? existsStore.paymentStatus : 'unregistered',
        };
      })
    );

    return storeList;
  }

  async getStore(id: string) {
    this.logger.log(
      `Sending Open API GET request to ${this.configService.get<string>('T_MAP_API_URL')}/${id}`
    );
    const response = await firstValueFrom(
      this.httpService
        .get<ResponsePoiInfo>(id, {
          params: {
            version: '1',
            findOption: 'id',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw new NotFoundException('An error happened!');
          })
        )
    );

    const { poiDetailInfo } = response.data;

    const bldNo =
      poiDetailInfo.bldNo2 === ''
        ? poiDetailInfo.bldNo1
        : `${poiDetailInfo.bldNo1}-${poiDetailInfo.bldNo2}`;

    const store: Store = {
      id: poiDetailInfo.id,
      name: poiDetailInfo.name,
      address: `${poiDetailInfo.bldAddr} ${bldNo}`,
      category: poiDetailInfo.bizCatName,
      lat: poiDetailInfo.lat,
      lon: poiDetailInfo.lon,
      paymentStatus: 'unregistered',
    };

    return store;
  }
}
