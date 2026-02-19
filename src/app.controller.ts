import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @Inject(AppService)
    private readonly appService: Pick<AppService, 'getHello'>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
