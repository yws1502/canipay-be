const responseTemplate = <T>(data: T) => {
  return {
    schema: {
      example: data,
    },
  };
};

const deleteResponse = {
  message: '삭제되었습니다.',
};

const storeResponse = {
  id: 'string',
  name: 'string',
  category: 'string',
  address: 'string',
  lon: 'string',
  lat: 'string',
  paymentStatus: 'available | unavailable',
  reviewCount: 'number',
  tastyCount: 'number',
  friendlyCount: 'number',
  valuableCount: 'number',
  comfortableCount: 'number',
  likeCount: 'number',
  createdAt: 'date string',
  updatedAt: 'date string',
};

const proxyStoreResponse = {
  id: 'string',
  name: 'string',
  address: 'string',
  category: 'string',
  lat: 'string',
  lon: 'string',
  paymentStatus: 'available | unavailable | unregistered',
  reviewCount: 'number',
};

const reviewResponse = {
  id: 'uuid',
  isTasty: 'boolean',
  isFriendly: 'boolean',
  isValuable: 'boolean',
  isComfortable: 'boolean',
  content: 'string',
  isReported: 'boolean',
  createdAt: 'date string',
  updatedAt: 'date string',
};

export const responseExampleForStore = {
  register: responseTemplate(storeResponse),
  list: responseTemplate({
    data: [storeResponse],
    totalCount: 'number',
    totalPage: 'number',
  }),
  detail: responseTemplate(storeResponse),
  changePaymentStatus: responseTemplate(storeResponse),
  like: responseTemplate(storeResponse),
  delete: responseTemplate(deleteResponse),
};

export const responseExampleForProxyStore = {
  list: responseTemplate({
    data: [proxyStoreResponse],
    totalCount: 'number',
    totalPage: 'number',
  }),
  detail: responseTemplate(proxyStoreResponse),
};

export const responseExampleForReview = {
  create: responseTemplate({
    ...reviewResponse,
    store: storeResponse,
  }),
  list: responseTemplate({
    data: [reviewResponse],
    totalCount: 'number',
    totalPage: 'number',
  }),
  report: responseTemplate(reviewResponse),
  delete: responseTemplate(deleteResponse),
};
