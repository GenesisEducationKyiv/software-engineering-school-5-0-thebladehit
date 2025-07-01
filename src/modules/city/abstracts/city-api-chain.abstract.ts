import { AbstractCityApiService } from '../../../abstracts/city-api.abstract';

export abstract class AbstractCityApiChainService
  implements AbstractCityApiService
{
  abstract isCityExists(name: string): Promise<boolean>;

  abstract setNext(
    next: AbstractCityApiChainService
  ): AbstractCityApiChainService;
}
