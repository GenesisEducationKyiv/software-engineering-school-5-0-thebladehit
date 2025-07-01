import { AbstractCityApiChainService } from '../abstracts/city-api-chain.abstract';

export abstract class BaseCityProvider implements AbstractCityApiChainService {
  private next: AbstractCityApiChainService;

  setNext(next: AbstractCityApiChainService): AbstractCityApiChainService {
    this.next = next;
    return next;
  }

  async isCityExists(name: string): Promise<boolean> {
    try {
      const result = await this.handleIsCityExists(name);
      if (!result && this.next) {
        return this.next.isCityExists(name);
      }
      return result;
    } catch (err) {
      if (this.next) {
        return this.next.isCityExists(name);
      }
      return false;
    }
  }

  protected abstract handleIsCityExists(name: string): Promise<boolean>;
}
