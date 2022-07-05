import {
  Controller, UseBefore, UseAfter, UseInterceptor, Action, Get, Post, Param, Body, OnUndefined,
} from 'routing-controllers';
import 'reflect-metadata';
import { loggingAfter, loggingBefore } from '../middleware/userMiddlewares';
import { getLogger } from '../helper/logger';
import { UserModel } from '../model/UserModel';

@Controller()
@UseBefore(loggingBefore)
@UseAfter(loggingAfter)
@UseInterceptor((action: Action, content: any) => {
  getLogger().silly('change response...');
  return content;
})
export class UserController {
  @Get('/users/:id')
  getOne(@Param('id') id: number) {
    getLogger().silly('Action...');
    return `This action returns user # ${id}`;
  }

  @Post('/users/:id')
  @OnUndefined(204) // возврат code 204 No Content если void/undefined/Promise<void>
  postOne(@Param('id') id: number, @Body() user: UserModel) {
    getLogger().silly(`post request received: ${JSON.stringify(user)}`);
    return user;
  }
}
