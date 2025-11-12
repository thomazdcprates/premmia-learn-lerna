import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamodbConfig } from "./interfaces";
declare class Dynamodb {
    protected client: DynamoDBDocumentClient;
    constructor(config: DynamodbConfig);
    get(tableName: string): Promise<Record<string, any>[]>;
    getByKey(tableName: string, key: any): Promise<Record<string, any> | undefined>;
    save(tableName: string, item: any): Promise<any>;
    delete(tableName: string, key: any): Promise<void>;
}
export { Dynamodb };
