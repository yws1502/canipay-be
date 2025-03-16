export const EXCEPTION = {
  NOT_FOUND_STORE: '매장 정보를 찾을 수 없습니다.',
  NOT_FOUND_REVIEW: '리뷰 정보를 찾을 수 없습니다.',
  REQUIRED_FIELD: (field: string) => `${field} 값이 필요합니다.`,
  ALLOW_LIKE_ACTIONS: (value: string) => `'like' 또는 'unlike' 값만 허용됩니다. (입력값: ${value})`,
};
