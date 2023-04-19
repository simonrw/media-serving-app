import { Construct } from "constructs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { CfnOutput } from "aws-cdk-lib";

export default class Database extends Construct {
  public readonly db: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.db = new dynamodb.Table(this, id, {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk", type: dynamodb.AttributeType.STRING,
      },
    });

    new CfnOutput(this, "tableName", {
      value: this.db.tableName,
    });
  }
}
