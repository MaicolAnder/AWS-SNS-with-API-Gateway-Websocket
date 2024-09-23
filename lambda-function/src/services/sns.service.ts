import { SNS } from 'aws-sdk';
import { logger } from '../utils/logger';
import { Message } from '../models/message.model';

export class SNSService {
  private sns: SNS;
  private readonly topicArn: string;

  constructor() {
    this.sns = new SNS();
    this.topicArn = process.env.SNS_TOPIC_ARN || '';
  }

  async publishEvent(message: Message): Promise<void> {
    try {
      const params: SNS.PublishInput = {
        Message: JSON.stringify(message),
        TopicArn: this.topicArn,
      };

      await this.sns.publish(params).promise();
      logger.info('Message published to SNS', { message });
    } catch (error) {
      logger.error('Error publishing message to SNS', { error, message });
      throw error;
    }
  }
}