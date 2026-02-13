import { Test, TestingModule } from '@nestjs/testing';
import axios, { AxiosError } from 'axios';
import { ExternalEmailService } from './email.service';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('axios');

describe('ExternalEmailService', () => {
  let service: ExternalEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalEmailService],
    }).compile();

    service = module.get<ExternalEmailService>(ExternalEmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    const mockPayload = {
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Hello</p>',
      text: 'Hello',
    };

    it('should return success when email is sent successfully', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

      const result = await service.sendEmail(
        mockPayload.to,
        mockPayload.subject,
        mockPayload.html,
        mockPayload.text,
      );

      expect(result).toEqual({ success: true });
      expect(axios.post).toHaveBeenCalledWith(
        `${service['emailServiceUrl']}/mail/send`,
        expect.objectContaining(mockPayload),
        expect.objectContaining({
          timeout: 5000,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });

    it('should extract error message from "message" field in response', async () => {
      const errorMessage = 'Invalid recipient';
      (axios.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: HttpStatus.BAD_REQUEST,
          data: { message: errorMessage },
        },
        config: { url: 'http://email-service:3005/mail/send' },
      });

      await expect(
        service.sendEmail(
          mockPayload.to,
          mockPayload.subject,
          mockPayload.html,
        ),
      ).rejects.toThrow(HttpException);

      try {
        await service.sendEmail(
          mockPayload.to,
          mockPayload.subject,
          mockPayload.html,
        );
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(HttpException);
        expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(exception.message).toBe(errorMessage);
      }
    });

    it('should extract error message from "error" field in response', async () => {
      const errorMessage = 'SMTP connection failed';

      const mockError = {
        isAxiosError: true,
        response: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: { error: errorMessage },
        },
        config: { url: 'http://email-service:3005/mail/send' },
        request: {},
        toJSON: () => ({}),
      };

      Object.setPrototypeOf(mockError, AxiosError.prototype);

      (axios.post as jest.Mock).mockRejectedValueOnce(mockError);

      try {
        await service.sendEmail(
          mockPayload.to,
          mockPayload.subject,
          mockPayload.html,
        );
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(HttpException);
        expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(exception.message).toBe(errorMessage);
      }
    });

    it('should throw SERVICE_UNAVAILABLE for non-AxiosError with message', async () => {
      const mockError = new Error('Network error');
      (axios.post as jest.Mock).mockRejectedValueOnce(mockError);

      try {
        await service.sendEmail(
          mockPayload.to,
          mockPayload.subject,
          mockPayload.html,
        );
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(HttpException);
        expect(exception.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
        expect(exception.message).toBe('Email service unavailable');
      }
    });

    it('should throw INTERNAL_SERVER_ERROR for unknown error type', async () => {
      (axios.post as jest.Mock).mockRejectedValueOnce('some string error');

      try {
        await service.sendEmail(
          mockPayload.to,
          mockPayload.subject,
          mockPayload.html,
        );
      } catch (e) {
        const exception = e as HttpException;
        expect(exception).toBeInstanceOf(HttpException);
        expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(exception.message).toBe('Critical email service error');
      }
    });

    it('should generate text from html if text is not provided', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

      await service.sendEmail(
        mockPayload.to,
        mockPayload.subject,
        '<p>Hello World</p>',
      );

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          text: 'Hello World',
        }),
        expect.any(Object),
      );
    });
  });
});
