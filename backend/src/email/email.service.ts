import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

interface EmailSendRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class ExternalEmailService {
  private readonly emailServiceUrl: string;

  constructor() {
    this.emailServiceUrl =
      process.env.EMAIL_SERVICE_URL || 'http://email-service:3005';
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<{ success: boolean }> {
    const payload: EmailSendRequest = {
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    };

    try {
      await axios.post(`${this.emailServiceUrl}/mail/send`, payload, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' },
      });

      return { success: true };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          '[EmailService] error:',
          error.message,
          error.config?.url,
        );

        const status = error.response?.status
          ? error.response.status
          : HttpStatus.INTERNAL_SERVER_ERROR;

        let errorMessage = 'Failed to send email';
        const errorData: unknown = (error.response?.data as unknown) ?? null;

        if (errorData && typeof errorData === 'object') {
          if (
            'message' in errorData &&
            typeof (errorData as Record<string, unknown>).message === 'string'
          ) {
            errorMessage = (errorData as Record<string, unknown>)
              .message as string;
          } else if (
            'error' in errorData &&
            typeof (errorData as Record<string, unknown>).error === 'string'
          ) {
            errorMessage = (errorData as Record<string, unknown>)
              .error as string;
          }
        }

        throw new HttpException(errorMessage, status);
      }

      if (error instanceof Error) {
        console.error('[EmailService] Unexpected error:', error.message);
        throw new HttpException(
          'Email service unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      const unknownError = error as unknown;
      console.error('[EmailService] Unknown error type:', unknownError);
      throw new HttpException(
        'Critical email service error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
