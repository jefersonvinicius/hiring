import { addDays, format } from 'date-fns';

export class Clock {
  static now(): Date {
    return new Date();
  }

  static format(date: Date | number, formatStr: string) {
    return format(date, formatStr);
  }

  static addDays(date: Date | number, amount: number) {
    return addDays(date, amount);
  }
}
