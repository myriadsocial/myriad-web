export interface BaseError {
  message: string;
  name: string;
  statusCode: number;
}

export interface BaseErrorResponse {
  error: BaseError;
}

export interface ErrorResponse<T> {
  readonly message: string;
  readonly name: string;
  readonly statusCode: number;
  readonly data?: T;
}
