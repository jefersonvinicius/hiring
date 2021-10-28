import {
  Button,
  Chip,
  CircularProgress,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import { Box } from '@material-ui/system';
import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Quote, StockingAPI } from 'services/StockingAPI';
import { Formatter } from 'utils/formatter';

function useFetchStockComparison(stockName: string, stocksToCompare: string[]) {
  return useQuery([stockName, ...stocksToCompare], () => StockingAPI.fetchStockComparison(stockName, stocksToCompare), {
    enabled: false,
    refetchOnWindowFocus: false,
  });
}

export enum ColorsStockIndicator {
  Up = '#9ccc65',
  Down = '#ef5350',
  Same = '#4fc3f7',
}
export type StocksCompareProps = {
  stockName: string;
};

export default function StocksCompare({ stockName }: StocksCompareProps) {
  const [stocks, setStocks] = useState<string[]>([]);

  const { data, refetch, isLoading } = useFetchStockComparison(stockName, stocks);

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
      <Box display="flex" flexDirection="row" justifyContent="center" flexWrap="wrap" p={0.5} m={0}>
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
      {!isLoading && data && (
        <Table>
          <TableHeading />
          <TableBody>
            {data.lastPrices.map((quote, index) => (
              <StockRow key={quote.name} quoteComparing={data.lastPrices[0]} quote={quote} index={index} />
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}

type StockRowProps = {
  index: number;
  quoteComparing: Quote;
  quote: Quote;
};

function StockRow({ quoteComparing, quote, index }: StockRowProps) {
  function priceCellColor() {
    if (index === 0) return undefined;
    if (quote.lastPrice > quoteComparing.lastPrice) return ColorsStockIndicator.Up;
    if (quote.lastPrice < quoteComparing.lastPrice) return ColorsStockIndicator.Down;
    return ColorsStockIndicator.Same;
  }

  function indicator() {
    if (index === 0 || quote.lastPrice === quoteComparing.lastPrice) return null;
    if (quote.lastPrice > quoteComparing.lastPrice) return <ArrowDropUp data-testid="up-indicator" />;
    return <ArrowDropDown data-testid="down-indicator" />;
  }

  return (
    <TableRow data-testid={`stock-row-${index}`}>
      <TableCell data-testid="cell-name">{quote.name}</TableCell>
      <TableCell data-testid="cell-price" style={{ backgroundColor: priceCellColor() }}>
        {indicator()}
        {Formatter.brlCurrency(quote.lastPrice)}
      </TableCell>
      <TableCell data-testid="cell-priced-at">{Formatter.dateUTC(new Date(quote.pricedAt), 'dd/MM/yyyy')}</TableCell>
    </TableRow>
  );
}

function TableHeading() {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Stock</TableCell>
        <TableCell>Price</TableCell>
        <TableCell>Priced At</TableCell>
      </TableRow>
    </TableHead>
  );
}
