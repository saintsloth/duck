import {
  Controller, Post, Body, HttpCode, Header, Req, CookieParam
} from 'routing-controllers';
import 'reflect-metadata';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { MongooseError } from 'mongoose';
import { UserDbModel, UserModel } from '../model/user-model';
import { AppError } from '../error/app-error';
import { OkError } from '../error/ok-error';
import { AuthDbModel } from '../model/auth-model';
import { logger } from '../lib/logger';
import { getSessionId } from '../lib/getSessionId';

@Controller()
export class SigninController {
  /**
   * Get the token
   */
  @Post('/signin')
  @Header('alg', 'HS256')
  @Header('typ', 'JWT')
  @HttpCode(200)
  async postOne(@Req() request: Object, @Body() auth: UserModel, @CookieParam('connect.sid') sessionId: string) {
    if (!(auth.username || auth.email)) {
      throw new OkError({
        name: 'signin-login-missing',
        statusCode: 400,
      });
    }
    let findUser;
    if (auth.username) findUser = await UserDbModel.findOne({ username: auth.username });
    else findUser = await UserDbModel.findOne({ email: auth.email });

    const authFail = new OkError({
      name: 'signin-fail',
      statusCode: 401,
    });

    if (!findUser) throw authFail;

    const match = await bcrypt.compare(auth.password, findUser.password);
    if (!match) throw authFail;

    // eslint-disable-next-line no-underscore-dangle
    const userId = findUser._id;

    const JWTToken = jwt.sign(
      { _id: userId },
      process.env.SECRET_KEY as string,
      { expiresIn: '2h' },
    );

    const findAuth = await AuthDbModel.findOne({
      user_id: userId,
      session_id: sessionId,
    });

    if (findAuth !== null) {
      findAuth.update({ token: JWTToken });
      return {
        ok: true,
        token: JWTToken,
      };
    }

    const authDb = new AuthDbModel({
      _id: new mongoose.Types.ObjectId(),
      user_id: userId,
      session_id: sessionId,
      token: JWTToken,
    });

    try {
      await authDb.save();
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
      token: JWTToken,
    };
  }
}
