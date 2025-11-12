import {
  ScanCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamodbConfig } from "./interfaces";
import { InternalError } from "./errors";

class Dynamodb {
  protected client: DynamoDBDocumentClient;

  constructor(config: DynamodbConfig) {
    const dynamoDBClient = new DynamoDBClient(config);

    this.client = DynamoDBDocumentClient.from(dynamoDBClient);
  }

  async get(tableName: string) {
    try {
      const command = new ScanCommand({ TableName: tableName });
      const result = await this.client.send(command);
      
      return result.Items ?? [];
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalError(error.message);
      }

      throw error;
    }
  }

  async getByKey(tableName: string, key: any) {
    try {
      const command = new GetCommand({ TableName: tableName, Key: key });
      const result = await this.client.send(command);

      return result.Item;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalError(error.message);
      }

      throw error;
    }
  }

  async save(tableName: string, item: any) {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: item,
      });

      await this.client.send(command);

      return item;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalError(error.message);
      }

      throw error;
    }
  }

  async delete(tableName: string, key: any) {
    try {
      const command = new DeleteCommand({ TableName: tableName, Key: key });
      await this.client.send(command);
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalError(error.message);
      }

      throw error;
    }
  }
}

export { Dynamodb };
