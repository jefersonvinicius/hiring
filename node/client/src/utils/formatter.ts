import { format } from 'date-fns';
import { format as formatTZ, utcToZonedTime } from 'date-fns-tz';

export class Formatter {
  static brlCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  static date(date: Date, formatStr: string) {
    return format(date, formatStr);
  }

  static dateUTC(date: Date, formatStr: string) {
    const zoned = utcToZonedTime(new Date('2021-10-25T00:00:00.000Z'), 'UTC');
    return formatTZ(zoned, formatStr, { timeZone: 'utc' });
  }

  static isoText(date: Date) {
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${date.getUTCFullYear()}-${month}-${day}`;
  }
}
