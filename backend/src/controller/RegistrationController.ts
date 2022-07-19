import {
  Controller, UseBefore, UseAfter, UseInterceptor, Action, Get, Post, Param, Body, OnUndefined, HttpCode
} from 'routing-controllers';
import 'reflect-metadata';
import { getLogger } from '../helper/logger';
import mongoose from "mongoose";
import { authDbModel, AuthModel, RegisterModel } from '../model/AuthModel'
import bcrypt from 'bcrypt';
import { AppError } from '../error/AppError';
import { OkError } from '../error/OkError';

@Controller()
export class RegistrationController {
  /**
   * Create a new user
  */
  @Post('/register')
  @HttpCode(201)
  async postOne(@Body() auth: RegisterModel) {
    getLogger().silly(`post request received: ${JSON.stringify(auth)}`);

    const loginIsExist = await authDbModel.findOne({ username: auth.username });
    if (loginIsExist) {
      throw new OkError({
          name: 'signup-username-is-exist',
          statusCode: 409,
          message: 'Пользователь с указанным Login уже существует'
        });
    }
    const emailIsExist = await authDbModel.findOne({ email: auth.email });
    if (emailIsExist) {
      throw new OkError({
        name: 'signup-email-is-exist',
        statusCode: 409,
        message: 'Пользователь с указанным Email уже существует'
      });
    }

    const salt = bcrypt.genSaltSync(10);
    getLogger().silly(`salt is: ${salt}`);
    const hash = await bcrypt.hash(auth.password, salt);
    getLogger().silly(`hash is: ${hash}`);

    const authDb = new authDbModel({
      _id: new mongoose.Types.ObjectId(),
      username: auth.username,
      email: auth.email,
      password: hash
    });

    try {
      await authDb.save();
    } catch (error) {
      throw new AppError({
        name: 'database-save-error',
        statusCode: 500,
        errors: [error]
      });
    }

    return {
      ok: true,
      message: 'New user has been created successfully'
    };
  }
}
