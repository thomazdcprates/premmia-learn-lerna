import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
declare class Dynamodb {
    protected client: DynamoDBDocumentClient;
    constructor(region: string, endpoint: string);
    get(tableName: string): Promise<Record<string, any>[]>;
}
export { Dynamodb };
