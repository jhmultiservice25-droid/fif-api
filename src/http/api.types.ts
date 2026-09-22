export type ApiSuccess<T> = {
  success: true;
  statusCode: number;
  data: T;
};

export type ApiError = {
  success: false;
  statusCode: number;
  message: string;
  errors?: string[];
};
