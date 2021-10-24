"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = void 0;
const date_fns_1 = require("date-fns");
class Clock {
    static now() {
        return new Date();
    }
    static format(date, formatStr) {
        return (0, date_fns_1.format)(date, formatStr);
    }
    static addDays(date, amount) {
        return (0, date_fns_1.addDays)(date, amount);
    }
    static subtractDays(date, amount) {
        return (0, date_fns_1.subDays)(date, amount);
    }
    static isAfter(date, dateToCompare) {
        return (0, date_fns_1.isAfter)(date, dateToCompare);
    }
    static isAfterNow(dateToCompare) {
        return (0, date_fns_1.isAfter)(dateToCompare, this.now());
    }
    static isBefore(date, dateToCompare) {
        return (0, date_fns_1.isBefore)(date, dateToCompare);
    }
}
exports.Clock = Clock;
