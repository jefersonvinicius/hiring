import axios from 'axios';

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
