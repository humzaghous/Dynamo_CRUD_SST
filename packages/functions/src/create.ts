import * as uuid from "uuid";
import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2)); // Log the event for debugging

    const data = JSON.parse(event.body || "{}");

    const params = {
      TableName: Table.Notes.tableName,
      Item: {
        userId: "123",
        noteId: uuid.v4(), // Generate a version 4 UUID
        content: data.content || "",
        createdAt: Date.now(),
      },
    };

    console.log("Putting item with params:", JSON.stringify(params, null, 2)); // Log the params for debugging

    await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (error: any) {
    console.error("Error:", error); // Log any errors for debugging

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
