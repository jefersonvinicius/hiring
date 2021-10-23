import { Stock } from '@app/core/entities/Stock';
import { StockHistory } from '@app/core/use-cases/GetStockHistory';
import { StockingAPI } from './StockingAPI';

import axios, { AxiosInstance } from 'axios';
import { Clock } from '@app/shared/Clock';

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
    console.log(initialDate, finalDate);
    const initialDateStr = Clock.format(initialDate, 'yyyy-MM-dd');
    const finalDateStr = Clock.format(finalDate, 'yyyy-MM-dd');
    console.log(initialDateStr, finalDateStr);
    return data;
  }
}

export class APIKeyNotProvidedError extends Error {
  constructor() {
    super('The alpha vantage api need an API key');
  }
}
