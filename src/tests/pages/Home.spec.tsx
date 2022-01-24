import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';

import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';

jest.mock('next/router', () => {
  return {
    useRouter: () => ({ push: jest.fn() }),
  };
});

jest.mock('next-auth/react', () => {
  return {
    useSession: () => ({ data: null }),
  };
});

jest.mock('../../services/stripe');

describe('Home page', () => {
  it('should be able to renders correctly', () => {
    render(
      <Home
        product={{
          priceId: 'fake-price-id',
          amount: 100,
          amountFormatted: 'R$ 100,00',
          recurringInterval: 'month',
        }}
      />,
    );

    expect(screen.getByText(/R\$ 100,00/i)).toBeInTheDocument();
  });

  it('should load initial data', async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
      recurring: {
        interval: 'month',
      },
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: 10,
            amountFormatted: '$10.00',
            recurringInterval: 'month',
          },
        },
      }),
    );
  });
});
