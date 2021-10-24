"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewModel = void 0;
class ViewModel {
    constructor(data) {
        this.data = data;
    }
    toJSON() {
        return this.data;
    }
}
exports.ViewModel = ViewModel;
