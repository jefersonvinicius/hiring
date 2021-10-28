import React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react';
import StocksCompare, { StocksCompareProps } from '.';
import userEvent from '@testing-library/user-event';
import { StockingAPI } from 'services/StockingAPI';
import { sleep } from 'utils/tests';
import ReactQueryTestingProvider from 'components/ReactQueryTestingProvider';

describe('StocksCompare', () => {
  let fetchStockComparisonSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchStockComparisonSpy = jest
      .spyOn(StockingAPI, 'fetchStockComparison')
      .mockResolvedValue(validComparisonResponse());
  });

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

  it('should load the comparison data after click compare button', async () => {
    fetchStockComparisonSpy.mockResolvedValue(sleep(100));
    const { elements, routines } = createSut({ stockName: 'Any' });

    routines.typeInInputStockName('IBM{enter}');
    routines.typeInInputStockName('SATA{enter}');
    routines.clickInCompareButton();

    await waitFor(() => expect(fetchStockComparisonSpy).toHaveBeenCalledWith('Any', ['SATA', 'IBM']));
    expect(await elements.loadingIndicator()).toBeInTheDocument();
  });
});

function createSut(props: Partial<StocksCompareProps> = {}) {
  const utils = render(
    <ReactQueryTestingProvider>
      <StocksCompare stockName="any" {...props} />
    </ReactQueryTestingProvider>
  );

  const stockNameInput = () => utils.getByTestId('stock-name-input') as HTMLInputElement;
  const compareButton = () => utils.getByTestId('compare-button') as HTMLInputElement;
  const stocksSelected = () => utils.findAllByTestId(/stock-selected-/);
  const stockSelected = (stockIndex: number) => utils.findByTestId(`stock-selected-${stockIndex}`);
  const loadingIndicator = () => utils.findByTestId('compare-loading-indicator');

  const elements = {
    stockNameInput,
    stocksSelected,
    stockSelected,
    compareButton,
    loadingIndicator,
  };

  const routines = {
    typeInInputStockName,
    deleteSelectedStock,
    clickInCompareButton,
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

  function clickInCompareButton() {
    act(() => {
      fireEvent.click(elements.compareButton());
    });
  }
}

function validComparisonResponse() {
  return {
    lastPrices: [
      {
        name: 'IBM',
        lastPrice: 125.17,
        pricedAt: '2021-10-27',
      },
      {
        name: 'PETR4.SA',
        lastPrice: 28.69,
        pricedAt: '2021-10-27',
      },
      {
        name: 'VALE3.SA',
        lastPrice: 74.45,
        pricedAt: '2021-10-27',
      },
    ],
  };
}
