import { UseCase } from '.';
import { Stock } from '@app/core/entities/Stock';
import { StockingAPI } from '@app/services/StockingAPI';
import { MissingParamError } from '@app/shared/errors/MissingParamError';

type Params = {
  stockName: string;
};

export class GetStockCurrentPriceUseCase implements UseCase<Params, Stock> {
  constructor(private stockingAPI: StockingAPI) {}

  async execute(params: Params): Promise<Stock> {
    if (!params.stockName || !params.stockName.trim()) throw new MissingParamError('stockName');
    return await this.stockingAPI.fetchByName(params.stockName);
  }
}
