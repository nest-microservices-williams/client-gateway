import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    if (
      typeof rpcError === 'object' &&
      'statusCode' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.statusCode) ? 400 : +rpcError.statusCode;
      return response.status(status).json(rpcError);
    }

    return response.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: rpcError,
    });
  }
}
