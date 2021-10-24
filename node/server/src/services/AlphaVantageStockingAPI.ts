import { Stock } from '@app/core/entities/Stock';
import { StockHistory } from '@app/core/use-cases/GetStockHistory';
import { StockingAPI } from './StockingAPI';

import axios, { AxiosInstance } from 'axios';
import { Clock } from '@app/shared/Clock';
import { HistoryPrice } from '@app/core/entities/HistoryPrice';

export const alphaVantageApi = axios.create({
  baseURL: 'https://www.alphavantage.co',
});

export class AlphaVantageStockingAPI implements StockingAPI {
  constructor(private apiKey?: string) {
    if (!this.apiKey) throw new APIKeyNotProvidedError();
  }

  async fetchByName(name: string): Promise<Stock | null> {
    const url = `/query?function=GLOBAL_QUOTE&symbol=${name}&apikey=${this.apiKey}`;
    const { data } = await alphaVantageApi.get<any>(url);
    const info = data['Global Quote'];

    if (!info || !info['01. symbol']) return null;

    return new Stock({
      name: info['01. symbol'],
      price: Number(info['05. price']),
      pricedAt: Clock.now(),
    });
  }

  async fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory> {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${name}&outputsize=full&apikey=${this.apiKey}`;
    const { data } = await alphaVantageApi.get<any>(url);
    console.log(process.env.TZ);
    console.log(initialDate, finalDate);
    console.log(initialDate.getUTCDate());
    console.log(initialDate.getTimezoneOffset());
    const initialDateStr = Clock.format(initialDate, 'yyyy-MM-dd');
    const finalDateStr = Clock.format(finalDate, 'yyyy-MM-dd');
    console.log(initialDateStr, finalDateStr);

    const historyData = data['Time Series (Daily)'] as { [key: string]: any };
    const entries = Object.entries(historyData);
    const finalIndex = entries.findIndex(([dateStr]) => initialDateStr === dateStr);
    const startIndex = entries.findIndex(([dateStr]) => finalDateStr === dateStr);
    console.log(startIndex, finalIndex);
    const entriesWithin = entries.slice(startIndex, finalIndex + 1);
    const historyPrices = entriesWithin.map(([dateStr, values]) => {
      return new HistoryPrice({
        opening: Number(values['1. open']),
        closing: Number(values['4. close']),
        low: Number(values['3. low']),
        high: Number(values['2. high']),
        volume: Number(values['5. volume']),
        pricedAt: new Date(dateStr),
      });
    });

    return {
      stockName: name,
      history: historyPrices,
    };
  }
}

export class APIKeyNotProvidedError extends Error {
  constructor() {
    super('The alpha vantage api need an API key');
  }
}
