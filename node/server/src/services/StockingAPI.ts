import { Stock } from '@app/core/entities/Stock';

export interface StockingAPI {
  fetchByName(name: string): Promise<Stock>;
}
