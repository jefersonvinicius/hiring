import { Stock } from '@app/core/entities/Stock';
import { GetStockCurrentPriceUseCase } from '@app/core/use-cases/GetStockCurrentPrice';
import { StockHistory } from '@app/core/use-cases/GetStockHistory';
import { StockViewModel } from '@app/presentation/StockViewModel';
import { StockingAPI } from '@app/services/StockingAPI';
import { MissingParamError } from '@app/shared/errors/MissingParamError';
import { HttpRequest } from '../HttpRequest';
import { GetStockCurrentPriceRoute } from './GetStockCurrentPriceRoute';

describe('GetStockCurrentPriceRoute', () => {
  it('should returns a stock view model when is a stock name valid', async () => {
    const { sut } = createSut();

    const request = new HttpRequest({
      params: {
        stockName: 'any',
      },
    });
    const response = await sut.handle(request);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(StockViewModel);
    expect(response.body).toEqual(new StockViewModel(createFakeStock('any')));
  });

  it('should returns a 400 when invalid stock name is provided', async () => {
    const { sut } = createSut();
    const request = new HttpRequest({
      params: {
        stockName: ' ',
      },
    });
    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({ message: new MissingParamError('stockName').message });
  });
});

function createSut() {
  const stockingAPI = new FakeStockingAPI();
  const getCurrentPriceUseCase = new GetStockCurrentPriceUseCase(stockingAPI);
  const sut = new GetStockCurrentPriceRoute(getCurrentPriceUseCase);
  return { sut };
}

function createFakeStock(name: string) {
  return new Stock({ name, price: 50, pricedAt: new Date('2021-10-22T10:10:00.000Z') });
}

class FakeStockingAPI implements StockingAPI {
  async fetchByName(name: string): Promise<Stock> {
    return createFakeStock(name);
  }
  fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory> {
    throw new Error('Method not implemented.');
  }
}
