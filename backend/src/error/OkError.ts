interface OkErrorParams {
  name: string;
  statusCode?: number;
  message?: string;
}

export class OkError extends Error {
  statusCode: number;
  errors: boolean = false;

  constructor(params: OkErrorParams) {
    super();
    this.name = params.name;
    this.statusCode = params.statusCode ?? 200;
    this.message = params.message ?? 'message is not exist';
  }
}
