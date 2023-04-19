import { Construct } from "constructs";
import * as appsync from 'aws-cdk-lib/aws-appsync';
import { CfnOutput } from "aws-cdk-lib";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from 'aws-cdk-lib/aws-lambda';

export interface ApiProps {
  table: ITable,
}

export default class Api extends Construct {
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);

    const api = new appsync.GraphqlApi(this, 'api', {
      name: 'api',
      schema: appsync.SchemaFile.fromAsset('./schema.graphql'),
    });

    const registerFunction = new NodejsFunction(this, "registerFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        BUCKET_NAME: "videoondemand-destination920a3c57-c09363a3",
        TABLE_NAME: props.table.tableName,
      },
    });

    const lambdaDS = api.addLambdaDataSource("registerds", registerFunction);
    const registerResolver = lambdaDS.createResolver("registerresolver", {
      typeName: "Mutation",
      fieldName: "register",
    });


    new CfnOutput(this, 'api-id', {
      value: api.apiId,
    });
    new CfnOutput(this, 'api-key', {
      value: api.apiKey || "",
    });

  }
}
