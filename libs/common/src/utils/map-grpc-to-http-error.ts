import { status } from '@grpc/grpc-js';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export const mapGrpcToHttpError = (err: unknown): never => {
  const { code, details } = err as {
    code: number;
    details: string;
  };

  switch (code) {
    case status.NOT_FOUND:
      throw new NotFoundException(details);
    case status.FAILED_PRECONDITION:
    case status.ALREADY_EXISTS:
      throw new ConflictException(details);
    case status.INTERNAL:
    case status.UNKNOWN:
    default:
      throw new InternalServerErrorException();
  }
};
