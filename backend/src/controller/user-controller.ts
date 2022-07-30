import {
  Controller, UseInterceptor, Action, Get, Param, Authorized,
} from 'routing-controllers';
import 'reflect-metadata';
import { logger } from '../lib/logger';

@Authorized()
@Controller()
// @UseBefore(loggingBefore)
// @UseAfter(loggingAfter)
@UseInterceptor((action: Action, content: any) => {
  logger.silly('change response...');
  return content;
})
export class UserController {
  @Get('/users/:id')
  getOne(@Param('id') id: number) {
    logger.silly('Action...');
    return `This action returns user # ${id}`;
  }
}
