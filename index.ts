import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { InfobipConfig, BaseMessage } from "./types/message-types";
import { InfobipProvider } from './providers/InfobipProvider';
import dotenv from "dotenv";

dotenv.config();

interface MessageEvent {
  channel: string;
  message: BaseMessage;
  to: string;
  from?: string;
}

const apiResponse = (statusCode: number, body: Record<string, any>) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify(body),
  }
}

export const handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const { channel, message, to } = JSON.parse(event.body || '') as MessageEvent;

    if (!channel) {
      return apiResponse(400, { message: 'Channel is required' });
    }

    if (!message) {
      return apiResponse(400, { message: 'Message are required' });
    }

    if (!to) {
      return apiResponse(400, { message: 'Recipient is required' });
    }

    const infobipConfig: InfobipConfig = {
      baseUrl: process.env['INFOBIP_BASE_URL'] || '',
      apiKey: process.env['INFOBIP_API_KEY'] || ''
    };
    
    const infobipProvider = new InfobipProvider(infobipConfig);
    infobipProvider.send(channel, message, to);

    return apiResponse(200, { message: 'Message sent successfully' });
  } catch (error) {
    return apiResponse(500, { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
