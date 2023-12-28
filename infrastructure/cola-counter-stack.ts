import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createApiInfrastructure } from '../src/modules/api/api.infrastructure.js';
import { createDatabaseInfrastructure } from '../src/modules/database/database.infrastructure.js';

export class ColaCounterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const { dynamoDbTable } = createDatabaseInfrastructure(this);
    createApiInfrastructure(this, dynamoDbTable);
  }
}
