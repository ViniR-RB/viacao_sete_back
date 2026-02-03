import IMonitoryService from '@/core/adapters/i_monitory.service';
import AppException from '@/core/exceptions/app_exception';
import ConfigurationService from '@/core/services/configuration.service';
import UserDto from '@/modules/users/dtos/user.dto';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly monitoryService: IMonitoryService,
    private readonly configurationService: ConfigurationService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const nodeEnv = this.configurationService.get('NODE_ENV');

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any)?.message || exception.message;
    } else if (exception instanceof AppException) {
      status = exception.statusCode;
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.captureErrorInSentry(exception, request, status, nodeEnv);

    this.logError(exception, request, status, nodeEnv);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private captureErrorInSentry(
    exception: unknown,
    request: Request,
    status: number,
    nodeEnv: string,
  ): void {
    try {
      const shouldCapture = ['prd', 'dev'].includes(nodeEnv);

      if (!shouldCapture) {
        return;
      }

      const error =
        exception instanceof Error ? exception : new Error(String(exception));

      this.monitoryService.setContext({
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
        query: request.query,
        params: request.params,
        user: (request as any).user,
        ip: request.ip,
        userAgent: request.get('User-Agent'),
      });

      this.monitoryService.setTag('http_method', request.method);
      this.monitoryService.setTag('http_status', status.toString());
      this.monitoryService.setTag('http_url', request.url);
      this.monitoryService.setTag('error_type', 'http_exception');

      if ((request as any).user as UserDto) {
        this.monitoryService.setUser({
          id: (request as any).user.id?.toString(),
          email: (request as any).user.email,
        });
      }
      this.monitoryService.captureException(error, {
        request_id: request.headers['x-request-id'] || 'unknown',
        status_code: status,
        error_category: status >= 500 ? 'server_error' : 'client_error',
      });
    } catch (sentryError) {
      console.error('Failed to capture error in Sentry:', sentryError);
    }
  }

  private logError(
    exception: unknown,
    request: Request,
    status: number,
    nodeEnv: string,
  ): void {
    if (nodeEnv !== 'dev') {
      return;
    }

    const errorMessage =
      exception instanceof Error ? exception.message : String(exception);
    const stack = exception instanceof Error ? exception.stack : undefined;

    console.error(
      `[${new Date().toISOString()}] ${request.method} ${request.url} - ${status}`,
    );
    console.error(`Error: ${errorMessage}`);

    if (stack) {
      console.error('Stack trace:', stack);
    }
  }
}
