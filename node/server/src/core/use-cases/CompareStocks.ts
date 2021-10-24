import { StockingAPI } from '@app/services/StockingAPI';
import { UseCase } from '.';
import { Stock } from '../entities/Stock';

type Params = {
  stockNames: string[];
};

type CompareStockResult = Stock[];

export class CompareStocksUseCase implements UseCase<Params, CompareStockResult> {
  constructor(private stockingAPI: StockingAPI) {}

  async execute(params: Params): Promise<CompareStockResult> {
    const result: Stock[] = [];
    for (const stockName of params.stockNames) {
      const stock = await this.stockingAPI.fetchByName(stockName);
      if (stock) result.push(stock);
    }

    return result;
  }
}
