import { render } from '@testing-library/react';
import StockHistory, { StockHistoryProps } from '.';

describe.skip('StockHistory', () => {
  it('should display the loading indicator', async () => {
    const { elements } = createSut();
    expect(await elements.loadingIndicator()).toBeInTheDocument();
  });

  it.todo('should display the initial date picker and final date picker');
});

function createSut(props: Partial<StockHistoryProps> = {}) {
  const utils = render(<StockHistory stockName="any" {...props} />);

  const loadingIndicator = () => utils.findByTestId('history-loading-indicator');
  const initialDate = () => utils.findByTestId('history-initial-date');
  const finalDate = () => utils.findByTestId('history-final-date');

  return {
    ...utils,
    elements: {
      loadingIndicator,
      initialDate,
      finalDate,
    },
  };
}
