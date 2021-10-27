import React from 'react';
import { act, render, fireEvent } from '@testing-library/react';
import StocksCompare, { StocksCompareProps } from '.';
import userEvent from '@testing-library/user-event';

describe('StocksCompare', () => {
  it('should be able of select the stocks to compare', async () => {
    const { elements, routines } = createSut();

    routines.typeInInputStockName('IBM{enter}');
    let stocksSelected = await elements.stocksSelected();
    expect(stocksSelected.length).toBe(1);
    expect(stocksSelected[0]).toHaveTextContent('IBM');
    expect(elements.stockNameInput().value).toBe('');

    routines.typeInInputStockName('SATA{enter}');
    stocksSelected = await elements.stocksSelected();
    expect(stocksSelected[0]).toHaveTextContent('SATA');
    expect(stocksSelected[1]).toHaveTextContent('IBM');
  });

  it('should prevent add stock already selected or empty string', async () => {
    const { elements, routines } = createSut();

    routines.typeInInputStockName('IBM{enter}');
    routines.typeInInputStockName('IBM{enter}');
    let stocksSelected = await elements.stocksSelected();
    expect(stocksSelected.length).toBe(1);
    expect(stocksSelected[0]).toHaveTextContent('IBM');

    routines.typeInInputStockName('{space}{enter}');
    stocksSelected = await elements.stocksSelected();
    expect(stocksSelected.length).toBe(1);

    routines.typeInInputStockName('{enter}');
    stocksSelected = await elements.stocksSelected();
    expect(stocksSelected.length).toBe(1);
  });
});

function createSut(props: Partial<StocksCompareProps> = {}) {
  const utils = render(<StocksCompare stockName="any" {...props} />);

  const stockNameInput = () => utils.getByTestId('stock-name-input') as HTMLInputElement;
  const stocksSelected = () => utils.findAllByTestId(/stock-selected-/);

  const elements = {
    stockNameInput,
    stocksSelected,
  };

  const routines = {
    typeInInputStockName,
  };

  return { elements, routines, ...utils };

  function typeInInputStockName(text: string) {
    act(() => {
      userEvent.type(elements.stockNameInput(), text);
    });
  }
}
