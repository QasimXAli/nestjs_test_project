import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as any;

        // Extract the first error message
        const errorMessage = Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message[0]
            : exceptionResponse.message;

        const errorResponse = {
            statusCode: status,
            message: errorMessage,
        };

        response.status(status).json(errorResponse);
    }
}
