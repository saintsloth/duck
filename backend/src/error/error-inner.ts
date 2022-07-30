interface OkErrorInnerParams {
  name: string;
  message?: string;
}

export class ErrorInner extends Error {
  constructor(params: OkErrorInnerParams) {
    super();
    this.name = params.name;
    if (params.message) this.message = params.message;
  }
}
