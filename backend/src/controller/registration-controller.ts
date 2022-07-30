import {
  Controller, Get, Post, Body, HttpCode, QueryParams, Req,
} from 'routing-controllers';
import 'reflect-metadata';
import mongoose, { MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';
import { has, set } from 'lodash';
import { logger } from '../lib/logger';
import { UserDbModel, RegisterModel } from '../model/user-model';
import { AppError } from '../error/app-error';
import { OkError } from '../error/ok-error';
import { getSessionId } from '../lib/getSessionId';

@Controller()
export class RegistrationController {
  /**
   * Create a new user
   */
  @Post('/register')
  @HttpCode(201)
  async postOne(@Req() request: Request, @Body() user: RegisterModel) {
    const sessionId = getSessionId(request);
    logger.silly(`post request received: ${JSON.stringify(user)}`, { sessionId });

    const loginIsExist = await UserDbModel.findOne({ username: user.username });
    if (loginIsExist) {
      throw new OkError({
        name: 'signup-username-is-exist',
        statusCode: 409,
      });
    }
    const emailIsExist = await UserDbModel.findOne({ email: user.email });
    if (emailIsExist) {
      throw new OkError({
        name: 'signup-email-is-exist',
        statusCode: 409,
      });
    }

    const salt = bcrypt.genSaltSync(10);
    logger.silly(`salt is: ${salt}`, { sessionId });
    const hash = await bcrypt.hash(user.password, salt);
    logger.silly(`hash is: ${hash}`, { sessionId });

    const userDb = new UserDbModel({
      _id: new mongoose.Types.ObjectId(),
      username: user.username,
      email: user.email,
      password: hash,
    });

    try {
      await userDb.save();
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new AppError({
          name: 'database-save-error',
          statusCode: 500,
          errors: [error],
        });
      }
    }

    return {
      ok: true,
    };
  }

  /**
   * Check exist username and email in DB
   */
  @Get('/register')
  @HttpCode(200)
  // eslint-disable-next-line max-len
  async getOne(@Req() request: Request, @QueryParams() query: { username?: string, email?: string }) {
    const sessionId = getSessionId(request);
    logger.silly(`get query received: ${JSON.stringify(query)}`, { sessionId });

    const response = {};

    if (has(query, 'username')) {
      const loginIsExist = await UserDbModel.findOne({ username: query.username });
      if (loginIsExist) {
        set(response, 'username', {
          name: 'check-username-is-exist',
        });
      } else {
        set(response, 'username', {
          ok: true,
        });
      }
    }

    if (has(query, 'email')) {
      const emailIsExist = await UserDbModel.findOne({ email: query.email });
      if (emailIsExist) {
        set(response, 'email', {
          name: 'check-email-is-exist',
        });
      } else {
        set(response, 'email', {
          ok: true,
        });
      }
    }

    if (has(query, 'username') || has(query, 'email')) {
      return response;
    }

    return {
      ok: false,
      message: 'В запросе нет username или email. Необходимо наличие одного из них в query string',
    };
  }
}
