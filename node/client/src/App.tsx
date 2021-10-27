import React from 'react';
import { StockGains } from 'tabs/StockGains';
import StockHistory from 'tabs/StockHistory';
import StockQuote from 'tabs/StockQuote';
import StocksCompare from 'tabs/StocksCompare';

export default function App() {
  return <StocksCompare stockName="IBM" />;
}
