import React from 'react';
import { CircularProgress, Paper, Typography } from '@material-ui/core';
import { Box } from '@material-ui/system';
import { useQuery } from 'react-query';
import { StockingAPI } from 'services/StockingAPI';
import { Formatter } from 'utils/formatter';

export type StockQuoteProps = {
  stockName: string;
};

function useFetchStockQuote(stockName: string) {
  return useQuery(['quote', stockName], () => StockingAPI.fetchQuote(stockName), {
    enabled: !!stockName,
  });
}

export default function StockQuote({ stockName }: StockQuoteProps) {
  const { data: quote, isLoading } = useFetchStockQuote(stockName);

  return (
    <Box>
      {isLoading && <CircularProgress data-testid="quote-loading-indicator" />}
      {!isLoading && quote && (
        <Box>
          <Paper>
            <Typography data-testid="quote-last-price">
              Last Price: {Formatter.brlCurrency(quote?.lastPrice)}
            </Typography>
            <Typography data-testid="quote-priced-at">
              Priced At: {quote?.pricedAt.split('-').reverse().join('/')}
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
