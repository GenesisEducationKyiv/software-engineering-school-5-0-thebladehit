import { RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const validateAndGetDto = async <T extends NonNullable<unknown>>(
  dtoClass: new () => T,
  payload: unknown
): Promise<T> => {
  const dto = plainToInstance(dtoClass, payload);
  const errors = await validate(dto);
  if (errors.length > 0) {
    throw new RpcException('Validation failed: ' + JSON.stringify(errors));
  }
  return dto;
};
