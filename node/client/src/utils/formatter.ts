import { format } from 'date-fns';

export class Formatter {
  static brlCurrency(value: number) {
    return new Intl.NumberFormat([], {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  static date(date: Date, formatStr: string) {
    return format(date, formatStr);
  }
}
