import serverlessExpress from '@vendia/serverless-express';
import type { Callback, Context, Handler } from 'aws-lambda';
import { ApiModule } from '../modules/api/api.module.js';
import { NestFactory } from '@nestjs/core';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const apiServer = await NestFactory.create(ApiModule);
  await apiServer.init();

  const expressApp = apiServer.getHttpAdapter().getInstance();

  // @ts-ignore
  return serverlessExpress({ app: expressApp });
}

export const handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
