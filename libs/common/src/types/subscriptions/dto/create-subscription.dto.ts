import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

import { SubscriptionType } from '@app/common/types';

export class CreateSubscriptionDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(3)
  @Transform(({ value }) => value.toLowerCase())
  city: string;

  @IsIn(['DAILY', 'HOURLY'])
  frequency: SubscriptionType;
}
