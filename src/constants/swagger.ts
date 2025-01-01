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
  longitude: 'number',
  latitude: 'number',
  paymentStatus: 'available | unavailable',
  createdAt: 'date string',
  updatedAt: 'date string',
};

export const responseExampleForStore = {
  register: responseTemplate(storeResponse),
  list: responseTemplate({
    stores: [storeResponse],
    totalCount: 'number',
    totalPage: 'number',
  }),
  detail: responseTemplate(storeResponse),
  changePaymentStatus: responseTemplate(storeResponse),
  delete: responseTemplate(deleteResponse),
};
