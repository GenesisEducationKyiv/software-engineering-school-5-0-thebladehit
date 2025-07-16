export class InvalidExternalResponse extends Error {
  constructor(url: string) {
    super(`Invalid response from URL: ${url} `);
  }
}
