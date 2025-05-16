import { IsString, Length, Matches } from 'class-validator';

export class CityQueryDto {
  @IsString()
  @Length(3, 50)
  city: string;
}
