import { act, render, fireEvent, waitFor } from '@testing-library/react';
import ReactQueryTestingProvider from 'components/ReactQueryTestingProvider';
import React from 'react';
import { StockingAPI } from 'services/StockingAPI';
import { sleep } from 'utils/tests';
import { StockGains, StockGainsProps } from '.';

describe('StockGains', () => {
  let fetchStockGainsSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchStockGainsSpy = jest.spyOn(StockingAPI, 'fetchStockGains').mockResolvedValue(validStockGains());
  });

  it('should display the inputs correctly', () => {
    const { elements } = createSut();

    expect(elements.purchaseAmountInput().value).toBe('10');
    expect(elements.purchaseDateInput().value).toBe('');
  });

  it('should should fetch the stock gains when all data is valid', async () => {
    fetchStockGainsSpy.mockResolvedValue(sleep(100));

    const { elements } = createSut({
      stockName: 'Any',
    });

    act(() => {
      fireEvent.change(elements.purchaseAmountInput(), { target: { value: '11' } });
      fireEvent.change(elements.purchaseDateInput(), { target: { value: '2020-01-01' } });
    });

    await waitFor(() => expect(fetchStockGainsSpy).toHaveBeenCalledWith('Any', new Date('2020-01-01'), 11));
    expect(await elements.loadingIndicator()).toBeInTheDocument();
  });
});

function createSut(props: Partial<StockGainsProps> = {}) {
  const utils = render(
    <ReactQueryTestingProvider>
      <StockGains stockName="any" {...props} />
    </ReactQueryTestingProvider>
  );

  const purchaseAmountInput = () => utils.getByTestId('gains-amount-input') as HTMLInputElement;
  const purchaseDateInput = () => utils.getByTestId('gains-date-input') as HTMLInputElement;
  const loadingIndicator = () => utils.findByTestId('gains-loading-indicator');

  return { elements: { purchaseAmountInput, purchaseDateInput, loadingIndicator }, ...utils };
}

function validStockGains() {
  return {
    name: 'USIM5.SA',
    lastPrice: 14.35,
    priceAtDate: 14.11,
    purchasedAmount: 10,
    purchasedAt: '2021-01-20',
    capitalGains: 2.4000000000000057,
  };
}
