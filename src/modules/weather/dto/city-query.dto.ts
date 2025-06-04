import { IsString, Length } from 'class-validator';

export class CityQueryDto {
  @IsString()
  @Length(3, 50)
  city: string;
}
