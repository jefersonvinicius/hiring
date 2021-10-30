import { render } from '@testing-library/react';
import App from 'App';
import React from 'react';

describe('App', () => {
  it('should renders the stock name need message when stock name is empty', async () => {
    const { elements } = createSut();
    expect(await elements.stockNameNeed()).toBeInTheDocument();
  });
});

function createSut() {
  const utils = render(<App />);

  const stockNameNeed = () => utils.findByTestId('stock-name-need');

  const elements = {
    stockNameNeed,
  };

  return { elements, ...utils };
}
