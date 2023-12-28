import { Injectable, OnModuleInit } from '@nestjs/common';
import { DFTable } from 'dynamoflow';

export interface IDatabaseService {
  table: DFTable;
}

@Injectable()
export class DatabaseService implements IDatabaseService, OnModuleInit {
  public table: DFTable = new DFTable({
    tableName: 'cola-counter',
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    region: 'ap-southeast-2',
  });

  public async onModuleInit() {
    // manually create our table (if we are running locally)
    if (process.env.DYNAMODB_ENDPOINT !== undefined) {
      await this.table.createTableIfNotExists();
    }
  }
}
