import { StockingAPI } from '@app/services/StockingAPI';
import { MissingParamError } from '@app/shared/errors/MissingParamError';
import { Stock } from '../entities/Stock';
import { GetStockCurrentPriceUseCase } from './GetStockCurrentPrice';
import { StockHistory } from './GetStockHistory';

describe('GetStockCurrentPrice', () => {
  it('should fetch stock data on StockingAPI service', async () => {
    const { sut, stockingAPISpies } = createSut();
    const stock = await sut.execute({ stockName: 'any' });

    expect(stockingAPISpies.fetchByName).toHaveBeenCalledWith('any');
    expect(stock).toMatchObject({
      name: 'any',
      price: 49.5,
      pricedAt: new Date('2020-10-23T10:16:00.000Z'),
    });
  });

  it('should returns price given the stock name', async () => {
    const { sut } = createSut();
    const stock = await sut.execute({ stockName: 'any' });

    expect(stock).toMatchObject({
      name: 'any',
      price: 49.5,
      pricedAt: new Date('2020-10-23T10:16:00.000Z'),
    });
  });

  it('should throw an error when invalid stockName ins"t provided', async () => {
    const { sut } = createSut();

    let sutPromise = sut.execute({ stockName: '' });
    await expect(sutPromise).rejects.toThrow(new MissingParamError('stockName'));

    sutPromise = sut.execute({ stockName: ' ' });
    await expect(sutPromise).rejects.toThrow(new MissingParamError('stockName'));
  });
});

function createSut() {
  const stockingAPI = new FakeStockingAPI();
  const stockingAPISpies = {
    fetchByName: jest.spyOn(stockingAPI, 'fetchByName'),
  };
  const sut = new GetStockCurrentPriceUseCase(stockingAPI);
  return { sut, stockingAPISpies };
}

class FakeStockingAPI implements StockingAPI {
  fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory> {
    throw new Error('Method not implemented.');
  }

  async fetchByName(name: string): Promise<Stock> {
    return new Stock({ name, price: 49.5, pricedAt: new Date('2020-10-23T10:16:00.000Z') });
  }
}
