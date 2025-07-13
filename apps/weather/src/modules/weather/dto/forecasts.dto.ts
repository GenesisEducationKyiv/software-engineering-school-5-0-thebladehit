import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ForecastsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  cities: string[];
}
