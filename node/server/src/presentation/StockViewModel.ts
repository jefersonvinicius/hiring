import { Stock } from '@app/core/entities/Stock';
import { ViewModel } from '.';

export class StockViewModel extends ViewModel<Stock> {
  toJSON() {
    return {
      ...this.data,
    };
  }
}
