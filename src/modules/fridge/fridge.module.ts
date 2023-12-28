import { Module } from '@nestjs/common';
import { FridgeService } from './fridge.service.js';
import { FridgeController } from './fridge.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  providers: [FridgeService],
  controllers: [FridgeController],
  exports: [FridgeService],
})
export class FridgeModule {}
