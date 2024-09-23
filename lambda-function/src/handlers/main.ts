import { APIGatewayProxyHandler } from 'aws-lambda';
import { DatabaseService } from '../services/database.service';
import { SNSService } from '../services/sns.service';
import { logger } from '../utils/logger';
import { handleError } from '../utils/error-handler';
import { Message } from '../models/message.model';
import { ErrorWithCode } from '../models/error-with-code';

const dbService = new DatabaseService();
const snsService = new SNSService();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    logger.info('Received event', { event });

    const message: Message = JSON.parse(event.body || '{}');

    // Validar el mensaje
    if (!isValidMessage(message)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Formato de mensaje inválido' }),
      };
    }

    // Registrar el mensaje en DynamoDB
    // await dbService.saveMessage(message);

    // Publicar el evento en SNS para notificar a otros usuarios
    await snsService.publishEvent(message);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Mensaje procesado y guardado con éxito' }),
    };
  } catch (error) {
    console.log('CONSOLE LOGGER', error);
    return handleError(error as ErrorWithCode);
  }
};

function isValidMessage(message: any): message is Message {
  return (
    typeof message.message === 'string' &&
    typeof message.user === 'string' &&
    typeof message.date === 'string'
  );
}