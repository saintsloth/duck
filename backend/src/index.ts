import dotenv from 'dotenv';
import morgan from 'morgan';
import { useExpressServer } from 'routing-controllers';
import express, { Express, RequestHandler } from 'express';
import httpContext from 'express-http-context';
import bodyParser from 'body-parser';
import { getLogger } from './helper/logger';
import { UserController } from './controller/UserController';
import { GlobalErrorHandler } from "./middleware/GlobalErrorHandler";
import swaggerUI from 'swagger-ui-express';
import * as swaggerDocument from '../src/swagger/openapi.json';
import cors from 'cors';

dotenv.config();
const port = process.env.PORT;

const app: Express = express();
app.use(cors() as RequestHandler);
app.use(bodyParser.json());
app.use(httpContext.middleware);
useExpressServer(app, {
  controllers: [UserController],
  middlewares: [GlobalErrorHandler],
  defaultErrorHandler: false
});

// eslint-disable-next-line class-methods-use-this
app.use(morgan('dev', { stream: new class { write(text: string) { getLogger().http(text); } }() }));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.listen(port, () => getLogger().http(`Running on port ${port}`));
