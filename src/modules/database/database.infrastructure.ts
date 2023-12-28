import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Stack } from 'aws-cdk-lib';

export function createDatabaseInfrastructure(stack: Stack) {
  const dynamoDbTable = new Table(stack, 'cola-counter', {
    tableName: 'cola-counter',
    partitionKey: { name: '_PK', type: AttributeType.STRING },
    sortKey: { name: '_SK', type: AttributeType.STRING },
    billingMode: BillingMode.PAY_PER_REQUEST,
  });

  return { dynamoDbTable };
}
