import { Inject, Injectable } from '@nestjs/common';
import { Fridge } from './types/Fridge.js';
import { StockEvent } from './types/StockEvent.js';
import {
  DatabaseService,
  IDatabaseService,
} from '../database/database.service.js';
import {
  DFCollection,
  DFZodValidationExt,
  RETRY_TRANSACTION,
} from 'dynamoflow';

export interface IFridgeService {
  retrieveFridge(fridgeName: string): Promise<Fridge>;

  recordStockEvent(fridgeName: string, numCansAdded: number): Promise<void>;
  retrieveStockHistory(fridgeName: string): Promise<StockEvent[]>;
}

@Injectable()
export class FridgeService implements IFridgeService {
  private fridgesCollection: DFCollection<Fridge>;
  private stockEventCollection: DFCollection<StockEvent>;

  constructor(@Inject(DatabaseService) databaseService: IDatabaseService) {
    // create our collections
    this.fridgesCollection = databaseService.table.createCollection({
      name: 'fridges',
      partitionKey: 'name',
      extensions: [
        new DFZodValidationExt({
          schema: Fridge,
        }),
      ],
    });

    this.stockEventCollection = databaseService.table.createCollection({
      name: 'stockEvents',
      partitionKey: 'fridgeName',
      sortKey: 'date',
      extensions: [
        new DFZodValidationExt({
          schema: StockEvent,
        }),
      ],
    });
  }

  private createFridge(fridgeName: string): Promise<Fridge> {
    return this.fridgesCollection.insert({
      name: fridgeName,
      numStockedCans: 0,
    });
  }

  public async retrieveFridge(fridgeName: string): Promise<Fridge> {
    const existingFridge = await this.fridgesCollection.retrieveOne({
      where: {
        name: fridgeName,
      },
    });

    if (existingFridge === null) {
      // create & return new fridge, it doesn't exist yet
      return this.createFridge(fridgeName);
    }

    return existingFridge;
  }

  public async recordStockEvent(
    fridgeName: string,
    numCansAdded: number,
  ): Promise<void> {
    const stockEvent: StockEvent = {
      fridgeName,
      date: new Date().toISOString(),
      numCansAdded,
    };

    // perform multiple steps in one transaction
    // 1. Update the number of cans in our fridge
    // 2. Insert our stock event
    const transaction = this.fridgesCollection.updateTransaction(
      {
        name: fridgeName,
      },
      {
        numStockedCans: { $inc: numCansAdded },
      },
    );

    transaction.addSecondaryTransaction(
      this.stockEventCollection.insertTransaction(stockEvent),
    );

    // if we don't have a fridge, create one
    transaction.primaryOperation.errorHandler = async () => {
      await this.createFridge(fridgeName);

      // try again now that we have a fridge
      return RETRY_TRANSACTION;
    };

    // save our changes
    await transaction.commit();
  }

  public retrieveStockHistory(fridgeName: string): Promise<StockEvent[]> {
    return this.stockEventCollection.retrieveMany({
      where: {
        fridgeName: fridgeName,
      },
      sort: 'DESC',
      limit: 500,
    });
  }
}
