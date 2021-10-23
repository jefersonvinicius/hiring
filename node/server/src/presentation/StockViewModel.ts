import { Stock } from '@app/core/entities/Stock';
import { ViewModel } from '.';

export class StockViewModel extends ViewModel<Stock> {
  get stockName() {
    return this.data.name;
  }

  toJSON() {
    return {
      ...this.data,
    };
  }
}
