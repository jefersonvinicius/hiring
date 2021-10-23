import { Stock } from '@app/core/entities/Stock';
import { Clock } from '@app/shared/Clock';
import { alphaVantageApi, AlphaVantageStockingAPI, APIKeyNotProvidedError } from './AlphaVantageStockingAPI';

import { IBM_STOCK_DAILY_HISTORY } from '@app/__tests__/fixtures/stock-history-sample';

describe('AlphaVantageStockingAPI', () => {
  it('should throws an error if API key isn"t provided', () => {
    expect(() => {
      // @ts-ignore
      new AlphaVantageStockingAPI();
    }).toThrow(new APIKeyNotProvidedError());
  });

  describe('fetchByName', () => {
    it('should return an stock instance', async () => {
      const apiGetSpy = jest.spyOn(alphaVantageApi, 'get').mockResolvedValue(validStockResponse());
      jest.spyOn(Clock, 'now').mockReturnValue(new Date('2022-10-22T10:00:00.000Z'));

      const sut = new AlphaVantageStockingAPI('any');
      const stock = await sut.fetchByName('any_stock');

      expect(apiGetSpy).toHaveBeenCalledWith(`/query?function=GLOBAL_QUOTE&symbol=any_stock&apikey=any`);
      expect(stock).toBeInstanceOf(Stock);
      expect(stock).toEqual({
        name: 'any_stock',
        price: 127.88,
        pricedAt: new Date('2022-10-22T10:00:00.000Z'),
      });
    });

    it('should returns null when not return stock info', async () => {
      jest.spyOn(alphaVantageApi, 'get').mockResolvedValue(emptyStockResponse());

      const sut = new AlphaVantageStockingAPI('any');
      const stock = await sut.fetchByName('any_stock');

      expect(stock).toBeNull();
    });
  });

  describe('fetchStockHistory', () => {
    it('should get history correctly when the range date is within of response', async () => {
      const apiGetSpy = jest.spyOn(alphaVantageApi, 'get').mockResolvedValue(validHistoryResponse());

      const sut = new AlphaVantageStockingAPI('any');
      const history = await sut.fetchStockHistory(
        'any_stock',
        new Date('2021-10-06'),
        new Date('2021-10-22T00:01:00.000Z')
      );

      expect(apiGetSpy).toHaveBeenCalledWith(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=any_stock&outputsize=full&apikey=any`
      );
      expect(history).toEqual({
        stockName: 'any_stock',
        history: [
          {
            open: '128.0500',
            high: '130.2500',
            low: '126.6110',
            close: '127.8800',
            volume: '11582195',
            pricedAt: new Date('2021-10-22'),
          },
          {
            open: '133.5100',
            high: '133.7200',
            low: '128.1000',
            close: '128.3300',
            volume: '31466529',
            pricedAt: new Date('2021-10-21'),
          },
          {
            open: '141.6800',
            high: '142.2000',
            low: '140.7000',
            close: '141.9000',
            volume: '6189255',
            pricedAt: new Date('2021-10-20'),
          },
          {
            open: '141.0800',
            high: '142.9400',
            low: '140.5201',
            close: '141.9800',
            volume: '4339548',
            pricedAt: new Date('2021-10-19'),
          },
          {
            open: '144.0000',
            high: '144.9400',
            low: '141.7590',
            close: '142.3200',
            volume: '6154055',
            pricedAt: new Date('2021-10-18'),
          },
          {
            open: '143.3900',
            high: '144.8500',
            low: '142.7900',
            close: '144.6100',
            volume: '3222778',
            pricedAt: new Date('2021-10-15'),
          },
          {
            open: '141.0400',
            high: '143.9200',
            low: '141.0100',
            close: '143.3900',
            volume: '4217305',
            pricedAt: new Date('2021-10-14'),
          },
          {
            open: '140.5200',
            high: '141.4100',
            low: '139.6600',
            close: '140.7600',
            volume: '2880747',
            pricedAt: new Date('2021-10-13'),
          },
          {
            open: '142.2100',
            high: '142.3000',
            low: '140.3000',
            close: '140.4700',
            volume: '3148559',
            pricedAt: new Date('2021-10-12'),
          },
          {
            open: '143.5000',
            high: '144.0800',
            low: '142.4000',
            close: '142.4300',
            volume: '2793298',
            pricedAt: new Date('2021-10-11'),
          },
          {
            open: '141.8100',
            high: '143.6500',
            low: '141.0500',
            close: '143.2200',
            volume: '3731279',
            pricedAt: new Date('2021-10-08'),
          },
          {
            open: '142.7300',
            high: '143.3950',
            low: '141.5300',
            close: '141.8100',
            volume: '3823803',
            pricedAt: new Date('2021-10-07'),
          },
          {
            open: '142.4800',
            high: '143.3700',
            low: '140.8900',
            close: '142.3600',
            volume: '5328433',
            pricedAt: new Date('2021-10-06'),
          },
        ],
      });
    });
  });
});

function validStockResponse() {
  return {
    data: {
      'Global Quote': {
        '01. symbol': 'any_stock',
        '02. open': '128.0500',
        '03. high': '130.2500',
        '04. low': '126.6110',
        '05. price': '127.8800',
        '06. volume': '11582195',
        '07. latest trading day': '2021-10-22',
        '08. previous close': '128.3300',
        '09. change': '-0.4500',
        '10. change percent': '-0.3507%',
      },
    },
  };
}

function emptyStockResponse() {
  return {
    data: {
      'Global Quote': {},
    },
  };
}

function validHistoryResponse() {
  return {
    data: IBM_STOCK_DAILY_HISTORY,
  };
}
