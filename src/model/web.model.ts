export interface WebResponse<T> {
  data?: T;
  errors?: string;
  paging?: Paging;
}

export interface Paging {
  size: number;
  total_page: number;
  current_page: number;
}
