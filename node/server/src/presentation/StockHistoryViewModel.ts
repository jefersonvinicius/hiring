import { HistoryPrice } from '@app/core/entities/HistoryPrice';
import { Stock } from '@app/core/entities/Stock';
import { ViewModel } from '.';
import { format } from 'date-fns';

type Data = {
  stock: Stock;
  history: HistoryPrice[];
};

export class StockHistoryViewModel extends ViewModel<Data> {
  toJSON() {
    return {
      name: this.data.stock.name,
      prices: this.data.history.map((item) => ({
        ...item,
        pricedAt: format(item.pricedAt, 'yyyy-MM-dd'),
      })),
    };
  }
}
