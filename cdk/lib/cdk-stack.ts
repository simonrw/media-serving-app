import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import Database from './db';
import Api from "./api";
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CfnOutput } from 'aws-cdk-lib';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const testBucket = new Bucket(this, "TestBucket", {});
    const db = new Database(this, "Database");
    const api = new Api(this, "Api", {
      table: db.db,
      bucketName: testBucket.bucketName,
    });
    new CfnOutput(this, "bucketName", {
      value: testBucket.bucketName,
    });
  }
}
