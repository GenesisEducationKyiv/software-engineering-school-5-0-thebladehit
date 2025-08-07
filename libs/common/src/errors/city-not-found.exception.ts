export class CityNotFoundException extends Error {
  constructor(city: string) {
    super(`City "${city}" not found`);
  }
}
