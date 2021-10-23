import { Stock } from '@app/core/entities/Stock';
import { StockHistory } from '@app/core/use-cases/GetStockHistory';

export interface StockingAPI {
  fetchByName(name: string): Promise<Stock>;
  fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory>;
}
