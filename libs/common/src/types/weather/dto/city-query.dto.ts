import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CityQueryDto {
  @IsString()
  @Length(3, 50)
  @Transform(({ value }) => value.toLowerCase())
  city: string;
}
