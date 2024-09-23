import { DynamoDB } from 'aws-sdk';
import { logger } from '../utils/logger';
import { Message } from '../models/message.model';

export class DatabaseService {
  private dynamodb: DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor() {
    this.dynamodb = new DynamoDB.DocumentClient();
    this.tableName = process.env.DYNAMODB_TABLE_NAME || 'Messages';
  }

  async saveMessage(message: Message): Promise<void> {
    try {
      const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: this.tableName,
        Item: {
          ...message,
          id: `${message.user}_${message.date}`, // Usando una combinación de user y date como id único
        },
      };

      await this.dynamodb.put(params).promise();
      logger.info('Message saved to DynamoDB', { message });
    } catch (error) {
      logger.error('Error saving message to DynamoDB', { error, message });
      throw error;
    }
  }
}