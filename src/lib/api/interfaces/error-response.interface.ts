export interface BaseErrorData {
  message: string;
  name: string;
  statusCode: number;
}

export interface BaseErrorResponse {
  error: BaseErrorData;
}
