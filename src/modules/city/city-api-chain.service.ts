import { InternalServerErrorException } from '@nestjs/common';

import { AbstractCityApiChainService } from '../abstracts/city-api-chain.abstract';

export class CityApiChainService implements AbstractCityApiChainService {
  protected next?: AbstractCityApiChainService;

  constructor(...cityApiProviders: AbstractCityApiChainService[]) {
    this.setupChain(cityApiProviders);
  }

  setNext(next: AbstractCityApiChainService): void {
    this.next = next;
  }

  private setupChain(cityApiProviders: AbstractCityApiChainService[]): void {
    if (cityApiProviders.length === 0) {
      return;
    }
    let currentProvider = cityApiProviders[0];
    this.setNext(currentProvider);
    for (let i = 1; i < cityApiProviders.length; i++) {
      const nextProvider = cityApiProviders[i];
      currentProvider.setNext(nextProvider);
      currentProvider = nextProvider;
    }
  }

  isCityExists(name: string): Promise<boolean> {
    if (!this.next) {
      throw new InternalServerErrorException('No providers');
    }
    return this.next.isCityExists(name);
  }
}
