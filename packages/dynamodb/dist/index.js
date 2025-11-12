"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dynamodb = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class Dynamodb {
    constructor(region, endpoint) {
        const dynamoDBClient = new client_dynamodb_1.DynamoDBClient({
            endpoint,
            region,
        });
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoDBClient);
    }
    async get(tableName) {
        try {
            const command = new lib_dynamodb_1.ScanCommand({ TableName: tableName });
            const result = await this.client.send(command);
            return result.Items ?? [];
        }
        catch (error) {
            throw error;
        }
    }
}
exports.Dynamodb = Dynamodb;
