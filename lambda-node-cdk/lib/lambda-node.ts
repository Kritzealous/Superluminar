import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const dynamoDbClient = new DynamoDB({ region: "eu-central-1" });

type DBItem = {
    item_id: string;
    action: 'fetch' | 'insert';
    data?: any;  // Additional data needed for insert
};

export const handler = async (
  event: DBItem
): Promise<APIGatewayProxyResult> => {
  if (event.action === 'fetch') {
    const command = new GetItemCommand({
      TableName: tableName,
      Key: {
        id: { S: event.item_id },
      },
    });
    const response = await dynamoDbClient.send(command);

    if (!response.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Error: Item not found",
          itemId: event.item_id,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "ok - item found",
        data: response.Item,
      }),
    };
  } else if (event.action === 'insert') {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: {
        id: { S: event.item_id },
        ...event.data
      }
    });
    await dynamoDbClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "ok - item inserted",
        itemId: event.item_id,
        data: event.data,
      }),
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Error: Action not supported",
      }),
    };
  }
};
