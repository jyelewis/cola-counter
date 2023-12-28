import { Module } from '@nestjs/common';
import { ApiController } from './api.controller.js';
import { FridgeModule } from '../fridge/fridge.module.js';

@Module({
  imports: [FridgeModule],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule {}
