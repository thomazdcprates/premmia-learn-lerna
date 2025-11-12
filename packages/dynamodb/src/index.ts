import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

class Dynamodb {
  protected client: DynamoDBDocumentClient;

  constructor(region: string, endpoint: string) {
    const dynamoDBClient = new DynamoDBClient({
      endpoint,
      region,
    });

    this.client = DynamoDBDocumentClient.from(dynamoDBClient);
  }

  async get(tableName: string) {
    try {
      const command = new ScanCommand({ TableName: tableName });
      const result = await this.client.send(command);
      return result.Items ?? [];
    } catch (error) {
      throw error;
    }
  }
}

export { Dynamodb };
