import dotenv from 'dotenv';
import morgan from 'morgan';
import { useExpressServer } from 'routing-controllers';
import express, { Express, RequestHandler } from 'express';
import httpContext from 'express-http-context';
import bodyParser from 'body-parser';
import { getLogger } from './helper/logger';
import { UserController } from './controller/UserController';
import { GlobalErrorHandler } from "./middleware/GlobalErrorHandler";
// import swaggerUI from 'swagger-ui-express';
// import * as swaggerDocument from '../src/swagger/openapi.json';
import cors from 'cors';
import { dbConnect } from './helper/database';
import { RegistrationController } from './controller/RegistrationController';
import path from 'path';
import { SigninController } from './controller/SigninController';
import { checkEnvironmentVariables } from './helper/checkEnvironmentVariables';

export const app = async () => {
  dotenv.config({
    path: path.resolve(process.cwd(), `.${process.env.NODE_ENV}.env`)
  });

  checkEnvironmentVariables();

  await dbConnect({
    login: process.env.DB_LOGIN as string,
    password: process.env.DB_PASSWORD as string,
    port: process.env.DB_PORT as string,
    host: process.env.DB_HOST as string,
    database: process.env.DB_NAME as string
  });

  const app: Express = express();
  app.use(cors() as RequestHandler);
  app.use(bodyParser.json());
  app.use(httpContext.middleware);
  useExpressServer(app, {
    controllers: [UserController, RegistrationController, SigninController],
    middlewares: [GlobalErrorHandler],
    defaultErrorHandler: false,
    authorizationChecker,
  });

  app.use(morgan('dev', {
    stream: new class {
      write(text: string) {
        getLogger().http(text);
      }
    }()
  }));

  // app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  const port = process.env.APP_PORT as string;
  app.listen(port, () => getLogger().http(`Running on port ${port}`));
}