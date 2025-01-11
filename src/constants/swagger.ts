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
  tastyCount: 'number',
  friendlyCount: 'number',
  valuableCount: 'number',
  comfortableCount: 'number',
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
};

const reviewResponse = {
  id: 'uuid',
  isTasty: 'boolean',
  isFriendly: 'boolean',
  isValuable: 'boolean',
  isComfortable: 'boolean',
  content: 'string | null',
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
  delete: responseTemplate(deleteResponse),
};

export const ResponseExampleForProxyStore = {
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
};
