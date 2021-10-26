import { render } from '@testing-library/react';
import React from 'react';
import { StockGains } from '.';

describe('StockGains', () => {
  it('should display the inputs correctly', () => {
    const { elements } = createSut();

    expect(elements.purchaseAmountInput().value).toBe('10');
    expect(elements.purchaseDateInput().value).toBe('');
  });
});

function createSut() {
  const utils = render(<StockGains />);

  const purchaseAmountInput = () => utils.getByTestId('gains-amount-input') as HTMLInputElement;
  const purchaseDateInput = () => utils.getByTestId('gains-date-input') as HTMLInputElement;

  return { elements: { purchaseAmountInput, purchaseDateInput }, ...utils };
}
