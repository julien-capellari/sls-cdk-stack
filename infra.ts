#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';

import { FrontendStack } from './stacks/frontend.stack';
import { BackendStack } from './stacks/backend.stack';

// Initiate stacks
const app = new cdk.App();

const frontendStack = new FrontendStack(app, 'FrontendStack', {
  env: {
    account: '235403126921',
    region: 'eu-west-3'
  },
  tags: {
    Project: 'cdk-stack'
  }
});

new BackendStack(app, 'BackendStack', {
  frontend: frontendStack.TodoFrontend,
  env: {
    account: '235403126921',
    region: 'eu-west-3'
  },
  tags: {
    Project: 'cdk-stack'
  }
});
