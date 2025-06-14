export interface WeatherAPIDto {
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
    humidity: number;
  };
}
