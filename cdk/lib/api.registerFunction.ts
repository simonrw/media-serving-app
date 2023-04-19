import * as dynamodb from "@aws-sdk/client-dynamodb";


exports.handler = async function (event, context) {
    const client = new dynamodb.DynamoDBClient({ region: "us-east-1" });

    return "foobar";
};