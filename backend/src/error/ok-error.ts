import { set } from 'lodash';
import { ErrorInner } from './error-inner';

interface OkErrorParams {
  ok?: boolean;
  statusCode?: number;
  name: string;
  message?: string;
  errors?: Object[];
}

export class OkError extends ErrorInner {
  ok: boolean;

  statusCode: number;

  errors: Object[];

  constructor(inner: OkErrorParams) {
    const okInnerParams = {
      name: inner.name,
    };
    if (inner.message) set(okInnerParams, 'message', inner.message);
    super(okInnerParams);

    this.ok = inner.ok ?? false;
    this.statusCode = inner.statusCode ?? 200;
    this.errors = inner.errors ?? [];
  }
}
