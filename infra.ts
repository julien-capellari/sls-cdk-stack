#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';

import { BackendStack } from './stacks/backend.stack';

// Initiate stacks
const app = new cdk.App();

new BackendStack(app, 'api-stack', {
  env: {
    account: '235403126921',
    region: 'eu-west-3'
  },
  tags: {
    Project: 'cdk-stack'
  }
});
