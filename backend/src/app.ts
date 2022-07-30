import dotenv from 'dotenv';
import morgan from 'morgan';
import { useExpressServer } from 'routing-controllers';
import express, { Express, RequestHandler } from 'express';
import httpContext from 'express-http-context';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongoSessionConnect from 'connect-mongodb-session';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { has, get } from 'lodash';
import { addMongoTransport as addLoggerMongoTransport, logger } from './lib/logger';
import { UserController } from './controller/user-controller';
import { GlobalErrorHandler } from './middleware/global-error-handler';
// import swaggerUI from 'swagger-ui-express';
// import * as swaggerDocument from '../src/swagger/openapi.json';
import { dbConnect } from './lib/database';
import { RegistrationController } from './controller/registration-controller';
import { SigninController } from './controller/signin-controller';
import { checkEnvironmentVariables } from './lib/check-environment-variables';
import { LoggerController } from './controller/logger-controller';
import { authorizationChecker } from './middleware/authorization-checker';

export const app = async () => {
  dotenv.config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
  });

  checkEnvironmentVariables();

  /** database * */
  const dbLogin = process.env.DB_LOGIN as string;
  const dbPassword = process.env.DB_PASSWORD as string;
  const dbHost = process.env.DB_HOST as string;
  const dbPort = process.env.DB_PORT as string;
  const dbName = process.env.DB_NAME as string;

  const dbConfig = {
    login: dbLogin,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: dbName,
  };

  await dbConnect(dbConfig);
  /** end * */

  /** логи в database * */
  addLoggerMongoTransport(dbConfig);
  /** end * */

  const application: Express = express();

  const backendProtocol = process.env.BACKEND_PROTOCOL;
  const backendHost = process.env.BACKEND_HOST;
  const backendPort = process.env.BACKEND_PORT;
  const frontendProtocol = process.env.FRONTEND_PROTOCOL;
  const frontendHost = process.env.FRONTEND_HOST;
  const frontendPort = process.env.FRONTEND_PORT;

  /** CORS * */
  const origin = [
    `${backendProtocol}://${backendHost}:${backendPort}`,
    `${frontendProtocol}://${frontendHost}:${frontendPort}`,
  ];
  const corsOptions = {
    origin,
    credentials: true,
  };
  application.use(cors(corsOptions) as RequestHandler);
  /** end * */

  /** Полезности * */
  application.use(bodyParser.json());
  application.use(httpContext.middleware);
  application.use(cookieParser(process.env.WEB_SESSION_SECRET_KEY as string));
  /** end * */

  /** Добавление идентификатора к каждой веб сессии * */
  const MongoDBStore = mongoSessionConnect(session);
  const sessionStore = new MongoDBStore({
    uri: `mongodb://${dbLogin}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`,
    collection: 'web-sessions',
  });
  // Catch errors mongo-session-connect
  sessionStore.on('error', (error) => {
    logger.error(`mongo-session-connect: ${error}`);
  });
  application.use(
    // TODO решить вопрос с временем жизни кукис
    session({
      secret: process.env.WEB_SESSION_SECRET_KEY as string,
      resave: true,
      saveUninitialized: true,
      store: sessionStore,
    }),
  );
  /** end * */

  /** morgan - http логгер * */
  application.use(morgan((tokens, request, response) => {
    /** мусорные логи * */
    if (get(request, 'method') === 'GET') {
      if (has(request, 'url')) {
        if (get(request, 'url').split('?')[0] === '/register') {
          return;
        }
      }
    }
    const { sessionID } = request;
    const message = [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
    ].join(' ');
    logger.http(message, { sessionId: sessionID });
    // eslint-disable-next-line consistent-return
    return null;
  }));
  /** end * */

  /** Контроллеры, мидлвары * */
  useExpressServer(application, {
    controllers: [UserController, RegistrationController, SigninController, LoggerController],
    middlewares: [GlobalErrorHandler],
    defaultErrorHandler: false,
    authorizationChecker,
  });
  /** end * */

  /** swagger - api документация * */
  // application.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  /** end * */

  /** Поехали * */
  application.listen(backendPort, () => logger.http(`Running on port ${backendPort}`));
};
