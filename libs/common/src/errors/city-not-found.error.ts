export class CityNotFoundError extends Error {
  constructor(city: string) {
    super(`City "${city}" not found`);
  }
}
