import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

import {
  CityNotFoundException,
  DuplicateSubscriptionException,
  InvalidExternalResponseError,
  SubscriptionConfirmedException,
} from '@app/common/errors';

const domainToGrpc: Record<string, status> = {
  [CityNotFoundException.name]: status.NOT_FOUND,
  [InvalidExternalResponseError.name]: status.INTERNAL,
  [DuplicateSubscriptionException.name]: status.ALREADY_EXISTS,
  [SubscriptionConfirmedException.name]: status.FAILED_PRECONDITION,
  [SubscriptionConfirmedException.name]: status.NOT_FOUND,
};

export const mapGrpcError = (err: unknown): never => {
  if (err instanceof RpcException) {
    throw err;
  }

  const rpcError = domainToGrpc[err.constructor.name];
  if (rpcError) {
    throw new RpcException({
      code: rpcError,
      message: (err as Error).message,
    });
  }

  throw new RpcException({
    code: status.INTERNAL,
    message: 'Unexpected server error',
  });
};
