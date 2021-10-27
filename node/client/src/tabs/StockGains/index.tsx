import { CircularProgress, Paper, TextField, Typography } from '@material-ui/core';
import { Box } from '@material-ui/system';
import StockNotFoundMessage from 'components/StockNotFoundMessage';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { StockingAPI, StockNotFoundError } from 'services/StockingAPI';
import { Formatter } from 'utils/formatter';

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

  const { data, isLoading, error } = useFetchStockGains(stockName, date, amount);

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDate(new Date(event.target.value));
  }

  console.log(error);

  const dateIsoText = useMemo(() => (date ? Formatter.isoText(date) : ''), [date]);

  const signal = (data?.capitalGains ?? 0) < 0 ? '-' : '+';

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
          value={dateIsoText}
          onChange={handleDateChange}
          inputProps={{ 'data-testid': 'gains-date-input' }}
        />
      </form>
      {isLoading && <CircularProgress data-testid="gains-loading-indicator" />}
      {!isLoading && data && (
        <Box>
          <Paper>
            <Typography data-testid="gains-label">
              {signal} {Formatter.brlCurrency(Math.abs(data.capitalGains))}
            </Typography>
          </Paper>
          <Box>
            <Typography data-testid="gains-old-price-label">{Formatter.brlCurrency(data.priceAtDate)}</Typography>
            <Typography data-testid="gains-current-price-label">{Formatter.brlCurrency(data.lastPrice)}</Typography>
          </Box>
        </Box>
      )}
      {error instanceof StockNotFoundError && <StockNotFoundMessage stockName={stockName} />}
    </Box>
  );
}
