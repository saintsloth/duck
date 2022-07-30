import {
  Controller, Post, HttpCode, Req,
} from 'routing-controllers';
import { loggerMethod } from '../lib/logger';
import { getSessionId } from '../lib/getSessionId';

@Controller()
export class LoggerController {
  @Post('/logger')
  @HttpCode(201)
  async postOne(@Req() request: Request) {
    const sessionId = getSessionId(request);
    // @ts-ignore
    const { level, message } = request.body;
    loggerMethod(level, message, { sessionId }, 'frontend');
    return {
      ok: true,
    };
  }
}
