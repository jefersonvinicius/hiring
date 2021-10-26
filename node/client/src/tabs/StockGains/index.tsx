import { TextField } from '@material-ui/core';
import { Box } from '@material-ui/system';
import React, { useState } from 'react';

export function StockGains() {
  const [amount, setAmount] = useState(10);
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Box>
      <form>
        <TextField type="number" value={amount} inputProps={{ 'data-testid': 'gains-amount-input' }} />
        <TextField type="date" value={date ?? ''} inputProps={{ 'data-testid': 'gains-date-input' }} />
      </form>
    </Box>
  );
}
