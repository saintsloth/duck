import {
  Controller, UseBefore, UseAfter, UseInterceptor, Action, Get, Post, Param, Body, OnUndefined, HttpCode, Header
} from 'routing-controllers';
import 'reflect-metadata';
import { getLogger } from '../helper/logger';
import mongoose from "mongoose";
import { authDbModel, AuthModel } from '../model/AuthModel'
import bcrypt from 'bcrypt';
import { AppError } from '../error/AppError';
import { OkError } from '../error/OkError';
import jwt from 'jsonwebtoken';

@Controller()
export class SigninController {
  /**
   * Create a new user
   */
  @Post('/signin')
  @Header("alg", "HS256")
  @Header("typ", "JWT")
  @HttpCode(200)
  async postOne(@Body() auth: AuthModel) {
    if (!(auth.username || auth.email)) {
      throw new OkError({
        name: 'signup-login-missing',
        statusCode: 400,
        message: 'Не указан Login или Email'
      })
    }
    let findResult;
    if (auth.username) findResult = await authDbModel.findOne({ username: auth.username });
    else findResult = await authDbModel.findOne({ email: auth.email });

    const authFail = new OkError({
      name: 'signup-login-fail',
      statusCode: 401,
      message: 'Попытка авторизации не удалась'
    });

    if (!findResult) throw authFail;

    const match = await bcrypt.compare(auth.password, findResult.password);
    if (!match) throw authFail;

    const JWTToken = jwt.sign(
      { _id: findResult._id },
      process.env.SECRET_KEY as string,
      { expiresIn: "2h" }
    );

    try {
      await jwt.verify(JWTToken, process.env.SECRET_KEY as string);
    } catch (error) {
      const errorName = error instanceof Error ? error.name : false;
      switch (errorName) {
        case 'TokenExpiredError':
          return new AppError({
            name: 'token-expired',
            statusCode: 401,
            errors: [error]
          })
        case 'JsonWebTokenError':
          return new AppError({
            name: 'jwt-error',
            statusCode: 500,
            errors: [error]
          })
        case 'NotBeforeError':
          return new AppError({
            name: 'jwt-error',
            statusCode: 401,
            errors: [error]
          })
        default:
          throw new AppError({
              name: 'unexpected-error',
              statusCode: 500,
              errors: [error]
            }
          )
      }
    }

    return {
      ok: true,
      token: JWTToken
    };
  }
}
