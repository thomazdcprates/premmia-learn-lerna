"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dynamodb = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const errors_1 = require("./errors");
class Dynamodb {
    constructor(config) {
        const dynamoDBClient = new client_dynamodb_1.DynamoDBClient(config);
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoDBClient);
    }
    async get(tableName) {
        try {
            const command = new lib_dynamodb_1.ScanCommand({ TableName: tableName });
            const result = await this.client.send(command);
            return result.Items ?? [];
        }
        catch (error) {
            if (error instanceof Error) {
                throw new errors_1.InternalError(error.message);
            }
            throw error;
        }
    }
    async getByKey(tableName, key) {
        try {
            const command = new lib_dynamodb_1.GetCommand({ TableName: tableName, Key: key });
            const result = await this.client.send(command);
            return result.Item;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new errors_1.InternalError(error.message);
            }
            throw error;
        }
    }
    async save(tableName, item) {
        try {
            const command = new lib_dynamodb_1.PutCommand({
                TableName: tableName,
                Item: item,
            });
            await this.client.send(command);
            return item;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new errors_1.InternalError(error.message);
            }
            throw error;
        }
    }
    async delete(tableName, key) {
        try {
            const command = new lib_dynamodb_1.DeleteCommand({ TableName: tableName, Key: key });
            await this.client.send(command);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new errors_1.InternalError(error.message);
            }
            throw error;
        }
    }
}
exports.Dynamodb = Dynamodb;
