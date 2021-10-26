import { render } from '@testing-library/react';
import ReactQueryTestingProvider from 'components/ReactQueryTestingProvider';
import { StockingAPI } from 'services/StockingAPI';
import { Clock } from 'utils/clock';
import { sleep } from 'utils/tests';
import StockHistory, { StockHistoryProps } from '.';

describe('StockHistory', () => {
  let fetchHistorySpy: jest.SpyInstance;

  beforeEach(() => {
    fetchHistorySpy = jest.spyOn(StockingAPI, 'fetchHistory').mockResolvedValue(validHistory());
  });

  it('should display the loading indicator', async () => {
    fetchHistorySpy.mockImplementation(() => sleep(100));
    const { elements } = createSut();
    expect(await elements.loadingIndicator()).toBeInTheDocument();
  });

  it('should display the initial date picker and final date picker', async () => {
    jest.spyOn(Clock, 'now').mockReturnValue(new Date('2021-10-30T10:00:00.000Z'));
    const { elements } = createSut();

    expect((await elements.initialDate()).value).toBe('2021-09-30');
    expect((await elements.finalDate()).value).toBe('2021-10-30');
  });
});

function createSut(props: Partial<StockHistoryProps> = {}) {
  const utils = render(
    <ReactQueryTestingProvider>
      <StockHistory stockName="any" {...props} />
    </ReactQueryTestingProvider>
  );

  const loadingIndicator = () => utils.findByTestId('history-loading-indicator');
  const initialDate = async () => (await utils.findByTestId('history-initial-date')) as HTMLInputElement;
  const finalDate = async () => (await utils.findByTestId('history-final-date')) as HTMLInputElement;

  return {
    ...utils,
    elements: {
      loadingIndicator,
      initialDate,
      finalDate,
    },
  };
}

function validHistory() {
  return {
    name: 'any',
    prices: [
      {
        opening: 14.05,
        low: 13.77,
        high: 14.6,
        closing: 14.35,
        pricedAt: '2021-10-22',
        volume: 36461100,
      },
      {
        opening: 14.49,
        low: 13.77,
        high: 14.61,
        closing: 14.16,
        pricedAt: '2021-10-21',
        volume: 34002600,
      },
      {
        opening: 15.68,
        low: 14.85,
        high: 15.68,
        closing: 15.01,
        pricedAt: '2021-10-20',
        volume: 36340900,
      },
    ],
  };
}
