"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseViewModel = void 0;
function parseViewModel(viewModel) {
    return JSON.parse(JSON.stringify(viewModel));
}
exports.parseViewModel = parseViewModel;
