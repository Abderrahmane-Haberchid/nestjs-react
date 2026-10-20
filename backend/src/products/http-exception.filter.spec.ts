import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { HttpExceptionFilter } from './http-exception.filter.js';

function createHost() {
  const request = { url: '/api/v1/products?page=0' } as Request;
  const status = vi.fn().mockReturnThis();
  const json = vi.fn();
  const response = {
    status,
    json,
  } as unknown as Response;

  const host = {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
    switchToRpc: vi.fn(),
    switchToWs: vi.fn(),
    getType: () => 'http' as const,
    getArgs: () => [],
    getArgByIndex: () => undefined,
  } as ArgumentsHost;

  return { host, request, status, json };
}

describe('HttpExceptionFilter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('preserves HTTP status and validation messages in the error response', () => {
    const filter = new HttpExceptionFilter();
    const { host, request, status, json } = createHost();

    filter.catch(new BadRequestException(['page must not be less than 1']), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        path: request.url,
        message: ['page must not be less than 1'],
        timestamp: expect.any(String),
      }),
    );
  });

  it('converts unexpected failures to a generic internal server error', () => {
    const filter = new HttpExceptionFilter();
    const { host, status, json } = createHost();
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    filter.catch(new Error('private internal detail'), host);

    expect(status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }),
    );
  });
});
