import { StockingAPI } from '@app/services/StockingAPI';
import { Stock } from '../entities/Stock';
import { CompareStocksUseCase } from './CompareStocks';
import { StockHistory } from './GetStockHistory';

describe('CompareStocksUseCase', () => {
  it('should return a list of stocks given their names', async () => {
    const stockingAPI = new FakeStockingAPI();
    jest
      .spyOn(stockingAPI, 'fetchByName')
      .mockResolvedValueOnce(new Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }))
      .mockResolvedValueOnce(new Stock({ name: 'any 2', price: 11, pricedAt: new Date('2020-10-11') }))
      .mockResolvedValueOnce(new Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }));
    const sut = new CompareStocksUseCase(stockingAPI);
    const stocks = await sut.execute({
      stockNames: ['any', 'any 2', 'any 3'],
    });
    expect(stocks).toEqual([
      new Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }),
      new Stock({ name: 'any 2', price: 11, pricedAt: new Date('2020-10-11') }),
      new Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }),
    ]);
  });

  it('should remove of stocks result the stock names that not exists', async () => {
    const stockingAPI = new FakeStockingAPI();
    jest
      .spyOn(stockingAPI, 'fetchByName')
      .mockResolvedValueOnce(new Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }))
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(new Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }));
    const sut = new CompareStocksUseCase(stockingAPI);
    const stocks = await sut.execute({
      stockNames: ['any', 'any 2', 'any 3'],
    });
    expect(stocks).toEqual([
      new Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }),
      new Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }),
    ]);
  });
});

class FakeStockingAPI implements StockingAPI {
  fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory> {
    throw new Error('Method not implemented.');
  }

  async fetchByName(name: string): Promise<Stock | null> {
    throw new Error('Method not implemented.');

    return new Stock({ name, price: 49.5, pricedAt: new Date('2020-10-23') });
  }
}
