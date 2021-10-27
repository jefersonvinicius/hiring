import React from 'react';
import { StockGains } from 'tabs/StockGains';
import StockHistory from 'tabs/StockHistory';
import StockQuote from 'tabs/StockQuote';

export default function App() {
  return <StockGains stockName="IBM" />;
}
