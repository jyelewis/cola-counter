import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiController {
  @Get('/healthcheck')
  getHello(): string {
    return 'OK';
  }
}
