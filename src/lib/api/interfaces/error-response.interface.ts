export interface ErrorResponse<T> {
  readonly data: T;
  readonly status: number;
}
