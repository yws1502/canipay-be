import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpApiExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpApiExceptionsFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string[] };

    this.logger.error(error);

    if (typeof error === 'string') {
      response.status(status).json({ success: true, statusCode: status, message: error });
    } else {
      response.status(status).json({ success: false, ...error });
    }
  }
}
