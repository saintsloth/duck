interface AppErrorParams {
  name: string;
  statusCode: number;
  message?: string;
  errors: any;
}

export class AppError extends Error {
  statusCode: number;
  errors: any;

  constructor(params: AppErrorParams) {
    super();
    this.name = params.name;
    this.statusCode = params.statusCode;
    if (params.message) this.message = params.message;
    this.errors = params.errors ?? true;
  }
}
