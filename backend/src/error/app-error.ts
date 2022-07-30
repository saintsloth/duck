import { set } from 'lodash';
import { ErrorInner } from './error-inner';

interface AppErrorParams {
  statusCode: number;
  name: string;
  message?: string;
  errors: Object[];
}

export class AppError extends ErrorInner {
  statusCode: number;

  errors: Object[];

  constructor(inner: AppErrorParams) {
    const appInnerParams = {
      name: inner.name,
    };
    if (inner.message) set(appInnerParams, 'message', inner.message);
    super(appInnerParams);

    this.statusCode = inner.statusCode;
    this.errors = inner.errors ?? [];
  }
}
