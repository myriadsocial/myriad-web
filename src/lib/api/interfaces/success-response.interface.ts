export interface SuccessResponse<T> {
  readonly data: T;
  readonly status: number;
}
