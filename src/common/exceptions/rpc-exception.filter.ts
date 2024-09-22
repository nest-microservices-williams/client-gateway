import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { FastifyReply } from 'fastify';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private logger = new Logger('ExceptionFilter');

  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const rpcError = exception.getError();
    const rpcErrorString = rpcError.toString();

    if (this.isEmptyResponseError(rpcErrorString)) {
      return this.handleEmptyResponseError(response, rpcErrorString);
    }

    if (this.isRpcError(rpcError)) {
      return this.handleRpcError(response, rpcError);
    }

    if (this.isExceptionError(rpcError)) {
      return this.handleExceptionError(response, rpcError);
    }

    if (this.isValidationError(rpcError)) {
      return this.handleValidationError(response, rpcError);
    }

    return this.handleGenericError(response, rpcError);
  }

  private isEmptyResponseError(errorString: string): boolean {
    return errorString.includes('Empty response');
  }

  private handleEmptyResponseError(
    response: FastifyReply,
    errorString: string,
  ) {
    this.logger.error(errorString);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: errorString.substring(0, errorString.indexOf('(') - 1),
    });
  }

  private isRpcError(
    error: any,
  ): error is { statusCode: number | string; message: string; error: string } {
    return (
      typeof error === 'object' &&
      'statusCode' in error &&
      'message' in error &&
      'error' in error
    );
  }

  private handleRpcError(
    response: FastifyReply,
    error: { statusCode: number | string; message: string; error: string },
  ) {
    const status = isNaN(+error.statusCode)
      ? HttpStatus.BAD_REQUEST
      : +error.statusCode;
    return response.status(status).send(error);
  }

  private isValidationError(
    error: any,
  ): error is { response: { message: string | string[] } } {
    return (
      typeof error === 'object' &&
      'response' in error &&
      typeof error.response === 'object' &&
      'message' in error.response
    );
  }

  private handleValidationError(
    response: FastifyReply,
    error: { response: { message: string | string[] } },
  ) {
    const message: string = Array.isArray(error.response.message)
      ? error.response.message.join(', ')
      : error.response.message;

    return response.status(HttpStatus.BAD_REQUEST).send({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message,
    });
  }

  private isExceptionError(error: any): error is {
    response: { message: string | string[]; statusCode: number; error: string };
  } {
    return (
      typeof error === 'object' &&
      'response' in error &&
      typeof error.response === 'object' &&
      'message' in error.response &&
      'statusCode' in error.response &&
      'error' in error.response
    );
  }

  private handleExceptionError(
    response: FastifyReply,
    error: {
      response: {
        message: string | string[];
        statusCode: number;
        error: string;
      };
    },
  ) {
    const message: string = Array.isArray(error.response.message)
      ? error.response.message.join(', ')
      : error.response.message;

    return response.status(error.response.statusCode).send({
      statusCode: error.response.statusCode,
      error: error.response.error,
      message,
    });
  }

  private handleGenericError(response: FastifyReply, error: any) {
    return response.status(HttpStatus.BAD_REQUEST).send({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: error,
    });
  }
}
