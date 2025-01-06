// 참고:  https://tmap-skopenapi.readme.io/reference/%EC%9E%A5%EC%86%8C%ED%86%B5%ED%95%A9%EA%B2%80%EC%83%89

interface NewAddress {
  centerLat: string;
  centerLon: string;
  frontLat: string;
  frontLon: string;
  roadName: string;
  bldNo1: string;
  bldNo2: string;
  roadId: string;
  fullAddressRoad: string;
}

interface EvCharger {
  operatorId: string;
  stationId: string;
  chargerId: string;
  status: string;
  type: string;
  powerType: string;
  operatorName: string;
  chargingDateTime: string;
  updateDateTime: string;
  isFast: string;
  isAvailable: string;
}

interface GroupSub {
  subPkey: string;
  subSeq: string;
  subName: string;
  subCenterY: string;
  subCenterX: string;
  subNavY: string;
  subNavX: string;
  subPoild: string;
  subNavSeq: string;
  subClassCd: string;
  subClassNmA: string;
  subClassNmB: string;
  subClassNmC: string;
  subClassNmD: string;
}

type CoordinateType = 'WGS84GEO' | 'EPSG3857' | 'KATECH';

export interface Poi {
  id: string; // POI ID
  pkey: string; // POI 식별자
  navSeq: string; // 입구지점 일련번호
  collectionType: string; // 컬렉션 출처(poi, address)
  name: string; // 시설물 명칭
  telNo: string; // 전화번호
  frontLat: string; // 시설물 입구 위도 좌표
  frontLon: string; // 시설물 입구 경도 좌표
  noorLat: string; // 중심점 위도 좌표
  noorLon: string; // 중심정 경도 좌표
  upperAddrName: string; // 주소 대분류
  middleAddrName: string; // 주소 중분류
  lowerAddrName: string; // 주소 소분류
  detailAddrName: string; // 상세 주소
  mlClass: string; // 지번주소 산/대지구분
  firstNo: string; // 지번 본번
  secondNo: string; // 지번 부번
  roadName: string; // 도로명
  firstBuildNo: string; // 도로명주소 건물번호1
  secondBuildNo: string; // 도로명주소 건물번호2
  radius: string; // 요청 좌표로 부터의 거리
  bizName: string; // 업종 분류
  upperBizName: string; // 업종 대분류
  middleBizName: string; // 업종 중분류
  lowerBizName: string; // 업종 소분류
  detailBizName: string; // 업종 상세 분류
  rpFlag: string;
  parkFlag: string;
  detailInfoFlag: string;
  desc: string;
  dataKind: string;
  zipCode: string;
  adminDongCode: string;
  legalDongCode: string;
  newAddressList: {
    newAddress: NewAddress[];
  };
  evChargers: {
    evCharger: EvCharger[];
  };
  groupSubLists: {
    groupSub: GroupSub[];
  };
}

export type SearchTypCd = 'A' | 'R'; // 결과 정렬 순서 default A, A = 정확도순,  R = 거리순

// =================================== API ===================================

export interface RequestSearchPoiInfo {
  version: '1';
  searchKeyword: string;
  searchType?: 'all' | 'name' | 'telno'; // default all
  areaLLCode?: string; // 지역 대분류 코드
  areaLMCode?: string; // 지역 중분류 코드
  searchtypCd?: SearchTypCd; // 결과 정렬 순서 default A, A = 정확도순,  R = 거리순
  centerLon?: number;
  centerLat?: number;
  reqCoordType?: CoordinateType; // default WGS84GEO
  resCoordType?: CoordinateType; // default WGS84GEO
  radius?: number; // 검색 반경 1 ~ 33km, 0인 경우 전국
  page?: number; // default 1
  count?: number; // default 20, 최소 1, 최대 200
  multiPoint?: 'Y' | 'N'; // default N, 상세 정보 링크 참고
  poiGroupYn?: 'Y' | 'N'; // default N, 상세 정보 링크 참고
}

export interface ResponseSearchPoiInfo {
  searchPoiInfo: {
    totalCount: string;
    count: string;
    page: string;
    pois: {
      poi: Poi[];
    };
  };
}

export interface RequestPoiInfo {
  version: '1';
  findOption?: 'id' | 'key'; // default id
  resCoordType?: CoordinateType; // default WGS84GEO
  navSeq?: string;
  callback?: string;
}

export interface ResponsePoiInfo {
  poiDetailInfo: {
    id: string;
    viewId: string;
    dbKind: string;
    pkey: string;
    navSeq: string;
    name: string;
    bizCatName: string;
    address: string;
    firstNo: string;
    secondNo: string;
    zipCode: string;
    tel: string;
    mlClass: string;
    lcdName: string;
    mcdName: string;
    scdName: string;
    dcdName: string;
    bldAddr: string;
    roadScdName: string;
    roadName: string;
    bldNo1: string;
    bldNo2: string;
    lat: string;
    lon: string;
    frontLat: string;
    frontLon: string;
    menu1: string;
    menu2: string;
    menu3: string;
    menu4: string;
    menu5: string;
    parkFlag: string;
    twFlag: string;
    yaFlag: string;
    homepageURL: string;
    routeInfo: string;
    facility: string;
    upperLegalCode: string;
    middleLegalCode: string;
    lowerLegalCode: string;
    detailLegalCode: string;
    upperAdminCode: string;
    middleAdminCode: string;
    lowerAdminCode: string;
    upperCode: string;
    middleCode: string;
    lowerCode: string;
    participant: string;
    point: string;
    merchantFlag: string;
    merchantDispType: string;
    additionalInfo: string;
    desc: string;
    mngName: string;
    mngId: string;
    freeYn: string;
    reservYn: string;
    useTime: string;
    payYn: string;
    fee: string;
    updateDt: string;
    totalCnt: string;
    evChargers: EvCharger[];
  };
}

export interface ErrorResponse {
  error: {
    id: string;
    category: string;
    code: string;
    message: string;
  };
}
