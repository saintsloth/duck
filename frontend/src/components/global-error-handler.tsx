import React from 'react';
import { get, has } from 'lodash';
import { logger } from '../lib/logger';
import { Navigate } from 'react-router-dom';

export class GlobalErrorHandler extends React.Component {
  public static catcherOfAsyncAndHandlersErrors = (
    msg: Event | string,
    url: string | undefined,
    lineNo: number | undefined,
    columnNo: number | undefined,
    error: Error | undefined
  ) => {
    if (has(error, 'status') || has(error, 'response.status')) {
      const status = get(error, 'status') ?? get(error, 'response.status');
      switch (status) {
        /** Unauthorized **/
        case 401: {
          logger.info(`Unauthorized error: ${error}`)
          window.location.href = '/signin';
          break;
        }
        /** IsExist **/
        case 409: {
          logger.warn(`IsExist error: ${error}`)
          // setResponse({response, spice: t('error_message__is_exist')})
          break;
        }
        /** Ошибка валидации **/
        case 400: {
          logger.error(`Validation error: ${error}`)
          // setResponse({response, spice: t('error_message__validation')})
          break;
        }
        /** i'm a teapot - обработанная, но непредвиденная ошибка в коде бекенда **/
        case 418: {
          logger.error(`Teapot error: ${error}`)
          // setResponse({response, spice: t('error_message__teapot')})
          break;
        }
        /** internal server error - если сервер упал || unexpected database error - если у нее есть httpCode, но не должно **/
        case 500: {
          logger.warn(`Internal server error: ${error}`)
          // setResponse({response, spice: t('error_message__internal_server_error')})
          break;
        }
      }
    } else {
      /** если UseEffect съел нервную систему * */
      // if (!(msg instanceof Event)) {
      //   if (msg.indexOf('is not defined') >= 0) {
      //     throw error;
      //   }
      // }
      const errorArray = [];
      if (msg) errorArray.push(`msg: ${msg}`);
      if (url) errorArray.push(`url: ${url}`);
      if (lineNo) errorArray.push(`lineNo: ${lineNo}`);
      if (columnNo) errorArray.push(`columnNo: ${columnNo}`);
      if (error) errorArray.push(`error: ${error}`);

      logger.error(`! Unexpected error: ${errorArray.join(', ')}`);
    }
  }

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    logger.error(`GlobalErrorHandler, getDerivedStateFromError: ${error}`);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    logger.error(`GlobalErrorHandler, componentDidCatch: ${errorInfo}, ${error}`);
  }

  static catchMe = (error: any) => GlobalErrorHandler
    .catcherOfAsyncAndHandlersErrors('catchMe', undefined, undefined, undefined, error);

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    try {
      // @ts-ignore
      return this.props.children;
    } catch (error) {
      logger.error(`Test Error catcher: ${error}`);
    }
  }
}
