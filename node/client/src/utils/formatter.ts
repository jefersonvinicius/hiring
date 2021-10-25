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

  static isoText(date: Date) {
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${date.getUTCFullYear()}-${month}-${day}`;
  }
}
