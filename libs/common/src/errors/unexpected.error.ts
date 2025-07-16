export class UnexpectedError extends Error {
  constructor(message = 'Unexpected error') {
    super(message);
  }
}
