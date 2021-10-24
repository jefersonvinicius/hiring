import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export class StockingAPI {
  static async fetchQuote(stockName: string) {
    const { data } = await api.get<Quote>(`/stock/${stockName}/quote`);
    return data;
  }
}

type Quote = {
  name: string;
  lastPrice: number;
  pricedAt: string;
};
