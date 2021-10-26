import { CircularProgress, TextField } from '@material-ui/core';
import { Box } from '@material-ui/system';
import { DataGrid, GridColumns, GridValueFormatterParams } from '@mui/x-data-grid';
import { isAfter, subDays } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { StockingAPI } from 'services/StockingAPI';
import { Clock } from 'utils/clock';
import { Formatter } from 'utils/formatter';

export type StockHistoryProps = {
  stockName: string;
};

function useFetchStockHistory(stockName: string, initialDate: Date, finalDate: Date) {
  return useQuery(['quote', stockName], () => StockingAPI.fetchHistory(stockName, initialDate, finalDate), {
    enabled: !!stockName && isAfter(finalDate, initialDate),
  });
}

const valueFormatterBRL = (params: GridValueFormatterParams) => Formatter.brlCurrency(Number(params.value ?? 0));
const valueFormatterDate = (params: GridValueFormatterParams) =>
  Formatter.dateUTC(new Date(params.value as string), 'dd/MM/yyyy');

const columns: GridColumns = [
  { field: 'pricedAt', headerName: 'Date', width: 200, valueFormatter: valueFormatterDate },
  { field: 'opening', headerName: 'Opening', width: 200, valueFormatter: valueFormatterBRL },
  { field: 'low', headerName: 'Low', width: 200, valueFormatter: valueFormatterBRL },
  { field: 'high', headerName: 'High', width: 200, valueFormatter: valueFormatterBRL },
  { field: 'closing', headerName: 'Closing', width: 200, valueFormatter: valueFormatterBRL },
];

export default function StockHistory({ stockName }: StockHistoryProps) {
  const [initialDate, setInitialDate] = useState(subDays(Clock.now(), 30));
  const [finalDate, setFinalDate] = useState(Clock.now());

  const { data: history, isLoading, error } = useFetchStockHistory(stockName, initialDate, finalDate);

  const initialDateStr = useMemo(() => Formatter.isoText(initialDate), [initialDate]);
  const finalDateStr = useMemo(() => Formatter.isoText(finalDate), [finalDate]);

  return (
    <Box>
      <Box>
        <TextField type="date" value={initialDateStr} inputProps={{ 'data-testid': 'history-initial-date' }} />
        <TextField type="date" value={finalDateStr} inputProps={{ 'data-testid': 'history-final-date' }} />
      </Box>
      {isLoading && <CircularProgress data-testid="history-loading-indicator" />}
      {!isLoading && history && (
        <Box>
          <DataGrid
            data-testid="grid"
            columns={columns}
            rows={history.prices.map((price) => ({ id: price.pricedAt, ...price }))}
          />
        </Box>
      )}
      {/* {error instanceof StockNotFoundError && (
         <Box>
           <Typography data-testid="quote-not-found-message">Stock with name "{stockName}" not found</Typography>
         </Box>
       )} */}
    </Box>
  );
}
