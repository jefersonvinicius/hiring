import { Button, Chip, CircularProgress, ListItem, TextField } from '@material-ui/core';
import { Box } from '@material-ui/system';
import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { StockingAPI } from 'services/StockingAPI';

function useFetchStockComparison(stockName: string, stocksToCompare: string[]) {
  return useQuery([stockName, ...stocksToCompare], () => StockingAPI.fetchStockComparison(stockName, stocksToCompare), {
    enabled: false,
  });
}

export type StocksCompareProps = {
  stockName: string;
};

export default function StocksCompare({ stockName }: StocksCompareProps) {
  const [stocks, setStocks] = useState<string[]>([]);

  const { refetch, isLoading } = useFetchStockComparison(stockName, stocks);

  const stockNameInputRef = useRef<HTMLInputElement>(null);

  function handleAddStock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const stockName = (stockNameInputRef.current?.value ?? '').trim();
    if (!stockName || stocks.includes(stockName)) return;

    setStocks([stockName, ...stocks]);

    if (stockNameInputRef.current) stockNameInputRef.current.value = '';
  }

  function handleDeleteStock(indexToDelete: number) {
    setStocks(stocks.filter((_, index) => index !== indexToDelete));
  }

  function handleCompareClick() {
    refetch();
  }

  return (
    <Box>
      <form onSubmit={handleAddStock}>
        <TextField
          inputRef={stockNameInputRef}
          type="text"
          name="stockName"
          inputProps={{ 'data-testid': 'stock-name-input' }}
        />
      </form>
      <Box display="flex" justifyContent="center" flexWrap="wrap" p={0.5} m={0}>
        {stocks.map((stock, index) => (
          <ListItem key={stock} data-testid={`stock-selected-${index}`}>
            <Chip label={stock} onDelete={() => handleDeleteStock(index)} />
          </ListItem>
        ))}
      </Box>
      <Button data-testid="compare-button" variant="contained" color="primary" onClick={handleCompareClick}>
        Compare
      </Button>
      {isLoading && <CircularProgress data-testid="compare-loading-indicator" />}
    </Box>
  );
}
