const host = process.env.REACT_APP_SERVER_HOST as string;

export const routes = {
  baseURL: () => host,
  registerPath: () => ['register'].join('/'),
  loggerPath: () => ['logger'].join('/'),
  signinPath: () => ['signin'].join('/'),
};
