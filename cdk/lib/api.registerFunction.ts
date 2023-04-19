import * as dynamodb from "@aws-sdk/client-dynamodb";
import * as s3 from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucket = process.env.BUCKET_NAME!;
const tableName = process.env.TABLE_NAME!;
const endpointUrl = "http://172.17.0.2:4566";

const createUrl = async (key: string, fileType: string): Promise<string> => {
  console.log("Creating presigned url");
  const client = new s3.S3Client({ region: "us-east-1", endpoint: endpointUrl });
  const command = new s3.PutObjectCommand({
    Key: key,
    Bucket: bucket,
    ACL: "public-read",
    ContentType: fileType,
  });
  const rawUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  return rawUrl.replace("172.17.0.2", "localhost.localstack.cloud").replace(bucket, "s3").replace(":4566/", `:4566/${bucket}/`);
};

const saveItem = async (id: string, name: string) => {
  console.log("Saving item");
  const client = new dynamodb.DynamoDBClient({ region: "us-east-1", endpoint: endpointUrl });
  const command = new dynamodb.PutItemCommand({
    TableName: tableName!,
    Item: {
      pk: {
        S: id,
      },
      name: {
        S: name,
      },
      "bucket": {
        S: bucket!,
      },
    },
  });
  await client.send(command);
}

interface EventInfoVariables {
  id: string,
  name: string,
  type: string
}

interface EventInfo {
  parentTypeName: string,
  fieldName: string,
  variables: EventInfoVariables,
}

interface Event {
  info: EventInfo,
}

exports.handler = async function(event: Event, context: any) {
  console.log("Event", event);
  console.log("Table name", tableName);
  console.log("Bucket", bucket);

  const { fieldName, variables } = event.info;
  if (fieldName === "register") {
    const { id, name, type: fileType } = variables;
    console.log("id", id);
    const url = await createUrl(`${id}/${name}`, fileType);
    await saveItem(id, name);
    console.log("Finished", url);
    return url;
  } else {
    // query
    const client = new dynamodb.DynamoDBClient({ region: "us-east-1", endpoint: endpointUrl });
    const command = new dynamodb.ScanCommand({
      TableName: tableName,
    });
    const res = await client.send(command);
    return res.Items!.map(i => {
      const id = i.pk.S!;
      return {
        id,
        name: id,
        url: s3Url(i.bucket.S!, id),
      }
    });
  }
};

const s3Url = (bucket: string, key: string): string => {
  return `http://s3.localhost.localstack.cloud:4566/${bucket}/${key}/master.m3u8`;
}
