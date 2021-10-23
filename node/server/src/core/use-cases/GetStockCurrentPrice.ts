import { UseCase } from '.';
import { Stock } from '@app/core/entities/Stock';
import { StockingAPI } from '@app/services/StockingAPI';

type Params = {
  stockName: string;
};

export class GetStockCurrentPriceUseCase implements UseCase<Params, Stock> {
  constructor(private stockingAPI: StockingAPI) {}

  async execute(params: Params): Promise<Stock> {
    return await this.stockingAPI.fetchByName(params.stockName);
  }
}
