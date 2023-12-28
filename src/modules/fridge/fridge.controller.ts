import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { FridgeService } from './fridge.service.js';
import { Fridge } from './types/Fridge.js';
import { StockEvent } from './types/StockEvent.js';

// REST endpoints for /fridge/

@Controller('fridge')
export class FridgeController {
  constructor(
    @Inject(FridgeService) private readonly fridgeService: FridgeService,
  ) {}

  @Get('/:fridgeName')
  public async getFridge(
    @Param('fridgeName') fridgeName: string,
  ): Promise<Fridge> {
    return await this.fridgeService.retrieveFridge(fridgeName);
  }

  @Post('/:fridgeName/stock-events')
  @HttpCode(201)
  public async createStockEvent(
    @Param('fridgeName') fridgeName: string,
    @Body() { numCansAdded }: { numCansAdded?: number },
  ) {
    if (typeof numCansAdded !== 'number') {
      throw new BadRequestException('numCansAdded must be a number');
    }

    await this.fridgeService.recordStockEvent(fridgeName, numCansAdded);
  }

  @Get('/:fridgeName/stock-events')
  public async getStockEvents(
    @Param('fridgeName') fridgeName: string,
  ): Promise<StockEvent[]> {
    return await this.fridgeService.retrieveStockHistory(fridgeName);
  }
}
