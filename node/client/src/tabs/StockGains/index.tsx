import { CircularProgress, TextField } from '@material-ui/core';
import { Box } from '@material-ui/system';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { StockingAPI } from 'services/StockingAPI';

function useFetchStockGains(stockName: string, purchasedAt: Date | null, amount: number) {
  return useQuery(
    ['quote', stockName, purchasedAt, amount],
    () => StockingAPI.fetchStockGains(stockName, purchasedAt as Date, amount),
    {
      enabled: !!stockName && !!purchasedAt && amount > 0,
    }
  );
}

export type StockGainsProps = {
  stockName: string;
};

export function StockGains({ stockName }: StockGainsProps) {
  const [amount, setAmount] = useState(10);
  const [date, setDate] = useState<Date | null>(null);

  const { data, isLoading } = useFetchStockGains(stockName, date, amount);

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDate(new Date(event.target.value));
  }

  return (
    <Box>
      <form>
        <TextField
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          inputProps={{ 'data-testid': 'gains-amount-input' }}
        />
        <TextField
          type="date"
          value={date ?? ''}
          onChange={handleDateChange}
          inputProps={{ 'data-testid': 'gains-date-input' }}
        />
      </form>
      {isLoading && <CircularProgress data-testid="gains-loading-indicator" />}
    </Box>
  );
}
