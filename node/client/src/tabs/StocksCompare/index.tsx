import { Chip, ListItem, TextField } from '@material-ui/core';
import { Box } from '@material-ui/system';
import React, { useRef, useState } from 'react';

export type StocksCompareProps = {
  stockName: string;
};

export default function StocksCompare({ stockName }: StocksCompareProps) {
  const [stocks, setStocks] = useState<string[]>([]);

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
      <Box>
        {stocks.map((stock, index) => (
          <ListItem key={stock} data-testid={`stock-selected-${index}`}>
            <Chip label={stock} onDelete={() => handleDeleteStock(index)} />
          </ListItem>
        ))}
      </Box>
    </Box>
  );
}
