import { StockingAPI } from '@app/services/StockingAPI';
import { Stock } from '../entities/Stock';
import { GetStockCurrentPriceUseCase } from './GetStockCurrentPrice';

class FakeStockingAPI implements StockingAPI {
  async fetchByName(name: string): Promise<Stock> {
    return new Stock({ name, price: 49.5, pricedAt: new Date('2020-10-23T10:16:00.000Z') });
  }
}

function createSUT() {
  const stockingAPI = new FakeStockingAPI();
  const stockingAPISpies = {
    fetchByName: jest.spyOn(stockingAPI, 'fetchByName'),
  };
  const sut = new GetStockCurrentPriceUseCase(stockingAPI);
  return { sut, stockingAPISpies };
}

describe('GetStockCurrentPrice', () => {
  it('should fetch stock data on StockingAPI service', async () => {
    const { sut, stockingAPISpies } = createSUT();
    const stock = await sut.execute({ stockName: 'any' });

    expect(stockingAPISpies.fetchByName).toHaveBeenCalledWith('any');
    expect(stock).toMatchObject({
      name: 'any',
      price: 49.5,
      pricedAt: new Date('2020-10-23T10:16:00.000Z'),
    });
  });

  it('should returns price given the stock name', async () => {
    const { sut } = createSUT();
    const stock = await sut.execute({ stockName: 'any' });

    expect(stock).toMatchObject({
      name: 'any',
      price: 49.5,
      pricedAt: new Date('2020-10-23T10:16:00.000Z'),
    });
  });
});
