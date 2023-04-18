import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import Database from './db';
import Api from "./api";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const api = new Api(this, "Api");
    const db = new Database(this, "Database");
  }
}
