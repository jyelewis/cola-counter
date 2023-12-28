import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Duration, Stack } from 'aws-cdk-lib';
import {
  Architecture,
  FunctionUrlAuthType,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

export function createApiInfrastructure(stack: Stack, dynamoDbTable: Table) {
  const apiLambda = new NodejsFunction(stack, 'api', {
    entry: `./src/entrypoints/api-lambda.ts`,
    memorySize: 128,
    timeout: Duration.seconds(10),
    architecture: Architecture.ARM_64,
    runtime: Runtime.NODEJS_18_X,
    bundling: {
      // exclude required nest packages that break esbuild
      externalModules: [
        '@nestjs/websockets/socket-module',
        '@nestjs/microservices',
        'cache-manager',
        'class-transformer',
        'class-validator',
        'class-transformer/storage',
      ],
    },
  });

  apiLambda.addFunctionUrl({
    authType: FunctionUrlAuthType.NONE,
  });

  // allow our lambda to read/write from our table
  dynamoDbTable.grantFullAccess(apiLambda);

  return { apiLambda };
}
