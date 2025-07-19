export interface Event {
  type: string;
  payload: unknown;
}

export abstract class AbstractEventBus {
  abstract publish(event: Event): Promise<void>;
  abstract subscribe(
    eventType: string,
    handler: (event: Event) => Promise<void>
  ): Promise<void>;
}
