/** API 응답 공통 타입 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** 페이지네이션 파라미터 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
