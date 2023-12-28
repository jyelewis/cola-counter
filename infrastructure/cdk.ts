#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ColaCounterStack } from './cola-counter-stack.js';

function main() {
  const app = new cdk.App();

  new ColaCounterStack(app, 'cola-counter-stack', {});
}
main();
