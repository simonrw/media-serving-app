import * as dynamodb from "@aws-sdk/client-dynamodb";
import * as s3 from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucket = process.env.BUCKET_NAME;

const createUrl = async (key: string): Promise<string> => {
    const client = new s3.S3Client({ region: "us-east-1", endpoint: "http://localhost.localstack.cloud:4566" });
    const command = new s3.PutObjectCommand({
        Key: key,
        Bucket: bucket,
    });
    return await getSignedUrl(client, command, { expiresIn: 3600 });
};

const saveItem = async (id: string) => {
    const client = new dynamodb.DynamoDBClient({ region: "us-east-1", endpoint: "http://localhost.localstack.cloud:4566" });

}

interface EventInfoVariables {
    id: string
}

interface EventInfo {
    variables: EventInfoVariables,
}

interface Event {
    info: EventInfo,
}

exports.handler = async function (event: Event, context: any) {
    console.log("Event", event);
    const id = event.info.variables.id;
    const url = await createUrl(id);
    // await saveItem(id);
    return url;
};