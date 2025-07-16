import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

import { CityNotFoundError, InvalidExternalResponse } from '@app/common/errors';

export const mapGrpcError = (err: unknown): never => {
  if (err instanceof RpcException) {
    throw err;
  }

  if (err instanceof CityNotFoundError) {
    throw new RpcException({
      code: status.NOT_FOUND,
      message: err.message,
    });
  }

  if (err instanceof InvalidExternalResponse) {
    throw new RpcException({
      code: status.FAILED_PRECONDITION,
      message: err.message,
    });
  }

  throw new RpcException({
    code: status.INTERNAL,
    message: 'Unexpected server error',
  });
};
