import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException
            ? (exception.getResponse() as any).message
            : 'Internal server error';

        response.status(status).json({
            error: exception instanceof HttpException ? exception.name : 'InternalServerError',
            message: Array.isArray(message) ? message.join(', ') : message,
        });
    }
}
