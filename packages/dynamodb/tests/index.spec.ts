import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { Dynamodb } from "../src/index";
import { InternalError } from "../src/errors";

const mockSend = jest.fn();
const mockDestroy = jest.fn();

jest.mock("@aws-sdk/lib-dynamodb", () => {
  const original = jest.requireActual("@aws-sdk/lib-dynamodb");

  return {
    ...original,
    DynamoDBDocumentClient: {
      from: jest.fn().mockImplementation(() => ({
        send: mockSend,
        destroy: mockDestroy,
      })),
    },
    ScanCommand: jest.fn(),
    GetCommand: jest.fn(),
    PutCommand: jest.fn(),
    DeleteCommand: jest.fn(),
  };
});

jest.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: jest.fn(),
}));

describe("Dynamodb", () => {
  const config = { region: "us-east-1", endpoint: "http://localhost:8000/" };
  let dynamodb: Dynamodb;
  let mockDynamoDBDocumentClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    dynamodb = new Dynamodb(config);
    mockDynamoDBDocumentClient = DynamoDBDocumentClient.from({} as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize client correctly", () => {
      expect(DynamoDBClient).toHaveBeenCalledWith(config);
      expect(DynamoDBDocumentClient.from).toHaveBeenCalled();
    });
  });

  describe("get", () => {
    it("should return items when successful", async () => {
      const mockItems = [{ id: 1, name: "test" }];
      mockSend.mockResolvedValueOnce({ Items: mockItems });

      const result = await dynamodb.get("Users");
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(ScanCommand).toHaveBeenCalledWith({ TableName: "Users" });
      expect(result).toEqual(mockItems);
    });

    it("should return empty array when no items", async () => {
      mockSend.mockResolvedValueOnce({});
      const result = await dynamodb.get("Users");
      expect(result).toEqual([]);
    });

    it("should throw InternalError when fails", async () => {
      const error = new Error("DynamoDB get error");

      mockDynamoDBDocumentClient.send.mockRejectedValueOnce(error);

      await expect(dynamodb.get("Users")).rejects.toThrow("DynamoDB get error");
    });
  });

  describe("getByKey", () => {
    it("should return item when successful", async () => {
      const mockItem = { id: 1, name: "test" };
      mockSend.mockResolvedValueOnce({ Item: mockItem });

      const result = await dynamodb.getByKey("Users", { id: 1 });
      expect(GetCommand).toHaveBeenCalledWith({
        TableName: "Users",
        Key: { id: 1 },
      });
      expect(result).toEqual(mockItem);
    });

    it("should throw InternalError when fails", async () => {
      mockSend.mockRejectedValueOnce(new Error("Get failed"));
      await expect(
        dynamodb.getByKey("Users", { id: 1 })
      ).rejects.toBeInstanceOf(InternalError);
    });
  });

  describe("save", () => {
    it("should save item successfully", async () => {
      const item = { id: 1, name: "test" };
      mockSend.mockResolvedValueOnce({});

      const result = await dynamodb.save("Users", item);
      expect(PutCommand).toHaveBeenCalledWith({
        TableName: "Users",
        Item: item,
      });
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(result).toEqual(item);
    });

    it("should throw InternalError when fails", async () => {
      mockSend.mockRejectedValueOnce(new Error("Put failed"));
      await expect(dynamodb.save("Users", { id: 1 })).rejects.toBeInstanceOf(
        InternalError
      );
    });
  });

  describe("delete", () => {
    it("should delete item successfully", async () => {
      mockSend.mockResolvedValueOnce({});
      await dynamodb.delete("Users", { id: 1 });
      expect(DeleteCommand).toHaveBeenCalledWith({
        TableName: "Users",
        Key: { id: 1 },
      });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it("should throw InternalError when fails", async () => {
      mockSend.mockRejectedValueOnce(new Error("Delete failed"));
      await expect(dynamodb.delete("Users", { id: 1 })).rejects.toBeInstanceOf(
        InternalError
      );
    });
  });
});
