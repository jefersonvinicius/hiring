import React from 'react';
import { act, render, fireEvent, within } from '@testing-library/react';
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

  it('should be able delete the stocks selected', async () => {
    const { elements, routines } = createSut();

    routines.typeInInputStockName('IBM{enter}');
    routines.typeInInputStockName('AMBEV{enter}');

    let stocksSelected = await elements.stocksSelected();
    expect(stocksSelected).toHaveLength(2);

    await routines.deleteSelectedStock(1);

    stocksSelected = await elements.stocksSelected();
    expect(stocksSelected).toHaveLength(1);
    expect(stocksSelected[0]).toHaveTextContent('AMBEV');
  });
});

function createSut(props: Partial<StocksCompareProps> = {}) {
  const utils = render(<StocksCompare stockName="any" {...props} />);

  const stockNameInput = () => utils.getByTestId('stock-name-input') as HTMLInputElement;
  const stocksSelected = () => utils.findAllByTestId(/stock-selected-/);
  const stockSelected = (stockIndex: number) => utils.findByTestId(`stock-selected-${stockIndex}`);

  const elements = {
    stockNameInput,
    stocksSelected,
    stockSelected,
  };

  const routines = {
    typeInInputStockName,
    deleteSelectedStock,
  };

  return { elements, routines, ...utils };

  function typeInInputStockName(text: string) {
    act(() => {
      userEvent.type(elements.stockNameInput(), text);
    });
  }

  async function deleteSelectedStock(stockIndex: number) {
    const stock = await elements.stockSelected(stockIndex);
    const deleteButton = stock.querySelector('.MuiChip-deleteIcon');
    act(() => {
      fireEvent.click(deleteButton as HTMLElement);
    });
  }
}
