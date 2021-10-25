import axios from 'axios';
import { Formatter } from 'utils/formatter';

export const stockingAPIInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

export class StockingAPI {
  static async fetchQuote(stockName: string) {
    try {
      const { data } = await stockingAPIInstance.get<Quote>(`/stock/${stockName}/quote`);
      return data;
    } catch (error: any) {
      if (error?.response?.status) throw new StockNotFoundError(stockName);
      throw error;
    }
  }

  static async fetchHistory(stockName: string, initialDate: Date, finalDate: Date) {
    try {
      const from = Formatter.isoText(initialDate);
      const to = Formatter.isoText(finalDate);
      const url = `/stocks/${stockName}/history?from=${from}&to=${to}`;
      const { data } = await stockingAPIInstance.get<History>(url);
      return data;
    } catch (error: any) {
      if (error?.response?.status) throw new StockNotFoundError(stockName);
      throw error;
    }
  }
}

export class StockNotFoundError extends Error {
  constructor(stockName: string) {
    super(`Stock with name ${stockName} not found`);
  }
}

type Quote = {
  name: string;
  lastPrice: number;
  pricedAt: string;
};

type History = {
  name: string;
  prices: HistoryEntry[];
};

type HistoryEntry = {
  opening: number;
  low: number;
  high: number;
  closing: number;
  pricedAt: string;
  volume: number;
};
