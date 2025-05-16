export class WeatherAPIDto {
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
    humidity: number;
  };
}
