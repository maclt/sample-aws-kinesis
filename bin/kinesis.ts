#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { KinesisStack } from '../lib/kinesis-stack';

const app = new cdk.App();
new KinesisStack(app, `${KinesisStack.name}`, {});
